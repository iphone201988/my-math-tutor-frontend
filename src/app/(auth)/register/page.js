'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { APP_NAME } from '@/lib/constants';
import { gradeBands } from '@/data/topics';
import { useSignupMutation } from '@/store/authApi';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Store form data from step 1
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  
  const [gradeBand, setGradeBand] = useState('');
  const [grade, setGrade] = useState('');

  // RTK Query mutation hook
  const [signup, { isLoading, isSuccess, isError, error: apiError }] = useSignupMutation();

  const gradeOptions = {
    primary: ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'],
    secondary: ['6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade'],
    college: ['11th Grade', '12th Grade', 'Undergraduate', 'Graduate']
  };

  // Handle API errors
  useEffect(() => {
    if (isError && apiError) {
      const errorMessage = apiError?.data?.error?.message 
        || apiError?.data?.message 
        || 'Registration failed. Please try again.';
      setError(errorMessage);
    }
  }, [isError, apiError]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      setSuccess('Account created! Please check your email to verify your account.');
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 2000);
    }
  }, [isSuccess, router]);

  // Handle step 1 form submission
  const handleStep1Submit = (e) => {
    e.preventDefault();
    const form = e.target;
    setFormData({
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      password: form.password.value,
    });
    setStep(2);
  };

  // Handle step 2 form submission
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signup({
        ...formData,
        deviceType: 'web',
      }).unwrap();
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg-mesh">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🧮</span>
          <span className="font-display font-bold text-2xl gradient-text">
            {APP_NAME}
          </span>
        </Link>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-neutral-300'}`} />
          <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-primary-500' : 'bg-neutral-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-neutral-300'}`} />
        </div>

        {/* Register Card */}
        <Card variant="glassStrong" className="p-8">
          {/* Success message */}
          {success && (
            <div className="mb-6 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
              {success}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Create your account</h1>
                <p className="text-foreground-secondary">
                  Start your journey to math mastery
                </p>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    defaultValue={formData.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    defaultValue={formData.lastName}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  defaultValue={formData.email}
                  required
                  icon={<span>📧</span>}
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Create a strong password (8+ chars)"
                  defaultValue={formData.password}
                  required
                  minLength={8}
                  icon={<span>🔒</span>}
                />

                <Button type="submit" className="w-full" size="lg">
                  Continue
                  <span className="ml-2">→</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Select your level</h1>
                <p className="text-foreground-secondary">
                  Help us personalize your learning experience
                </p>
              </div>

              <form onSubmit={handleStep2Submit} className="space-y-6">
                {/* Grade Band Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">What level are you studying?</label>
                  <div className="grid gap-3">
                    {gradeBands.map((band) => (
                      <button
                        key={band.id}
                        type="button"
                        onClick={() => { setGradeBand(band.id); setGrade(''); }}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          gradeBand === band.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                            : 'border-[var(--card-border)] hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{band.icon}</span>
                          <div>
                            <p className="font-semibold">{band.label}</p>
                            <p className="text-sm text-foreground-secondary">
                              Grades {band.grades} • {band.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Grade Selection */}
                {gradeBand && (
                  <div className="space-y-3 animate-fade-in">
                    <label className="text-sm font-medium">Select your specific grade</label>
                    <div className="flex flex-wrap gap-2">
                      {gradeOptions[gradeBand]?.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGrade(g)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            grade === g
                              ? 'bg-primary-500 text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    loading={isLoading}
                    disabled={!gradeBand || !grade}
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Divider */}
          {step === 1 && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--card-border)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[var(--card-bg)] text-foreground-secondary">
                    or sign up with
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
            </>
          )}

          {/* Sign In Link */}
          <p className="text-center text-foreground-secondary text-sm mt-8">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign in
            </Link>
          </p>
        </Card>

        {/* Terms */}
        <p className="text-center text-foreground-secondary text-xs mt-6">
          By creating an account, you agree to our{' '}
          <Link href="#" className="text-primary-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
