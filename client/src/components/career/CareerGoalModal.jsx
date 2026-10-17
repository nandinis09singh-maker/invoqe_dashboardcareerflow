import React, { useState, useEffect } from 'react';
import { Target, Calendar, Check, Trash2, Star, Sparkles, Plus } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function CareerGoalModal({
  isOpen,
  onClose,
  currentRole,
  roles = [],
  onGoalUpdated
}) {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [selectedRoleId, setSelectedRoleId] = useState(currentRole?.id || roles[0]?.id || 1);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/career/goals');
      if (res.data.success) {
        setGoals(res.data.goals);
      }
    } catch (e) {
      console.error('Failed to load career goals', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGoals();
      if (currentRole) {
        setSelectedRoleId(currentRole.id);
        setTitle(`Become Senior ${currentRole.title}`);
      }
    }
  }, [isOpen, currentRole]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.post('/career/goals', {
        roleId: selectedRoleId,
        title: title.trim() || undefined,
        targetDate,
        notes,
        isPrimary
      });
      if (res.data.success) {
        toast.success(res.data.message || 'Goal saved successfully!');
        setTitle('');
        setNotes('');
        fetchGoals();
        if (onGoalUpdated) onGoalUpdated();
      }
    } catch (err) {
      toast.error('Failed to save career goal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetPrimary = async (goalId) => {
    try {
      const res = await api.put(`/career/goals/${goalId}`, { isPrimary: true });
      if (res.data.success) {
        toast.success('Updated primary career goal!');
        fetchGoals();
        if (onGoalUpdated) onGoalUpdated();
      }
    } catch (e) {
      toast.error('Failed to set primary goal.');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const res = await api.delete(`/career/goals/${goalId}`);
      if (res.data.success) {
        toast.success('Career goal removed.');
        fetchGoals();
        if (onGoalUpdated) onGoalUpdated();
      }
    } catch (e) {
      toast.error('Failed to remove goal.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Career Goals"
      description="Save target milestones, track overall skill completion, and feature your primary goal on your dashboard."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* ADD GOAL FORM */}
        <form onSubmit={handleCreateGoal} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Set New Career Milestone
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Role
              </label>
              <select
                value={selectedRoleId}
                onChange={(e) => {
                  const rId = parseInt(e.target.value, 10);
                  setSelectedRoleId(rId);
                  const found = roles.find(r => r.id === rId);
                  if (found) setTitle(`Become ${found.title}`);
                }}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>

            <Input
              label="Goal Title"
              placeholder="e.g. Become Staff Full-Stack Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Target Completion Date"
              type="date"
              icon={Calendar}
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />

            <Input
              label="Personal Notes"
              placeholder="e.g. Focus on micro-frontends and AWS"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Set as my primary goal (shown on Dashboard)</span>
            </label>

            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={isSubmitting}
              icon={Plus}
            >
              {isSubmitting ? 'Saving...' : 'Add Goal'}
            </Button>
          </div>
        </form>

        {/* EXISTING SAVED GOALS LIST */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Your Active Career Goals ({goals.length})
          </h4>

          {isLoading ? (
            <div className="space-y-2">
              <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
          ) : goals.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              No career goals set yet. Set your first milestone above!
            </p>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition ${
                    goal.isPrimary
                      ? 'bg-brand-50/50 dark:bg-brand-950/20 border-brand-300 dark:border-brand-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {goal.title}
                      </span>
                      {goal.isPrimary && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Primary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>{goal.roleTitle}</span>
                      <span>•</span>
                      <span>{goal.completedCount} / {goal.totalSkills} skills ({goal.percentage}%)</span>
                      {goal.targetDate && (
                        <>
                          <span>•</span>
                          <span>Target: {goal.targetDate}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!goal.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(goal.id)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition"
                      >
                        Make Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
