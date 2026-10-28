import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, LogIn, Sparkles } from 'lucide-react';
import { loginSchema } from '../schemas/authSchema';
import { loginUser } from '../api/authApi';
import { parseApiError } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Card, CardContent } from '../components/ui/Card';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Where to redirect after login
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const fillDemoCredentials = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setErrors({});
    setErrorMessage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate using Zod
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      const fieldErrors: { username?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'username' | 'password';
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await loginUser({ username, password });
      const authToken = response.accessToken || response.token || 'demo-token';

      // Save token and session via custom useAuth hook (persisting into Local Storage)
      login(authToken, {
        token: authToken,
        username: response.username,
        name: `${response.firstName} ${response.lastName}`.trim() || response.username,
        email: response.email,
        avatar: response.image,
      });

      setSuccessMessage('Login successful! Redirecting to dashboard...');

      setTimeout(() => {
        navigate(fromLocation, { replace: true });
      }, 700);
    } catch (err) {
      setErrorMessage(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md mb-4">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sign in to access your Product Management Dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-lg">
          <CardContent className="py-8 px-6 sm:px-8">
            {/* Demo credentials banner */}
            <div className="mb-6 p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-between gap-2">
              <div className="text-xs text-indigo-900 dark:text-indigo-200">
                <span className="font-semibold">Demo:</span> emilys / emilyspass
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-fill
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4">
                <Alert variant="error" title="Login Failed" onClose={() => setErrorMessage(null)}>
                  {errorMessage}
                </Alert>
              </div>
            )}

            {successMessage && (
              <div className="mb-4">
                <Alert variant="success" title="Success">
                  {successMessage}
                </Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
                }}
                leftIcon={<User className="w-4 h-4" />}
                placeholder="e.g. emilys"
                error={errors.username}
              />

              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                leftIcon={<Lock className="w-4 h-4" />}
                placeholder="••••••••"
                error={errors.password}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Create one now
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Created by Abdul Samad • Week 5 Project
        </p>
      </div>
    </div>
  );
}
