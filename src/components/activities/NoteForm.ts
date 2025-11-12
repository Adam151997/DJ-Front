import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesAPI } from '../../services/api';
import { Note } from '../../types';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface NoteFormProps {
  note?: Note | null;
  relatedObject?: {
    type: 'lead' | 'contact' | 'deal';
    id: number;
    name: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  note,
  relatedObject,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    content: '',
    lead: '',
    contact: '',
    deal: '',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (note) {
      setFormData({
        content: note.content,
        lead: note.lead?.toString() || '',
        contact: note.contact?.toString() || '',
        deal: note.deal?.toString() || '',
      });
    } else if (relatedObject) {
      setFormData(prev => ({
        ...prev,
        [relatedObject.type]: relatedObject.id.toString(),
      }));
    }
  }, [note, relatedObject]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      note
        ? notesAPI.update(note.id, data)
        : notesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
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
    };
    
    mutation.mutate(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {note ? 'Edit Note' : 'Add New Note'}
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
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Note Content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              required
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Write your note here..."
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
                  onChange={(e) => setFormData(prev => ({ ...prev, lead: e.target.value }))}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, deal: e.target.value }))}
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
              {note ? 'Update Note' : 'Create Note'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};