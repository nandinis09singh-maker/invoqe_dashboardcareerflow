import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function EducationModal({
  isOpen,
  onClose,
  educationToEdit = null,
  onSaved
}) {
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (educationToEdit) {
      setInstitution(educationToEdit.institution || '');
      setDegree(educationToEdit.degree || '');
      setFieldOfStudy(educationToEdit.field_of_study || '');
      setStartYear(educationToEdit.start_year || '');
      setEndYear(educationToEdit.end_year || '');
      setGrade(educationToEdit.grade || '');
      setDescription(educationToEdit.description || '');
    } else {
      setInstitution('');
      setDegree('');
      setFieldOfStudy('');
      setStartYear('');
      setEndYear('');
      setGrade('');
      setDescription('');
    }
  }, [educationToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) {
      toast.error('Institution and degree are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        institution,
        degree,
        field_of_study: fieldOfStudy,
        start_year: startYear,
        end_year: endYear,
        grade,
        description
      };

      if (educationToEdit) {
        const res = await api.put(`/profile/education/${educationToEdit.id}`, payload);
        toast.success('Education updated.');
        if (onSaved) onSaved(res.data.item);
      } else {
        const res = await api.post('/profile/education', payload);
        toast.success('Education added.');
        if (onSaved) onSaved(res.data.item);
      }
      onClose();
    } catch (err) {
      toast.error('Failed to save education.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={educationToEdit ? 'Edit Education' : 'Add Education'}
      subtitle="Colleges, universities, or degree qualifications"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="College / University / Institution *"
          placeholder="e.g. National Institute of Technology (NIT)"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          required
        />

        <Input
          label="Degree / Certificate *"
          placeholder="e.g. Bachelor of Technology (B.Tech)"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          required
        />

        <Input
          label="Field of Study"
          placeholder="e.g. Computer Science, Information Technology"
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Year"
            type="number"
            placeholder="2018"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
          <Input
            label="End Year (or Expected)"
            type="number"
            placeholder="2022"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
        </div>

        <Input
          label="Grade / CGPA / Percentage"
          placeholder="e.g. 8.8 CGPA or 85%"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Description / Achievements
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Relevant coursework, clubs, or academic honors..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            {educationToEdit ? 'Save Changes' : 'Add Education'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
