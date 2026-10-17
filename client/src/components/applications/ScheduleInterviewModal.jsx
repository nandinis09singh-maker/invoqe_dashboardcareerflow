import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, Video } from 'lucide-react';

export default function ScheduleInterviewModal({
  isOpen,
  onClose,
  application,
  onScheduled
}) {
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (application) {
      setInterviewDate(application.interview_date || '');
      setInterviewTime(application.interview_time || '');
      setMeetingLink(application.meeting_link || '');
      setNotes(application.notes || '');
    }
  }, [application, isOpen]);

  if (!application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!interviewDate) {
      toast.error('Please pick an interview date.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.patch(`/applications/${application.id}`, {
        status: 'Interview',
        interview_date: interviewDate,
        interview_time: interviewTime,
        meeting_link: meetingLink,
        timeline_note: `Interview scheduled for ${interviewDate} ${interviewTime ? `at ${interviewTime}` : ''}`
      });

      toast.success('Interview scheduled successfully!');
      if (onScheduled) onScheduled(res.data.application);
      onClose();
    } catch (e) {
      toast.error('Failed to schedule interview.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Interview"
      subtitle={`${application.job?.title} at ${application.job?.company}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Interview Date"
          type="date"
          icon={Calendar}
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
          required
        />

        <Input
          label="Time (e.g. 15:00 or 3:30 PM)"
          type="time"
          icon={Clock}
          value={interviewTime}
          onChange={(e) => setInterviewTime(e.target.value)}
        />

        <Input
          label="Meeting Link / Location"
          type="url"
          icon={Video}
          placeholder="https://meet.google.com/xyz or Zoom link"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
        />

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Save Interview
          </Button>
        </div>
      </form>
    </Modal>
  );
}
