import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#ef4444'  // Rose
];

export default function CollectionModal({
  isOpen,
  onClose,
  collectionToEdit = null,
  onSaved
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (collectionToEdit) {
      setName(collectionToEdit.name || '');
      setColor(collectionToEdit.color || '#6366f1');
    } else {
      setName('');
      setColor('#6366f1');
    }
  }, [collectionToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Collection name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (collectionToEdit) {
        const res = await api.put(`/collections/${collectionToEdit.id}`, { name, color });
        toast.success('Collection updated successfully.');
        if (onSaved) onSaved(res.data.collection);
      } else {
        const res = await api.post('/collections', { name, color });
        toast.success('Collection created successfully.');
        if (onSaved) onSaved(res.data.collection);
      }
      onClose();
    } catch (e) {
      toast.error('Failed to save collection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={collectionToEdit ? 'Edit Collection' : 'Create New Collection'}
      subtitle="Organize your saved jobs into custom folders"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Collection Name"
          placeholder="e.g. Dream Companies, High Salary, Apply Soon"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Color Tag
          </label>
          <div className="flex items-center gap-2 pt-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-offset-2 ring-brand-500' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            {collectionToEdit ? 'Save Changes' : 'Create Folder'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
