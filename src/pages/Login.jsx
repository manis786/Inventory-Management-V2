import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Lock, Mail, Eye, EyeOff, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { login, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard'); // Yahan redirect karo, refresh mat karo!
    } else {
      setIsLoading(false);
      addToast("Login failed, credentials check karein", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Card className="w-full max-w-md border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none animate-fade-in">
        <CardHeader className="flex flex-col items-center border-b border-slate-50 dark:border-slate-800/50 pb-6 pt-8">
          <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight text-center">
            Supermart Operations Center
          </CardTitle>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1.5 text-center">
            Sign in to access Karachi HQ & Lahore Branch ERP records
          </p>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@supermart.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  Password
                </label>
                <a href="#forgot" className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-bold tracking-wide rounded-lg flex justify-center items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </div>
          </form>

          {/* Dummy Credentials Alert Box */}
          <div className="mt-6 p-3 bg-slate-100/60 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-lg text-[11px] text-slate-400 dark:text-slate-500 text-center">
            <span className="font-bold text-slate-500 dark:text-slate-400">Demo User: </span>
            admin@supermart.com | <span className="font-bold text-slate-500 dark:text-slate-400">Pass: </span>admin123
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;