import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Info,
  Banknote,
  User,
  Mail,
  Phone,
  Tag,
  CreditCard,
  Building,
} from 'lucide-react';


interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  seller: {
    _id: string;
    name: string;
  };
}

interface InputProps {
  label: string;
  id: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  icon?: React.ElementType;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, id, type = 'text', value, onChange, placeholder, disabled = false, icon: Icon, required = false }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />}
      <input
        type={type}
        id={id}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
    </div>
  </div>
);

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  icon?: React.ElementType;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon: Icon, type = 'button' }) => {
  const baseStyle = "flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={disabled}>
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      {children}
    </button>
  );
};

const SellerDashboard: React.FC = () => {
  const { user, token, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    name: '',
    mobileNumber: '',
    qualifications: '',
    upiId: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const fetchMyProducts = useCallback(async () => {
    if (!token || !user) return;
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        headers: { 'x-auth-token': token },
      });
      if (res.ok) {
        const allProducts = await res.json();
        const sellerProducts = allProducts.filter((p: Product) => p.seller?._id === user._id);
        setMyProducts(sellerProducts);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [token, user]);

  const resetFormState = useCallback(() => {
    if (user) {
      setFormState({
        name: user.name || '',
        mobileNumber: user.mobileNumber || '',
        qualifications: user.qualifications?.join(', ') || '',
        upiId: user.upiId || '',
        accountHolderName: user.bankAccount?.accountHolderName || '',
        accountNumber: user.bankAccount?.accountNumber || '',
        ifscCode: user.bankAccount?.ifscCode || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        if (user.role !== 'seller') {
            navigate(`/dashboard/${user.role}`);
            return;
        }
        resetFormState();
        fetchMyProducts();
        setLoading(false);
    } else if(!token) {
        setLoading(false);
    }
  }, [user, token, fetchMyProducts, navigate, resetFormState]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });
    try {
      const updatedProfile = {
        name: formState.name,
        mobileNumber: formState.mobileNumber,
        qualifications: formState.qualifications.split(',').map(q => q.trim()).filter(Boolean),
        upiId: formState.upiId,
        bankAccount: {
          accountHolderName: formState.accountHolderName,
          accountNumber: formState.accountNumber,
          ifscCode: formState.ifscCode,
        },
      };

      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (res.ok) {
        fetchUser();
        setMessage({ type: 'success', content: 'Profile updated successfully!' });
        setIsEditingProfile(false);
      } else {
        const errorData = await res.json();
        setMessage({ type: 'error', content: errorData.msg || 'Failed to update profile.' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'An unexpected error occurred.' });
    }
  };

  const handleCancelEdit = () => {
    resetFormState();
    setIsEditingProfile(false);
    setMessage({ type: '', content: '' });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-purple-100 text-lg mt-1">Welcome, {user?.name}!</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-8">
          <nav className="-mb-px flex flex-wrap space-x-8 px-6 border-b">
            <button onClick={() => setActiveTab('profile')} className={`py-4 px-1 border-b-2 font-medium flex items-center ${activeTab === 'profile' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'}`}><User className="mr-2 h-5 w-5"/>My Profile</button>
            <button onClick={() => setActiveTab('products')} className={`py-4 px-1 border-b-2 font-medium flex items-center ${activeTab === 'products' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'}`}><Package className="mr-2 h-5 w-5"/>My Products</button>
          </nav>
        </div>

        <div>
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                {!isEditingProfile && (
                  <Button onClick={() => setIsEditingProfile(true)} variant="secondary" icon={Pencil}>Edit Profile</Button>
                )}
              </div>

              {message.content && (
                  <div className={`p-3 rounded-lg mb-4 text-sm flex items-center ${message.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
                      {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
                      {message.content}
                  </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" id="name" value={formState.name} onChange={handleInputChange} placeholder="Your Name" disabled={!isEditingProfile} icon={User} required />
                    <Input label="Email Address" id="email" type="email" value={user?.email || ''} onChange={() => {}} placeholder="your@email.com" disabled={true} icon={Mail} />
                    <Input label="Mobile Number" id="mobileNumber" type="tel" value={formState.mobileNumber} onChange={handleInputChange} placeholder="e.g., 9876543210" disabled={!isEditingProfile} icon={Phone} required />
                    <Input label="Seller Categories (comma-separated)" id="qualifications" value={formState.qualifications} onChange={handleInputChange} placeholder="e.g., Handicrafts, Food, Textiles" disabled={!isEditingProfile} icon={Tag} />
                </div>

                <div className="bg-gray-50 p-4 rounded-md border">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Banknote className="mr-2"/> Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="UPI ID" id="upiId" value={formState.upiId} onChange={handleInputChange} placeholder="you@upi" disabled={!isEditingProfile} icon={CreditCard} />
                    <Input label="Bank Account Holder Name" id="accountHolderName" value={formState.accountHolderName} onChange={handleInputChange} placeholder="Name as per bank account" disabled={!isEditingProfile} icon={User} />
                    <Input label="Bank Account Number" id="accountNumber" value={formState.accountNumber} onChange={handleInputChange} placeholder="Your account number" disabled={!isEditingProfile} icon={Building} />
                    <Input label="IFSC Code" id="ifscCode" value={formState.ifscCode} onChange={handleInputChange} placeholder="e.g., SBIN0000001" disabled={!isEditingProfile} icon={Info} />
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" onClick={handleCancelEdit} variant="secondary">Cancel</Button>
                    <Button type="submit" icon={CheckCircle}>Save Changes</Button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Products</h2>
                {myProducts.length > 0 ? (
                    <div className="space-y-4">
                        {myProducts.map(product => (
                            <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md"/>
                                    <div>
                                        <p className="font-semibold text-lg">{product.name}</p>
                                        <p className="text-gray-600">₹{product.price}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" onClick={() => alert(`Edit functionality for ${product.name}`)}><Pencil size={16}/></Button>
                                    <Button variant="danger" onClick={() => alert(`Delete functionality for ${product.name}`)}><Trash2 size={16}/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">You have not added any products yet.</p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;