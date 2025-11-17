import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Opportunity } from '../../types';
import { opportunitiesAPI, contactsAPI, accountsAPI } from '../../services/api';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface OpportunityFormProps {
  opportunity?: Opportunity | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const OpportunityForm: React.FC<OpportunityFormProps> = ({
  opportunity,
  onClose,
  onSuccess
}) => {
  const isEditing = !!opportunity;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: opportunity?.name || '',
    amount: opportunity?.amount || '',
    close_date: opportunity?.close_date || '',
    probability: opportunity?.probability || 50,
    description: opportunity?.description || '',
    contact: opportunity?.contact || '',
    account: opportunity?.account || '',
  });

  // Fetch contacts and accounts for dropdowns
  const { data: contactsResponse } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactsAPI.getAll(),
  });

  const { data: accountsResponse } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsAPI.getAll(),
  });

  // Handle both paginated and non-paginated responses
  const contacts = Array.isArray(contactsResponse)
    ? contactsResponse
    : contactsResponse?.results || [];

  const accounts = Array.isArray(accountsResponse)
    ? accountsResponse
    : accountsResponse?.results || [];

  const createMutation = useMutation({
    mutationFn: (data: Partial<Opportunity>) => opportunitiesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Opportunity> }) =>
      opportunitiesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && opportunity) {
      updateMutation.mutate({ id: opportunity.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'probability' ? parseInt(value) || 0 : value
    }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit Opportunity' : 'Add New Opportunity'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="name" className="form-label">
              Opportunity Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="e.g., Q4 Enterprise Deal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="form-label">
                Amount *
              </label>
              <input
                id="amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input-field"
                required
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="close_date" className="form-label">
                Expected Close Date *
              </label>
              <input
                id="close_date"
                type="date"
                name="close_date"
                value={formData.close_date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="probability" className="form-label">
              Probability: {formData.probability}%
            </label>
            <input
              id="probability"
              type="range"
              name="probability"
              value={formData.probability}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              min="0"
              max="100"
              step="5"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact" className="form-label">
                Contact
              </label>
              <select
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select a contact</option>
                {contacts?.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="account" className="form-label">
                Account
              </label>
              <select
                id="account"
                name="account"
                value={formData.account}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select an account</option>
                {accounts?.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows={4}
              placeholder="Add notes about this opportunity..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="flex-1"
            >
              {isEditing ? 'Update Opportunity' : 'Create Opportunity'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
