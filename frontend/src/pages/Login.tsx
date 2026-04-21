import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertCircle, Mail, Lock, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    if (!success) setError('Invalid credentials.');
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen text-black">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Gemini_Generated_Image_7jrxti7jrxti7jrx.png')" }}
        />
        <div className="absolute inset-0 bg-[#c8102e] opacity-0" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-8">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-[2rem] overflow-hidden shadow-5xl ">
              <img
                src="https://central.edu.gh/static/img/fav.png"
                alt="MedVault-CU logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-medium text-white tracking-tight bg-[#dc143c]  border-[#dc143c] rounded-2xl">MedVault - CU</p>
              <p className="text-xl font-bold text-white">Electronic Health Records System</p>
            </div>
          </div>

          <Card className="shadow-2xl shadow-black/10 bg-white text-black border border-gray-200/20 rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 pt-8">
              <div className="space-y-1 text-center">
                <h2 className="text-2xl text-black/80">SIGN IN</h2>
                <p className="text-sm text-gray-600">Access Your Secure Dashboard</p>
              </div>

            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email 
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@hospital.edu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="pl-12 bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:bg-white focus:border-[#dc143c] focus:ring-[#dc143c] transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="pl-12 bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:bg-white focus:border-[#dc143c] focus:ring-[#dc143c] transition-colors"
                    />
                  </div>
                
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full rounded-2xl bg-[#dc143c] text-white shadow-xl shadow-[#dc143c]/25 ring-1 ring-white/15 py-3 text-base font-semibold uppercase tracking-[0.08em] transition duration-200 ease-out hover:-translate-y-0.5 hover:animate-pulse disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-black/70 text-sm">
                <Shield className="h-4 w-4" />
                <span>Secure & HIPAA Compliant</span>
            </div>
            <p className="text-xs text-black/70 ">© 2026 Central University. All rights reserved.</p>
          </div>     
              </form>
            </CardContent>
          </Card>

          {/* <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
              <Shield className="h-4 w-4" />
              <span>Secure & HIPAA Compliant</span>
            </div>
            <p className="text-xs text-white/50 ">© 2026 Central University. All rights reserved.</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
