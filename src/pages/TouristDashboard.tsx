import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, ShoppingCart, ShieldCheck, User, ListOrdered, Trash2, Hash } from 'lucide-react';
import QRCode from "react-qr-code"; 

// Hamare data ke liye Interfaces
interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  seller: { _id: string; name: string; isVerified: boolean; upiId?: string; };
}
interface Guide {
  _id: string;
  name: string;
  qualifications: string[];
  isVerified: boolean;
  pricePerDay?: number;
  upiId?: string;
}
interface Transaction {
    _id: string;
    to: { name: string };
    amount: number;
    product?: { name: string };
    createdAt: string;
    transactionHash: string;
}
type PaymentItem = {
  type: 'guide' | 'product' | 'cart';
  item: Guide | Product | Product[];
  totalAmount: number;
};

const TouristDashboard: React.FC = () => {
  const { user, token, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('guides');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const [guidesRes, productsRes, transRes] = await Promise.all([
        fetch('http://localhost:5000/api/guides'),
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/profile/my-transactions', { headers: { 'x-auth-token': token } })
      ]);
      if (guidesRes.ok) setGuides(await guidesRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (transRes.ok) setTransactions(await transRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddToCart = async (productId: string) => {
    await fetch(`http://localhost:5000/api/profile/cart/add/${productId}`, {
      method: 'POST',
      headers: { 'x-auth-token': token || '' }
    });
    fetchUser();
  };

  const handleRemoveFromCart = async (productId: string) => {
    await fetch(`http://localhost:5000/api/profile/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token || '' }
    });
    fetchUser();
  };
  
  const handlePaymentConfirmation = async () => {
    if (!paymentInfo || !token) return;

    let paymentPromises: Promise<Response>[] = [];

    if (paymentInfo.type === 'cart') {
        const cartItems = paymentInfo.item as Product[];
        paymentPromises = cartItems.map(item => {
            const paymentData = { to: item.seller._id, amount: item.price, product: item._id };
            return fetch('http://localhost:5000/api/payment/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(paymentData),
            });
        });
    } else {
        let paymentData;
        if (paymentInfo.type === 'product') {
            const item = paymentInfo.item as Product;
            paymentData = { to: item.seller._id, amount: item.price, product: item._id };
        } else { // Guide
            const item = paymentInfo.item as Guide;
            paymentData = { to: item._id, amount: item.pricePerDay || 2000, product: undefined };
        }
        paymentPromises.push(fetch('http://localhost:5000/api/payment/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify(paymentData),
        }));
    }
    
    try {
        const results = await Promise.all(paymentPromises);
        const success = results.every(res => res.ok);
        if (success) {
            alert('Thank you! Your transaction(s) are being recorded on our secure ledger.');
            fetchData(); // Refresh transactions
            if (paymentInfo.type === 'cart') {
                (paymentInfo.item as Product[]).forEach(item => handleRemoveFromCart(item._id));
            }
        } else {
            alert('One or more payments failed.');
        }
    } catch (error) {
        alert('An error occurred during payment.');
    } finally {
        setPaymentInfo(null);
    }
  };
  
  const generateUpiUrl = () => {
      if (!paymentInfo) return "";
      let payeeUpiId = '';
      let payeeName = '';
      if (paymentInfo.type === 'guide') {
          const item = paymentInfo.item as Guide;
          payeeUpiId = item.upiId || '';
          payeeName = item.name;
      } else if (paymentInfo.type === 'product') {
          const item = paymentInfo.item as Product;
          payeeUpiId = item.seller.upiId || '';
          payeeName = item.seller.name;
      } else { // Cart
          const firstItem = (paymentInfo.item as Product[])[0];
          payeeUpiId = firstItem?.seller?.upiId || ''; 
          payeeName = 'Jharkhand Tourism Vendors';
      }
      
      return `upi://pay?pa=${payeeUpiId}&pn=${encodeURIComponent(payeeName)}&am=${paymentInfo.totalAmount}&cu=INR&tn=Payment for Jharkhand Tourism`;
  };

  const handleCheckout = () => {
    if (user?.cart && user.cart.length > 0) {
      // 👉 Yaha pe TS ko force karna hai ki ye Product[] hai
      const totalAmount: number = (user.cart as Product[]).reduce(
        (sum: number, item: Product) => sum + Number(item.price),
        0
      );

      setPaymentInfo({
        type: "cart",
        item: user.cart as Product[], // ✅ type cast
        totalAmount,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl text-white p-8 mb-8">
          <h1 className="text-3xl font-bold">Explore Jharkhand</h1>
          <p className="text-emerald-100 text-lg mt-1">Find verified local guides and authentic handicrafts.</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <nav className="-mb-px flex flex-wrap space-x-8 px-6 border-b">
            <button onClick={() => setActiveTab('guides')} className={`py-4 px-1 border-b-2 font-medium flex items-center ${activeTab === 'guides' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500'}`}><Search className="mr-2 h-5 w-5"/>Find Guides</button>
            <button onClick={() => setActiveTab('shop')} className={`py-4 px-1 border-b-2 font-medium flex items-center ${activeTab === 'shop' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500'}`}><ShoppingCart className="mr-2 h-5 w-5"/>Shop Local</button>
            <button onClick={() => setActiveTab('profile')} className={`py-4 px-1 border-b-2 font-medium flex items-center ${activeTab === 'profile' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500'}`}><User className="mr-2 h-5 w-5"/>My Profile</button>
            <button onClick={() => setActiveTab('transactions')} className={`py-4 px-1 border-b-2 font-medium flex items-center ${activeTab === 'transactions' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500'}`}><ListOrdered className="mr-2 h-5 w-5"/>My Transactions</button>
          </nav>
        </div>
        
        {loading ? <div className="text-center py-10">Loading...</div> : 
          <div>
            {activeTab === 'guides' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map(guide => (
                  <div key={guide._id} className="bg-white p-5 rounded-lg shadow-md flex flex-col">
                    <h3 className="font-bold text-lg flex items-center">{guide.name} {guide.isVerified && <span title="Verified"><ShieldCheck className="w-5 h-5 ml-2 text-green-500"/></span>}</h3>
                    <p className="text-sm text-gray-600 my-2 flex-grow"><span className="font-semibold">Skills:</span> {guide.qualifications.join(', ') || 'N/A'}</p>
                    <button onClick={() => setPaymentInfo({ type: 'guide', item: guide, totalAmount: guide.pricePerDay || 2000 })} className="w-full mt-auto bg-blue-600 text-white py-2 rounded-lg font-semibold">Hire for ₹{guide.pricePerDay || 2000}/day</button>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'shop' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover"/>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center">by {product.seller.name} {product.seller.isVerified && <span title="Verified Seller"><ShieldCheck className="w-4 h-4 ml-1 text-green-500"/></span>}</p>
                      <p className="font-extrabold text-xl my-2">₹{product.price}</p>
                      <button onClick={() => handleAddToCart(product._id)} className="w-full mt-auto bg-emerald-600 text-white py-2 rounded-lg font-semibold">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold">My Profile</h2>
                <p className="mt-2"><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <h3 className="text-xl font-bold mt-6 mb-2">My Cart</h3>
                {user?.cart && user.cart.length > 0 ? (
                  <div className="space-y-2">
                    {user.cart.map(item => (
                      <div key={item._id} className="flex justify-between items-center p-2 border rounded">
                        <span>{item.name} - ₹{item.price}</span>
                        <button onClick={() => handleRemoveFromCart(item._id)} className="text-red-500"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button onClick={handleCheckout} className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold">Proceed to Checkout (₹{user.cart.reduce((sum, item) => sum + item.price, 0)})</button>
                  </div>
                ) : <p>Your cart is empty.</p>}
              </div>
            )}
            {activeTab === 'transactions' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">My Transaction History</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item/Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Txn Hash</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.length > 0 ? transactions.map(tx => (
                                <tr key={tx._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.to?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">₹{tx.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.product?.name || 'Guide Service'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={tx.transactionHash}><Hash size={14}/> {tx.transactionHash.substring(0,8)}...</td>
                                </tr>
                            )) : <tr><td colSpan={5} className="text-center py-10 text-gray-500">You have not made any transactions yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
              </div>
            )}
          </div>
        }
        
        {paymentInfo && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                    <h2 className="text-2xl font-bold mb-4">Scan to Pay</h2>
                    <p className="text-gray-700 mb-4">
                      Pay <span className="font-bold">₹{paymentInfo.totalAmount}</span> to <span className="font-bold">{
                        paymentInfo.type === 'guide' ? (paymentInfo.item as Guide).name :
                        paymentInfo.type === 'product' ? (paymentInfo.item as Product).seller.name : 'Various Sellers'
                      }</span>.
                    </p>
                    <div className="p-4 border rounded-lg inline-block bg-white">
                        <QRCode value={generateUpiUrl()} size={200} />
                    </div>
                    <p className="text-sm text-gray-500 my-4">Scan this QR with any UPI app (Google Pay, PhonePe, etc.).</p>
                    <div className="flex flex-col gap-4 mt-6">
                        <button onClick={handlePaymentConfirmation} className="w-full px-6 py-3 rounded bg-green-600 text-white hover:bg-green-700 font-semibold">I Have Paid</button>
                        <button onClick={() => setPaymentInfo(null)} className="w-full px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TouristDashboard;

