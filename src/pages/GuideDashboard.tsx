import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Banknote, BookUser, ShieldCheck, ListOrdered } from 'lucide-react';


// Transaction data ke liye ek Interface
interface Transaction {
    _id: string;
    from: { name: string };
    amount: number;
    product?: { name: string };
    createdAt: string;
}

const GuideDashboard: React.FC = () => {
  const { user, token, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [qualifications, setQualifications] = useState('');
  const [bankDetails, setBankDetails] = useState({ accountHolderName: '', accountNumber: '', ifscCode: '' });
  const [upiId, setUpiId] = useState('');
  const [pricePerDay, setPricePerDay] = useState(2000);
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Jab user data context se update ho, to form fields ko update karein
  useEffect(() => {
    if (user) {
      setQualifications(user.qualifications?.join(', ') || '');
      // <<-- YAHAN BADLAV KIYA GAYA HAI -->>
      // Har detail ko alag-alag check karein taaki error na aaye
      setBankDetails({
        accountHolderName: user.bankAccount?.accountHolderName || '',
        accountNumber: user.bankAccount?.accountNumber || '',
        ifscCode: user.bankAccount?.ifscCode || '',
      });
      setUpiId(user.upiId || '');
      setPricePerDay(user.pricePerDay || 2000);
    }
  }, [user]);

  // Sirf transactions fetch karne ke liye alag se useEffect
  useEffect(() => {
    const fetchTransactions = async () => {
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/profile/my-transactions', { 
            headers: { 'x-auth-token': token } 
          });
          if (res.ok) {
            setTransactions(await res.json());
          }
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
        }
      }
    };
    fetchTransactions();
  }, [token]);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const qualsArray = qualifications.split(',').map(q => q.trim()).filter(Boolean);
    try {
        const res = await fetch('http://localhost:5000/api/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
            body: JSON.stringify({ qualifications: qualsArray, bankAccount: bankDetails, upiId, pricePerDay })
        });
        if (res.ok) {
            setMessage('Profile updated successfully!');
            fetchUser(); // Context se user data refresh karein
        } else {
            setMessage('Failed to update profile.');
        }
    } catch (error) {
        setMessage('An error occurred.');
    }
  };

  const maskAccountNumber = (num: string = '') => num ? `**** **** ${num.slice(-4)}` : 'Not Added';

  const ProfileTab = (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow space-y-8">
      {message && <p className={`text-center p-3 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div>
          <h3 className="text-xl font-bold flex items-center text-gray-800"><img src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_170312.png" alt="UPI" className="w-6 h-6 mr-2"/>Your UPI ID</h3>
          <p className="text-gray-500 mt-1 mb-2">Enter your UPI ID to receive payments directly (e.g., yourname@okbank).</p>
          <input type="text" placeholder="yourname@okbank" value={upiId} onChange={e => setUpiId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div>
          <h3 className="text-xl font-bold flex items-center text-gray-800"><BookUser className="mr-3 text-blue-500"/>Your Qualifications</h3>
          <p className="text-gray-500 mt-1 mb-2">Enter your skills, separated by commas (e.g., History Expert, Fluent in English).</p>
          <textarea 
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold flex items-center text-gray-800"><Banknote className="mr-3 text-green-500"/>Bank Account Details</h3>
          <div className="grid md:grid-cols-3 gap-4 mt-2">
            <input type="text" placeholder="Account Holder Name" value={bankDetails.accountHolderName} onChange={e => setBankDetails({...bankDetails, accountHolderName: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
            <input type="text" placeholder="Account Number" value={bankDetails.accountNumber} onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
            <input type="text" placeholder="IFSC Code" value={bankDetails.ifscCode} onChange={e => setBankDetails({...bankDetails, ifscCode: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
          </div>
            <p className="text-sm text-gray-500 mt-2">Your current account number: <span className="font-semibold">{maskAccountNumber(bankDetails.accountNumber)}</span></p>
        </div>
        <div>
          <h3 className="text-xl font-bold flex items-center text-gray-800">Your Price Per Day (in ₹)</h3>
           <input type="number" value={pricePerDay} onChange={e => setPricePerDay(Number(e.target.value))} className="w-full md:w-1/3 mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Save Changes</button>
      </form>
    </div>
  );

  const TransactionsTab = (
    <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><ListOrdered className="mr-2"/> Your Transaction History</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid By (Tourist)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.length > 0 ? transactions.map(tx => (
                        <tr key={tx._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.from?.name || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">₹{tx.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.product?.name || 'Guide Service'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</td>
                        </tr>
                    )) : <tr><td colSpan={4} className="text-center py-10 text-gray-500">You have not received any payments yet.</td></tr>}
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white p-8 mb-8">
              <h1 className="text-3xl font-bold">Guide Dashboard</h1>
              <p className="text-blue-100 text-lg mt-1">Welcome, {user?.name}!</p>
              {user?.isVerified && <div className="mt-2 inline-flex items-center bg-green-500 px-3 py-1 rounded-full text-sm font-semibold"><ShieldCheck className="mr-2"/>Verified</div>}
         </div>
         <div className="bg-white rounded-lg shadow-sm mb-8">
            <nav className="-mb-px flex space-x-8 px-6 border-b">
                <button onClick={() => setActiveTab('profile')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Profile & Bank</button>
                <button onClick={() => setActiveTab('transactions')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'transactions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>My Transactions</button>
            </nav>
         </div>
         {activeTab === 'profile' && ProfileTab}
         {activeTab === 'transactions' && TransactionsTab}
      </div>
    </div>
  );
};

export default GuideDashboard;

