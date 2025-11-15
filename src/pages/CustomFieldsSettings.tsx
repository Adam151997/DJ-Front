import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFieldsAPI } from '../services/api';
import { CustomField } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Plus,
  Edit,
  Trash2,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  Mail,
  Phone,
  AlignLeft,
  DollarSign,
  X
} from 'lucide-react';

const DEAL_OBJECT_ID = 'deals'; // This will be used to filter fields for deals

export const CustomFieldsSettings: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    field_type: 'text' as CustomField['field_type'],
    required: false,
    options: [] as string[],
    default_value: '',
  });

  const queryClient = useQueryClient();

  const { data: fields, isLoading } = useQuery({
    queryKey: ['custom-fields', 'deals'],
    queryFn: () => customFieldsAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => customFieldsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      customFieldsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => customFieldsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      field_type: 'text',
      required: false,
      options: [],
      default_value: '',
    });
    setShowForm(false);
    setEditingField(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      entity_type: 'deal', // Required field for custom fields
      custom_object: null, // Only used for custom objects, null for standard entities
      order: fields ? fields.length : 0,
      options: formData.field_type === 'select' ? formData.options : null,
    };

    if (editingField) {
      updateMutation.mutate({ id: editingField.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      display_name: field.display_name,
      field_type: field.field_type,
      required: field.required,
      options: field.options || [],
      default_value: field.default_value || '',
    });
    setShowForm(true);
  };

  const handleDelete = (field: CustomField) => {
    if (window.confirm(`Delete field "${field.display_name}"? This will remove data from existing deals.`)) {
      deleteMutation.mutate(field.id);
    }
  };

  const fieldTypeIcons = {
    text: Type,
    number: Hash,
    date: Calendar,
    boolean: ToggleLeft,
    select: AlignLeft,
    email: Mail,
    phone: Phone,
    textarea: AlignLeft,
    currency: DollarSign,
  };

  const fieldTypeLabels = {
    text: 'Text',
    number: 'Number',
    date: 'Date',
    boolean: 'Yes/No',
    select: 'Dropdown',
    email: 'Email',
    phone: 'Phone',
    textarea: 'Long Text',
    currency: 'Currency',
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-theme-bg-secondary rounded-lg animate-pulse"></div>
        <div className="bg-theme-bg-primary rounded-xl border border-theme-border-primary p-6 animate-pulse">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-theme-bg-tertiary rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-theme-text-primary mb-2">Custom Fields</h1>
          <p className="text-theme-text-secondary">Add custom fields to your deals</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon={Plus}
          size="lg"
        >
          Add Field
        </Button>
      </div>

      {/* Fields List */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Custom Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fields?.map((field) => {
              const Icon = fieldTypeIcons[field.field_type];
              return (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-4 bg-theme-bg-tertiary rounded-lg hover:bg-theme-bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-5 w-5 text-theme-text-secondary" />

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-theme-text-primary">{field.display_name}</h3>
                        {field.required && (
                          <span className="badge badge-danger">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-theme-text-secondary">
                        {field.name} • {fieldTypeLabels[field.field_type]}
                        {field.options && field.options.length > 0 && (
                          <span className="ml-2">({field.options.length} options)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEdit(field)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(field)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}

            {(!fields || fields.length === 0) && (
              <div className="empty-state">
                <div className="p-4 bg-theme-bg-tertiary rounded-full inline-block mb-4">
                  <Type className="h-10 w-10 text-theme-text-tertiary" />
                </div>
                <h3 className="text-base font-medium text-theme-text-primary mb-1">No custom fields configured</h3>
                <p className="text-sm text-theme-text-secondary">Add your first custom field to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Field Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-theme-bg-primary rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-theme-border-primary sticky top-0 bg-theme-bg-primary">
              <h2 className="text-xl font-semibold">
                {editingField ? 'Edit Field' : 'Add New Field'}
              </h2>
              <button
                onClick={resetForm}
                className="text-theme-text-tertiary hover:text-theme-text-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-label">
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Project Budget"
                />
              </div>

              <div>
                <label className="form-label">
                  Internal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., project_budget"
                />
                <p className="text-xs text-theme-text-secondary mt-1">Lowercase, use underscores (used for API)</p>
              </div>

              <div>
                <label className="form-label">
                  Field Type *
                </label>
                <select
                  required
                  value={formData.field_type}
                  onChange={(e) => setFormData({ ...formData, field_type: e.target.value as CustomField['field_type'] })}
                  className="select-field"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Long Text</option>
                  <option value="number">Number</option>
                  <option value="currency">Currency</option>
                  <option value="date">Date</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="boolean">Yes/No</option>
                  <option value="select">Dropdown</option>
                </select>
              </div>

              {formData.field_type === 'select' && (
                <div>
                  <label className="form-label">
                    Dropdown Options (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.options.join('\n')}
                    onChange={(e) => setFormData({
                      ...formData,
                      options: e.target.value.split('\n').filter(o => o.trim())
                    })}
                    className="textarea-field"
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}

              <div>
                <label className="form-label">
                  Default Value
                </label>
                <input
                  type="text"
                  value={formData.default_value}
                  onChange={(e) => setFormData({ ...formData, default_value: e.target.value })}
                  className="input-field"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.required}
                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-theme-text-secondary">Required field</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-theme-border-primary">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createMutation.isPending || updateMutation.isPending}
                >
                  {editingField ? 'Update Field' : 'Create Field'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
