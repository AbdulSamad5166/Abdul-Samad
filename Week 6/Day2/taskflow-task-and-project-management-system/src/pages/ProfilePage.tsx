import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { profileSchema, ProfileFormData } from '../schemas/profile';
import { changePasswordSchema, ChangePasswordFormData } from '../schemas/auth';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { formatDate } from '../utils/dateHelpers';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof ChangePasswordFormData, string>>>({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = profileSchema.safeParse({ name, email });
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProfileFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === 'name' || field === 'email') fieldErrors[field] = issue.message;
      });
      setProfileErrors(fieldErrors);
      return;
    }

    setProfileErrors({});
    setIsUpdatingProfile(true);
    try {
      await updateProfile(name, email);
      toast.success('Profile updated successfully!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ChangePasswordFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === 'currentPassword' || field === 'newPassword' || field === 'confirmNewPassword') {
          fieldErrors[field] = issue.message;
        }
      });
      setPasswordErrors(fieldErrors);
      return;
    }

    setPasswordErrors({});
    setIsUpdatingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <PageHeader
        pill="Account"
        title="My Profile"
        description="Manage your account profile, personal credentials, and authentication details"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Col: Avatar Card */}
        <div className="md:col-span-1">
          <Card headerPill="Identity" title="User Card">
            <div className="flex flex-col items-center text-center py-4">
              <Avatar initials={user?.avatarInitials || 'HA'} size="xl" className="shadow-lg" />
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                {user?.name || 'Hafiz Ali'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
              <span className="mt-3 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Verified Account
              </span>

              <div className="mt-6 w-full border-t border-slate-100 pt-4 text-left text-xs text-slate-500 dark:border-slate-800">
                <div className="flex justify-between py-1">
                  <span>Role:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Lead Administrator
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Member Since:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.createdAt ? formatDate(user.createdAt) : 'Oct 2026'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Storage:</span>
                  <span className="font-semibold text-emerald-600">Local &amp; Offline</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 2 Cols: Edit Profile & Password */}
        <div className="space-y-6 md:col-span-2">
          {/* Edit Profile Form */}
          <Card headerPill="Profile" title="Personal Information">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={profileErrors.name}
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={profileErrors.email}
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingProfile}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password Form */}
          <Card headerPill="Security" title="Change Password">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                error={passwordErrors.currentPassword}
                placeholder="••••••••"
              />
              <Input
                label="New Password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={passwordErrors.newPassword}
                placeholder="At least 8 chars, 1 uppercase, 1 digit, 1 symbol"
              />
              <Input
                label="Confirm New Password"
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                error={passwordErrors.confirmNewPassword}
                placeholder="Re-type new password"
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingPassword}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
