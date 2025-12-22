'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { APP_NAME } from '@/lib/constants';
import { useSigninMutation } from '@/store/authApi';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState('');
    const justRegistered = searchParams.get('registered') === 'true';
    const passwordReset = searchParams.get('reset') === 'true';

    // RTK Query mutation hook
    const [signin, { isLoading, isSuccess, isError, error: apiError }] = useSigninMutation();

    // Handle API errors
    useEffect(() => {
        if (isError && apiError) {
            const errorMessage = apiError?.data?.error?.message
                || apiError?.data?.message
                || 'Login failed. Please try again.';
            setError(errorMessage);
        }
    }, [isError, apiError]);

    // Redirect on success
    useEffect(() => {
        if (isSuccess) {
            router.push('/dashboard');
        }
    }, [isSuccess, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            await signin({
                email,
                password,
                deviceType: 'web',
            }).unwrap();
        } catch (err) {
            // Error is handled by useEffect above
            console.error('Login error:', err);
        }
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

                    {/* Success message for just registered users */}
                    {justRegistered && (
                        <div className="mb-6 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
                            Account created! Please check your email to verify your account before signing in.
                        </div>
                    )}

                    {/* Success message for password reset */}
                    {passwordReset && (
                        <div className="mb-6 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
                            Password reset successful! You can now sign in with your new password.
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
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
                                <input type="checkbox" name="remember" className="rounded border-neutral-300" />
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
                            loading={isLoading}
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
