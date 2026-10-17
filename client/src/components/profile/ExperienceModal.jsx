import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ExperienceModal({
  isOpen,
  onClose,
  experienceToEdit = null,
  onSaved
}) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (experienceToEdit) {
      setCompany(experienceToEdit.company || '');
      setRole(experienceToEdit.role || '');
      setLocation(experienceToEdit.location || '');
      setStartDate(experienceToEdit.start_date || '');
      setEndDate(experienceToEdit.end_date || '');
      setIsCurrent(Boolean(experienceToEdit.is_current));
      setDescription(experienceToEdit.description || '');
      setSkillsText(
        Array.isArray(experienceToEdit.skills_used)
          ? experienceToEdit.skills_used.join(', ')
          : ''
      );
    } else {
      setCompany('');
      setRole('');
      setLocation('');
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
      setDescription('');
      setSkillsText('');
    }
  }, [experienceToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !startDate) {
      toast.error('Company, role, and start date are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const skills_used = skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        company,
        role,
        location,
        start_date: startDate,
        end_date: isCurrent ? '' : endDate,
        is_current: isCurrent ? 1 : 0,
        description,
        skills_used
      };

      if (experienceToEdit) {
        const res = await api.put(`/profile/experience/${experienceToEdit.id}`, payload);
        toast.success('Work experience updated.');
        if (onSaved) onSaved(res.data.item);
      } else {
        const res = await api.post('/profile/experience', payload);
        toast.success('Work experience added.');
        if (onSaved) onSaved(res.data.item);
      }
      onClose();
    } catch (err) {
      toast.error('Failed to save experience.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={experienceToEdit ? 'Edit Experience' : 'Add Work Experience'}
      subtitle="Employment history, internships, or freelance projects"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Company Name *"
            placeholder="e.g. Swiggy, Razorpay"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <Input
            label="Job Title / Role *"
            placeholder="e.g. Senior Software Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <Input
          label="Location"
          placeholder="e.g. Bengaluru, India (or Remote)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date *"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          {!isCurrent && (
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isCurrent"
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <label htmlFor="isCurrent" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            I currently work in this role
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Description & Key Accomplishments
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your responsibilities, technical achievements, metrics improved (e.g. reduced load times by 35%)..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none leading-relaxed"
          />
        </div>

        <Input
          label="Skills Used (Comma-separated)"
          placeholder="React, TypeScript, Node.js, Docker, PostgreSQL"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
        />

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            {experienceToEdit ? 'Save Changes' : 'Add Experience'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
