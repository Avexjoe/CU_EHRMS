import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertCircle, Mail, Lock, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    if (!success) setError('Invalid credentials.');
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordMessage('');
    setForgotPasswordLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (response.ok) {
        setForgotPasswordMessage(
          'Password reset link sent to your email. Please check your inbox.'
        );
        setForgotPasswordEmail('');
      } else {
        const data = await response.json();
        setForgotPasswordError(
          data.message || 'Failed to send reset link. Please try again.'
        );
      }
    } catch (error) {
      setForgotPasswordError('An error occurred. Please try again later.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const closeForgotPasswordDialog = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setForgotPasswordMessage('');
    setForgotPasswordError('');
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
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-[#dc143c] hover:text-[#b01030] font-medium transition-colors mt-2"
                    >
                      Forgot Password?
                    </button>
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

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={closeForgotPasswordDialog}>
        <DialogContent className="sm:max-w-md bg-white text-black border border-gray-200 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">Reset Password</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-6 py-4">
            {forgotPasswordError && (
              <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {forgotPasswordError}
              </div>
            )}
            {forgotPasswordMessage && (
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                <Mail className="h-5 w-5 shrink-0" />
                {forgotPasswordMessage}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="forgotEmail" className="text-sm font-semibold text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="forgotEmail"
                  type="email"
                  placeholder="your.email@hospital.edu"
                  value={forgotPasswordEmail}
                  onChange={e => setForgotPasswordEmail(e.target.value)}
                  required
                  disabled={forgotPasswordMessage !== ''}
                  className="pl-12 bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:bg-white focus:border-[#dc143c] focus:ring-[#dc143c] transition-colors disabled:opacity-50"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={closeForgotPasswordDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-lg bg-[#dc143c] text-white hover:bg-[#b01030]"
                disabled={forgotPasswordLoading || forgotPasswordMessage !== ''}
              >
                {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
