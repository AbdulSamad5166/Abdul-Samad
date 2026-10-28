import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, LoginFormData } from '../schemas/auth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { LogoIcon } from '../components/icons';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === 'email' || field === 'password') fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-scaleIn">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/25">
            <LogoIcon className="w-8 h-8" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome to TaskFlow
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Sign in to manage tasks, collaborate, and track project milestones
          </p>
        </div>

        {serverError && (
          <Alert type="error" onClose={() => setServerError(null)}>
            {serverError}
          </Alert>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
              />
              Remember me
            </label>
            <Link
              to="/register"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Need an account?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Footer link to register */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
