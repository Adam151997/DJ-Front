import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Account } from '../../types';
import { accountsAPI } from '../../services/api';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface AccountFormProps {
  account?: Account | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  account,
  onClose,
  onSuccess
}) => {
  const isEditing = !!account;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: account?.name || '',
    industry: account?.industry || '',
    website: account?.website || '',
    phone: account?.phone || '',
    billing_address: account?.billing_address || '',
    shipping_address: account?.shipping_address || '',
    annual_revenue: account?.annual_revenue || '',
    description: account?.description || '',
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Account>) => accountsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Account> }) =>
      accountsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && account) {
      updateMutation.mutate({ id: account.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit Account' : 'Add New Account'}
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
              Account Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="industry" className="form-label">
                Industry
              </label>
              <input
                id="industry"
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="website" className="form-label">
                Website
              </label>
              <input
                id="website"
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="annual_revenue" className="form-label">
                Annual Revenue
              </label>
              <input
                id="annual_revenue"
                type="number"
                name="annual_revenue"
                value={formData.annual_revenue}
                onChange={handleChange}
                className="input-field"
                placeholder="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label htmlFor="billing_address" className="form-label">
              Billing Address
            </label>
            <input
              id="billing_address"
              type="text"
              name="billing_address"
              value={formData.billing_address}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="shipping_address" className="form-label">
              Shipping Address
            </label>
            <input
              id="shipping_address"
              type="text"
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              className="input-field"
            />
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
              placeholder="Add notes about this account..."
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
              {isEditing ? 'Update Account' : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
