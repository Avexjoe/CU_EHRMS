import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Activity, AlertCircle } from 'lucide-react';

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
    if (!success) setError('Invalid credentials. Use one of the demo accounts below.');
    setLoading(false);
  };

  const demoAccounts = [
    { email: 'admin@hospital.edu', role: 'Admin' },
    { email: 'doctor@hospital.edu', role: 'Doctor' },
    { email: 'nurse@hospital.edu', role: 'Nurse' },
    { email: 'labtech@hospital.edu', role: 'Lab Tech' },
    { email: 'pharmacist@hospital.edu', role: 'Pharmacist' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
           <div className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 shadow-lg">
             <Activity className="h-7 w-7 text-primary-foreground" />
             <span className="text-xl font-bold tracking-tight text-primary-foreground">MedVault.cu</span>
           </div>
           <p className="text-sm text-muted-foreground">University Hospital EHR System</p>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="pb-4">
            <h2 className="text-center text-lg font-semibold text-foreground">Sign in to your account</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@hospital.edu" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4">
            <p className="mb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Demo Accounts (any password)</p>
            <div className="space-y-1.5">
              {demoAccounts.map(a => (
                <button
                  key={a.email}
                  onClick={() => { setEmail(a.email); setPassword('demo'); }}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <span className="text-muted-foreground">{a.email}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{a.role}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
