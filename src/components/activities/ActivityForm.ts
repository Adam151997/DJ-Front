import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesAPI } from '../../services/api';
import { Activity, Lead, Contact, Deal } from '../../types';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface ActivityFormProps {
  activity?: Activity | null;
  relatedObject?: {
    type: 'lead' | 'contact' | 'deal';
    id: number;
    name: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  activity,
  relatedObject,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    activity_type: 'note',
    title: '',
    description: '',
    due_date: '',
    completed: false,
    lead: '',
    contact: '',
    deal: '',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (activity) {
      setFormData({
        activity_type: activity.activity_type,
        title: activity.title,
        description: activity.description,
        due_date: activity.due_date || '',
        completed: activity.completed,
        lead: activity.lead?.toString() || '',
        contact: activity.contact?.toString() || '',
        deal: activity.deal?.toString() || '',
      });
    } else if (relatedObject) {
      setFormData(prev => ({
        ...prev,
        [relatedObject.type]: relatedObject.id.toString(),
      }));
    }
  }, [activity, relatedObject]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      activity
        ? activitiesAPI.update(activity.id, data)
        : activitiesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      lead: formData.lead ? parseInt(formData.lead) : null,
      contact: formData.contact ? parseInt(formData.contact) : null,
      deal: formData.deal ? parseInt(formData.deal) : null,
      due_date: formData.due_date || null,
    };
    
    mutation.mutate(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const activityTypes = [
    { value: 'call', label: 'Phone Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'note', label: 'Note' },
    { value: 'task', label: 'Task' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {activity ? 'Edit Activity' : 'Add New Activity'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="activity_type" className="block text-sm font-medium text-gray-700 mb-1">
              Activity Type *
            </label>
            <select
              id="activity_type"
              name="activity_type"
              required
              value={formData.activity_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter activity title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add activity details..."
            />
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              id="due_date"
              name="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {!relatedObject && (
            <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Link to (optional):</p>
              
              <div>
                <label htmlFor="lead" className="block text-sm text-gray-600 mb-1">
                  Lead ID
                </label>
                <input
                  id="lead"
                  name="lead"
                  type="number"
                  value={formData.lead}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Lead ID"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm text-gray-600 mb-1">
                  Contact ID
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="number"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Contact ID"
                />
              </div>

              <div>
                <label htmlFor="deal" className="block text-sm text-gray-600 mb-1">
                  Deal ID
                </label>
                <input
                  id="deal"
                  name="deal"
                  type="number"
                  value={formData.deal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Deal ID"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={mutation.isPending}
            >
              {activity ? 'Update Activity' : 'Create Activity'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};