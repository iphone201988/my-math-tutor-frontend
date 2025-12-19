'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate login
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Redirect to dashboard (in real app, this would authenticate)
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-bg-mesh">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <span className="text-3xl">🧮</span>
                    <span className="font-display font-bold text-2xl gradient-text">
                        {APP_NAME}
                    </span>
                </Link>

                {/* Login Card */}
                <Card variant="glassStrong" className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
                        <p className="text-foreground-secondary">
                            Sign in to continue your learning journey
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            icon={<span>📧</span>}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            icon={<span>🔒</span>}
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-neutral-300" />
                                <span className="text-foreground-secondary">Remember me</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-primary-600 hover:text-primary-500 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--card-border)]" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[var(--card-bg)] text-foreground-secondary">
                                or continue with
                            </span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" className="w-full">
                            <span className="mr-2">G</span>
                            Google
                        </Button>
                        <Button variant="secondary" className="w-full">
                            <span className="mr-2">🍎</span>
                            Apple
                        </Button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-foreground-secondary text-sm mt-8">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/register"
                            className="text-primary-600 hover:text-primary-500 font-medium"
                        >
                            Sign up free
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}
