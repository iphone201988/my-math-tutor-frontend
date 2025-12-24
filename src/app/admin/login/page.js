'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { APP_NAME } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Force dark theme for admin login
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    // Simulate authentication (dummy)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo credentials check
    if (email === 'admin@mathmentor.ai' && password === 'admin123') {
      localStorage.setItem('adminToken', 'demo-admin-token');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use admin@mathmentor.ai / admin123');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0a0a0a_70%)]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="font-display font-bold text-2xl gradient-text">
            {APP_NAME}
          </h1>
          <p className="text-foreground-secondary mt-1">Admin Console</p>
        </div>

        {/* Login Card */}
        <Card variant="glassStrong" className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">Admin Sign In</h2>
            <p className="text-foreground-secondary text-sm">
              Access the administration panel
            </p>
          </div>

          {/* Demo Credentials Notice */}
          <div className="mb-6 p-3 rounded-lg bg-primary-500/10 border border-primary-500/20 text-sm">
            <p className="text-primary-400 font-medium mb-1">Demo Credentials:</p>
            <p className="text-foreground-secondary">
              Email: <code className="text-primary-300">admin@mathmentor.ai</code>
            </p>
            <p className="text-foreground-secondary">
              Password: <code className="text-primary-300">admin123</code>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="admin@mathmentor.ai"
              required
              icon={<span>📧</span>}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              icon={<span>🔒</span>}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="remember" className="rounded border-neutral-600 bg-neutral-800" />
                <span className="text-foreground-secondary">Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
            >
              Sign In to Admin
            </Button>
          </form>

          {/* Back to Main Site */}
          <div className="mt-6 pt-6 border-t border-[var(--card-border)] text-center">
            <Link
              href="/"
              className="text-foreground-secondary hover:text-foreground text-sm transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Main Site
            </Link>
          </div>
        </Card>

        {/* Security Notice */}
        <p className="text-center text-foreground-secondary text-xs mt-6">
          🔐 This is a secure admin area. All activities are logged.
        </p>
      </div>
    </div>
  );
}
