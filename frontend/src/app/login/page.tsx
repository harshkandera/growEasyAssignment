'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, setToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipboardList } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (mode === 'signup') {
        response = await authAPI.signup(formData);
      } else {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
      }

      setToken(response.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="border-border">
          <CardHeader className="space-y-6 text-center pb-8 pt-8">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-8 w-8" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-base">
                {mode === 'login'
                  ? 'Sign in to access your todos'
                  : 'Get started with your todo list'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {error && (
                <div className="p-4 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="h-11"
                  />
                  {mode === 'signup' && (
                    <p className="text-xs text-muted-foreground pt-1">
                      At least 6 characters
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-base font-medium mt-6"
                >
                  {loading
                    ? 'Please wait...'
                    : mode === 'login'
                    ? 'Sign In'
                    : 'Create Account'}
                </Button>
              </form>

              <div className="text-center pt-4">
                <button
                  onClick={toggleMode}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {mode === 'login'
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <span className="font-semibold text-foreground underline underline-offset-4">
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
