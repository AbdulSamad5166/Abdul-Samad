import { useState, FormEvent } from 'react';
import { Sun, Moon, Save, UserCheck, Shield, KeyRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { profileSchema, ProfileInput } from '../schemas/profileSchema';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/storage';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export function SettingsPage() {
  const { name, email, username, token } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();

  // Load custom profile data if previously saved in localStorage
  const savedProfile = getStorageItem<ProfileInput | null>(STORAGE_KEYS.PROFILE_DATA, null);

  const [formData, setFormData] = useState<ProfileInput>({
    name: savedProfile?.name || name || '',
    email: savedProfile?.email || email || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessAlert(null);

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    // Persist to Local Storage
    setStorageItem(STORAGE_KEYS.PROFILE_DATA, result.data);
    setSuccessAlert('Profile details updated and saved in Local Storage successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          System Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your account preferences, theme appearance, and authentication session
        </p>
      </div>

      {successAlert && (
        <Alert variant="success" title="Success" onClose={() => setSuccessAlert(null)}>
          {successAlert}
        </Alert>
      )}

      {/* Theme Preference Card */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Theme</CardTitle>
          <CardDescription>
            Toggle between light and dark themes. Preference is stored in browser Local Storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {isDark ? 'Dark Theme Active' : 'Light Theme Active'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current theme is persisted across page refreshes and browser tabs.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              leftIcon={
                isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )
              }
            >
              Switch to {isDark ? 'Light' : 'Dark'} Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Update display name and email address with Zod client-side form validation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4" noValidate>
            <Input
              label="Username"
              type="text"
              value={username}
              disabled
              helperText="Username is managed by the authentication provider"
            />

            <Input
              label="Display Name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Emily Johnson"
              error={errors.name}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="e.g. emily.johnson@example.com"
              error={errors.email}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Auth Token & Session Information Card (Week 5 Concept Review) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <CardTitle>Session & Token Concept (Week 5 Review)</CardTitle>
          </div>
          <CardDescription>
            Demonstrates bearer token storage in Local Storage and authorization headers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Active Bearer Token:
            </div>
            <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 break-all">
              {token ? `${token.slice(0, 48)}...` : 'No active token'}
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>
              Attached automatically to all outgoing Axios requests via request interceptor.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
