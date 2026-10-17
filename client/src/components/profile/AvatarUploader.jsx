import React, { useState } from 'react';
import { Camera, Trash2, Upload, Loader2 } from 'lucide-react';
import { getInitials, getAvatarGradient } from '../../utils/formatters';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AvatarUploader({ user, onAvatarUpdated }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB.');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Avatar updated successfully!');
        if (onAvatarUpdated) onAvatarUpdated(res.data.avatar_url);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      const res = await api.delete('/profile/avatar');
      if (res.data.success) {
        toast.success('Avatar removed.');
        if (onAvatarUpdated) onAvatarUpdated('');
      }
    } catch (err) {
      toast.error('Failed to remove avatar.');
    } finally {
      setIsRemoving(false);
    }
  };

  const avatarUrl = user?.profile?.avatar_url;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="relative group shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user?.name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
          />
        ) : (
          <div
            className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${getAvatarGradient(
              user?.name
            )} flex items-center justify-center text-white text-2xl font-bold shadow-md ring-4 ring-brand-500/20`}
          >
            {getInitials(user?.name)}
          </div>
        )}

        <label className="absolute inset-0 flex items-center justify-center bg-slate-950/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-semibold">
          <Camera className="w-6 h-6" />
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      <div className="flex-1 text-center sm:text-left space-y-2">
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Profile Photo
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload a high-resolution PNG, JPG, or WebP (max 2MB). A professional photo significantly improves recruiter response rates.
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
          <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white cursor-pointer shadow-sm transition">
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>Upload New Photo</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>

          {avatarUrl && (
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              {isRemoving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
