import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, DollarSign, Bell } from 'lucide-react';

export default function JobPreferencesForm({ user, onSaved }) {
  const profile = user?.profile || {};
  const notifPrefs = user?.notificationsPrefs || {};

  const [roles, setRoles] = useState(
    Array.isArray(profile.preferred_roles) ? profile.preferred_roles.join(', ') : ''
  );
  const [locations, setLocations] = useState(
    Array.isArray(profile.preferred_locations) ? profile.preferred_locations.join(', ') : ''
  );
  const [jobTypes, setJobTypes] = useState(
    Array.isArray(profile.preferred_job_types) ? profile.preferred_job_types : ['Full-time', 'Remote']
  );
  const [salaryMin, setSalaryMin] = useState(profile.expected_salary_min || 15);
  const [salaryMax, setSalaryMax] = useState(profile.expected_salary_max || 35);
  const [openToRemote, setOpenToRemote] = useState(profile.open_to_remote !== 0);

  // Notification toggles
  const [emailJobAlerts, setEmailJobAlerts] = useState(notifPrefs.email_job_alerts !== 0);
  const [emailAppUpdates, setEmailAppUpdates] = useState(notifPrefs.email_application_updates !== 0);
  const [emailDigest, setEmailDigest] = useState(notifPrefs.email_weekly_digest !== 0);
  const [inAppNotifs, setInAppNotifs] = useState(notifPrefs.in_app_notifications !== 0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const allJobTypes = ['Full-time', 'Remote', 'Internship', 'Contract', 'Part-time'];

  const toggleJobType = (t) => {
    if (jobTypes.includes(t)) {
      setJobTypes(jobTypes.filter(x => x !== t));
    } else {
      setJobTypes([...jobTypes, t]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const preferred_roles = roles.split(',').map(r => r.trim()).filter(Boolean);
      const preferred_locations = locations.split(',').map(l => l.trim()).filter(Boolean);

      const payload = {
        preferred_roles,
        preferred_locations,
        preferred_job_types: jobTypes,
        expected_salary_min: parseFloat(salaryMin) || 0,
        expected_salary_max: parseFloat(salaryMax) || 0,
        open_to_remote: openToRemote ? 1 : 0,
        email_job_alerts: emailJobAlerts ? 1 : 0,
        email_application_updates: emailAppUpdates ? 1 : 0,
        email_weekly_digest: emailDigest ? 1 : 0,
        in_app_notifications: inAppNotifs ? 1 : 0
      };

      await api.put('/profile/preferences', payload);
      toast.success('Career preferences & notification settings saved!');
      if (onSaved) onSaved(payload);
    } catch (err) {
      toast.error('Failed to save preferences.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Target Roles */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Job Search & Role Preferences
        </h4>

        <Input
          label="Target Roles (Comma-separated)"
          placeholder="e.g. Senior Full-Stack Engineer, Lead Frontend Architect, Tech Lead"
          value={roles}
          onChange={(e) => setRoles(e.target.value)}
        />

        <Input
          label="Preferred Cities (Comma-separated)"
          placeholder="e.g. Bengaluru, Pune, Hyderabad, Mumbai, Remote"
          value={locations}
          onChange={(e) => setLocations(e.target.value)}
        />

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Preferred Job Types
          </label>
          <div className="flex flex-wrap gap-2">
            {allJobTypes.map((type) => {
              const active = jobTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleJobType(type)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                    active
                      ? 'bg-brand-600 border-brand-600 text-white font-semibold'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Salary Expectations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Input
            label="Min Expected Salary (LPA)"
            type="number"
            icon={DollarSign}
            placeholder="18"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
          />
          <Input
            label="Target / Max Salary (LPA)"
            type="number"
            icon={DollarSign}
            placeholder="35"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
          />
        </div>

        {/* Open to remote checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="openToRemote"
            checked={openToRemote}
            onChange={(e) => setOpenToRemote(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <label htmlFor="openToRemote" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            Open to fully remote positions and hybrid opportunities
          </label>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Notification Channels & Alerts
        </h4>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Job Match Alerts
              </p>
              <p className="text-[11px] text-slate-400">
                Receive notifications when new roles matching your target skills are posted
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailJobAlerts}
              onChange={(e) => setEmailJobAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Application Status Updates
              </p>
              <p className="text-[11px] text-slate-400">
                Instant alerts when a recruiter reviews, schedules an interview, or extends an offer
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAppUpdates}
              onChange={(e) => setEmailAppUpdates(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Weekly Career Digest
              </p>
              <p className="text-[11px] text-slate-400">
                Curated weekly summary of hiring trends and top companies in your tech stack
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailDigest}
              onChange={(e) => setEmailDigest(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" type="submit" isLoading={isSubmitting}>
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
