import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { dealsAPI, customFieldsAPI, pipelineStagesAPI } from '../../services/api';
import { Deal, Contact, CustomField, PipelineStage } from '../../types';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface DealFormProps {
  deal?: Deal | null;
  contacts: Contact[];
  onClose: () => void;
  onSuccess: () => void;
}

export const DealForm: React.FC<DealFormProps> = ({
  deal,
  contacts,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    amount: '',
    stage: 'prospect',
    expected_close_date: '',
    probability: 50,
    notes: '',
  });
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, any>>({});

  const queryClient = useQueryClient();

  // Fetch custom fields
  const { data: customFields } = useQuery({
    queryKey: ['custom-fields', 'deals'],
    queryFn: () => customFieldsAPI.getAll(),
  });

  // Fetch pipeline stages
  const { data: pipelineStages } = useQuery({
    queryKey: ['pipeline-stages'],
    queryFn: () => pipelineStagesAPI.getAll(),
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name,
        contact: deal.contact.toString(),
        amount: deal.amount || '',
        stage: deal.stage,
        expected_close_date: deal.expected_close_date || '',
        probability: deal.probability,
        notes: deal.notes || '',
      });
      // Load custom fields data
      if (deal.custom_data) {
        setCustomFieldsData(deal.custom_data);
      }
    }
  }, [deal]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      deal
        ? dealsAPI.update(deal.id, data)
        : dealsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deals', 'analytics'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      contact: parseInt(formData.contact),
      amount: formData.amount ? parseFloat(formData.amount) : null,
      probability: parseInt(formData.probability.toString()),
      custom_data: customFieldsData,
    };

    mutation.mutate(submitData);
  };

  const handleCustomFieldChange = (fieldName: string, value: any) => {
    setCustomFieldsData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const renderCustomField = (field: CustomField) => {
    const value = customFieldsData[field.name] || field.default_value || '';

    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.field_type}
            required={field.required}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={`Enter ${field.display_name.toLowerCase()}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            required={field.required}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={`Enter ${field.display_name.toLowerCase()}`}
          />
        );

      case 'number':
      case 'currency':
        return (
          <input
            type="number"
            step={field.field_type === 'currency' ? '0.01' : '1'}
            required={field.required}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={`Enter ${field.display_name.toLowerCase()}`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            required={field.required}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value === true || value === 'true'}
              onChange={(e) => handleCustomFieldChange(field.name, e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-600">Yes</label>
          </div>
        );

      case 'select':
        return (
          <select
            required={field.required}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Use dynamic stages or fallback to default
  const stageOptions = pipelineStages && pipelineStages.length > 0
    ? pipelineStages.map(stage => ({
        value: stage.name,
        label: stage.display_name,
      }))
    : [
        { value: 'prospect', label: 'Prospect' },
        { value: 'qualification', label: 'Qualification' },
        { value: 'proposal', label: 'Proposal' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'closed_won', label: 'Won' },
        { value: 'closed_lost', label: 'Lost' },
      ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">
            {deal ? 'Edit Deal' : 'Add New Deal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Deal Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter deal name"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
              Contact *
            </label>
            <select
              id="contact"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.first_name} {contact.last_name} {contact.company ? `- ${contact.company}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
                Stage *
              </label>
              <select
                id="stage"
                name="stage"
                required
                value={formData.stage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {stageOptions.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expected_close_date" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Close Date
              </label>
              <input
                id="expected_close_date"
                name="expected_close_date"
                type="date"
                value={formData.expected_close_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="probability" className="block text-sm font-medium text-gray-700 mb-1">
                Win Probability (%)
              </label>
              <input
                id="probability"
                name="probability"
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.probability}
                onChange={handleChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0%</span>
                <span className="font-medium">{formData.probability}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add any notes about this deal..."
            />
          </div>

          {/* Custom Fields Section */}
          {customFields && customFields.length > 0 && (
            <>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Fields</h3>
                <div className="space-y-4">
                  {customFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.display_name} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {renderCustomField(field)}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
              {deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};