import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Mail, Lock, User, ShieldCheck, Phone } from 'lucide-react';

// --- GOVT ID VERIFICATION DUMMY FUNCTION ---
const verifyGovernmentId = (id: string): boolean => {
  const aadhaarRegex = /^\d{12}$/;
  // Simple check for now, can be improved
  return aadhaarRegex.test(id);
};

const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [role, setRole] = useState('tourist');
  const [govtId, setGovtId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const BackgroundImage = '/Images/Welocome.jpeg';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (authMode === 'signup') {
      if (role === 'admin') {
        setError("Admin role cannot be selected for signup.");
        return;
      }
      if (!name || !email || !password || !mobileNumber) {
        setError("Please fill all required fields.");
        return;
      }
      if ((role === 'guide' || role === 'seller') && !govtId) {
        setError("Aadhaar Number is required for Guides and Sellers.");
        return;
      }
      if ((role === 'guide' || role === 'seller') && !verifyGovernmentId(govtId)) {
        setError("Please enter a valid 12-digit Aadhaar Number.");
        return;
      }

      const success = await signup(name, email, password, mobileNumber, role, govtId);
      if (success) {
        setSuccessMessage('Signup successful! Please sign in.');
        setAuthMode('signin');
      } else {
        setError('Signup failed. Email or Mobile might be in use.');
      }
    } else {
      // --- Admin ko kahin se bhi login karne ki permission ---
      if (email === 'admin@jharkhand.gov.in' && password === 'admin') {
    // --- Admin login properly ---
    const adminUser = {
        _id: 'admin123',
        name: 'Administrator',
        email,
        role: 'admin'
    };
    localStorage.setItem('token', 'admintoken123'); // dummy token
    localStorage.setItem('user', JSON.stringify(adminUser));
    setTimeout(() => navigate('/dashboard/admin'), 100); // navigate after storage
    return;
}

      const success = await login(email, password, role);
      if (success) {
        navigate(`/dashboard/${role}`);
      } else {
        setError('Invalid credentials or role mismatch.');
      }
    }
  };

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <img
        src="/Images/logo-login.png"
        alt="Jharkhand Tourism Logo"
        className="h-20 w-20 object-contain"
      />
      <span className="text-2xl font-semibold text-white">
        Jharkhand Tourism
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-sky-100 flex font-sans">
      {/* Left Panel */}
      <div
        className="w-1/2 hidden lg:flex flex-col justify-between text-white relative bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="relative z-10 flex flex-col justify-between h-full p-12 bg-black/40">
          <Logo />
          <div>
            <h1 className="text-4xl font-bold">Discover Jharkhand</h1>
            <p className="mt-2 text-lg">The Land of Forests, Waterfalls, and Rich Culture.</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/90 shadow-2xl p-8 rounded-xl backdrop-blur-sm">
          <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setAuthMode('signin'); setError(''); setSuccessMessage(''); }}
              className={`w-1/2 py-2.5 rounded-md font-semibold transition-all ${authMode === 'signin' ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setError(''); setSuccessMessage(''); }}
              className={`w-1/2 py-2.5 rounded-md font-semibold transition-all ${authMode === 'signup' ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}
            >
              Sign Up
            </button>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
            {authMode === 'signin' ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-lg mb-4 text-sm">{successMessage}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 p-3 border rounded-lg"
                placeholder="Email Address"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 p-3 border rounded-lg"
                placeholder="Password"
                required
              />
            </div>
            {authMode === 'signup' && (
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
                <input
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="Mobile Number"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-700">I am a:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {['tourist', 'guide', 'seller'].map(r => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`p-2 rounded-lg border-2 capitalize font-medium transition-colors ${
                      role === r
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {authMode === 'signup' && (role === 'guide' || role === 'seller') && (
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
                <input
                  value={govtId}
                  onChange={e => setGovtId(e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="Aadhaar Number for Verification"
                  required
                />
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white p-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center group"
            >
              {isLoading ? 'Processing...' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            <span>Continue with Google</span>
          </button>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-green-600 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
