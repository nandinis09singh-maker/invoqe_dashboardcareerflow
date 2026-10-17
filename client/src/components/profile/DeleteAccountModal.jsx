import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

export default function DeleteAccountModal({ isOpen, onClose }) {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirmationInput !== 'DELETE') {
      toast.error('Please type DELETE to confirm.');
      return;
    }

    try {
      setIsDeleting(true);
      const res = await api.delete('/profile', {
        data: { confirmation: 'DELETE' }
      });
      if (res.data.success) {
        toast.success('Your account has been deleted.');
        await logout();
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Account Permanently"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleDelete} className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Warning: This action will permanently erase your account, candidate profile, saved bookmarks, and application tracking history.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Type <span className="font-mono font-bold text-rose-600">DELETE</span> to confirm:
          </label>
          <Input
            placeholder="Type DELETE"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            required
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            type="submit"
            disabled={confirmationInput !== 'DELETE'}
            isLoading={isDeleting}
          >
            Delete Account
          </Button>
        </div>
      </form>
    </Modal>
  );
}
