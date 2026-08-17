import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, Briefcase, ShoppingCart, TrendingUp, Shield, ShieldCheck, ListOrdered, Hash, Trash2, Package } from 'lucide-react';

// Hamare data ke liye Interfaces
interface StatsData {
  totalUsers: number;
  touristCount: number;
  guideCount: number;
  sellerCount: number;
}
interface VerifiableUser {
    _id: string;
    name: string;
    email: string;
    role: 'guide' | 'seller';
    isVerified: boolean;
    govtId?: string;
}
interface Transaction {
    _id: string;
    from: { name: string };
    to: { name: string };
    amount: number;
    product?: { name: string };
    transactionHash: string;
    createdAt: string;
}
interface Product {
    _id: string;
    name: string;
    price: number;
    seller: { name: string };
}

// Helper component for stat cards
const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | undefined; color: string; }> = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
    <div className={`bg-${color}-100 p-3 rounded-lg`}>{React.cloneElement(icon as React.ReactElement, { className: `h-6 w-6 text-${color}-600` })}</div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? '0'}</p>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
    const { user, token } = useAuth();
    const [stats, setStats] = useState<StatsData | null>(null);
    const [verifiableUsers, setVerifiableUsers] = useState<VerifiableUser[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('verification');

    const fetchDashboardData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [statsRes, usersRes, transRes, productsRes] = await Promise.all([
                fetch('http://localhost:5000/api/analytics/stats', { headers: { 'x-auth-token': token } }),
                fetch('http://localhost:5000/api/admin/verifiable-users', { headers: { 'x-auth-token': token } }),
                fetch('http://localhost:5000/api/admin/transactions', { headers: { 'x-auth-token': token } }),
                fetch('http://localhost:5000/api/admin/products', { headers: { 'x-auth-token': token } })
            ]);
            if (statsRes.ok) setStats(await statsRes.json());
            if (usersRes.ok) setVerifiableUsers(await usersRes.json());
            if (transRes.ok) setTransactions(await transRes.json());
            if (productsRes.ok) setAllProducts(await productsRes.json());
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleVerifyUser = useCallback(async (userId: string) => {
        if (!token) return;
        setMessage('');
        try {
            const response = await fetch(`http://localhost:5000/api/admin/verify/${userId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                setMessage('User verified successfully!');
                fetchDashboardData();
            } else {
                setMessage('Verification failed.');
            }
        } catch (error) {
            setMessage('An error occurred.');
        }
    }, [token, fetchDashboardData]);

    const handleDeleteUser = useCallback(async (userId: string) => {
        if (!token || !window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        setMessage('');
        try {
            const response = await fetch(`http://localhost:5000/api/admin/user/${userId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                setMessage('User deleted successfully!');
                fetchDashboardData();
            } else {
                setMessage('Failed to delete user.');
            }
        } catch (error) {
            setMessage('An error occurred.');
        }
    }, [token, fetchDashboardData]);

    const handleDeleteProduct = useCallback(async (productId: string) => {
        if (!token || !window.confirm('Are you sure you want to delete this product?')) return;
        setMessage('');
        try {
            const response = await fetch(`http://localhost:5000/api/admin/product/${productId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                setMessage('Product deleted successfully!');
                fetchDashboardData();
            } else {
                setMessage('Failed to delete product.');
            }
        } catch (error) {
            setMessage('An error occurred.');
        }
    }, [token, fetchDashboardData]);


    const pieData = stats ? [{ name: 'Tourists', value: stats.touristCount }, { name: 'Guides', value: stats.guideCount }, { name: 'Sellers', value: stats.sellerCount }] : [];
    const COLORS = ['#10B981', '#3B82F6', '#F59E0B']; // Typo fixed
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="14">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div></div>;
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl text-white p-8 mb-8">
                <h1 className="text-3xl font-bold">Admin Control Panel</h1>
                <p className="text-gray-300">Welcome, {user?.name}.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm mb-8">
                <nav className="-mb-px flex flex-wrap space-x-8 px-6 border-b">
                    <button onClick={() => setActiveTab('verification')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'verification' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Verification</button>
                    <button onClick={() => setActiveTab('analytics')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'analytics' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Analytics</button>
                    <button onClick={() => setActiveTab('transactions')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'transactions' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Transactions</button>
                    <button onClick={() => setActiveTab('products')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'products' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Manage Products</button>
                </nav>
            </div>
            
            {message && <div className={`text-center p-3 rounded-md mb-4 ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

            {activeTab === 'verification' && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Shield className="mr-2"/> Guide & Seller Verification</h2>
                    <div className="space-y-3">
                        {verifiableUsers.map(u => (
                            <div key={u._id} className="flex flex-wrap items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-bold">{u.name} <span className="font-normal text-gray-600">({u.role})</span></p>
                                    <p className="text-sm text-gray-500">Aadhaar: {u.govtId || 'Not Provided'}</p>
                                </div>
                                <div className="flex items-center mt-2 sm:mt-0">
                                    {u.isVerified ? <span className="text-green-600 font-semibold flex items-center"><ShieldCheck className="mr-2"/> Verified</span> : <button onClick={() => handleVerifyUser(u._id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Verify</button>}
                                    <button onClick={() => handleDeleteUser(u._id)} className="ml-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={<Users />} title="Total Users" value={stats?.totalUsers} color="indigo" />
                  <StatCard icon={<UserCheck />} title="Tourists" value={stats?.touristCount} color="emerald" />
                  <StatCard icon={<Briefcase />} title="Guides" value={stats?.guideCount} color="blue" />
                  <StatCard icon={<ShoppingCart />} title="Sellers" value={stats?.sellerCount} color="amber" />
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                   <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><TrendingUp className="mr-2" /> User Distribution</h2>
                  <ResponsiveContainer width="100%" height={400}>
                     <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={150} fill="#8884d8" dataKey="value" label={renderCustomizedLabel}>
                        {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} Users`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {activeTab === 'transactions' && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><ListOrdered className="mr-2"/> All Platform Transactions</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Hash</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From (Tourist)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To (Service Provider)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item/Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.length > 0 ? transactions.map(tx => (
                                    <tr key={tx._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={tx.transactionHash}><Hash className="inline-block h-4 w-4 mr-1"/>{tx.transactionHash.substring(0, 12)}...</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.from?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.to?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">₹{tx.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.product?.name || 'Guide Service'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</td>
                                    </tr>
                                )) : <tr><td colSpan={6} className="text-center py-10 text-gray-500">No transactions have been made yet.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Package className="mr-2"/> Manage All Products</h2>
                    <div className="space-y-3">
                        {allProducts.map(p => (
                             <div key={p._id} className="flex flex-wrap items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-bold">{p.name} - ₹{p.price}</p>
                                    <p className="text-sm text-gray-600">Seller: {p.seller.name}</p>
                                </div>
                                <button onClick={() => handleDeleteProduct(p._id)} className="mt-2 sm:mt-0 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

