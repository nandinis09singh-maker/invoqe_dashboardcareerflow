import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Lock, Mail, ShieldAlert, KeyRound } from 'lucide-react';
import DeleteAccountModal from './DeleteAccountModal';

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: 'None', color: 'bg-slate-200' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
  if (score === 3) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
  if (score === 4) return { score: 75, label: 'Good', color: 'bg-blue-500' };
  return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
}

export default function SecuritySettings({ user, onEmailUpdated }) {
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email states
  const [newEmail, setNewEmail] = useState('');
  const [emailPasswordConfirm, setEmailPasswordConfirm] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const strength = getPasswordStrength(newPassword);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await api.put('/profile/password', {
        currentPassword,
        newPassword
      });
      if (res.data.success) {
        toast.success('Password successfully changed!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!newEmail || !emailPasswordConfirm) {
      toast.error('Please enter your new email and current password.');
      return;
    }

    try {
      setIsChangingEmail(true);
      const res = await api.put('/profile/email', {
        newEmail,
        password: emailPasswordConfirm
      });
      if (res.data.success) {
        toast.success('Email address updated successfully!');
        if (onEmailUpdated) onEmailUpdated(newEmail);
        setNewEmail('');
        setEmailPasswordConfirm('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update email.');
    } finally {
      setIsChangingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Change Password
        </h4>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <div className="space-y-1">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {newPassword && (
              <div className="space-y-1 pt-1">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 flex justify-between">
                  <span>Strength: {strength.label}</span>
                  <span>Use 8+ chars, uppercase, and numbers</span>
                </p>
              </div>
            )}
          </div>

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" isLoading={isChangingPassword}>
            Update Password
          </Button>
        </form>
      </div>

      {/* Change Email */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Mail className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Update Email Address
        </h4>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Current email: <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>
        </p>

        <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-lg">
          <Input
            label="New Email Address"
            type="email"
            placeholder="new.email@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />

          <Input
            label="Current Password Confirmation"
            type="password"
            placeholder="••••••••"
            value={emailPasswordConfirm}
            onChange={(e) => setEmailPasswordConfirm(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" isLoading={isChangingEmail}>
            Save New Email
          </Button>
        </form>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-950/80 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm space-y-3">
        <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          Danger Zone: Delete Account
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          Permanently delete your CareerFlow account, profile, resume, saved bookmarks, and all application history. This action cannot be reversed.
        </p>
        <div className="pt-2">
          <Button
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete CareerFlow Account
          </Button>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
