import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailTemplatesAPI } from '../services/api';
import { EmailTemplate } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RichTextEditor } from '../components/ui/RichTextEditor';
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  Copy,
  Eye,
  XCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface EmailTemplateFormProps {
  template?: EmailTemplate | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({ template, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: template?.name || '',
    template_type: template?.template_type || 'custom',
    subject: template?.subject || '',
    body_html: template?.body_html || '',
    body_text: template?.body_text || '',
    preview_text: template?.preview_text || '',
    category: template?.category || 'newsletter',
    is_active: template?.is_active ?? true,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => emailTemplatesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      onSuccess();
      alert('Template created successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to create template');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => emailTemplatesAPI.update(template!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      onSuccess();
      alert('Template updated successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to update template');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (template) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-theme-bg-primary rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-theme-border-primary sticky top-0 bg-theme-bg-primary">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {template ? 'Edit Email Template' : 'Create Email Template'}
            </h2>
            <button onClick={onClose} className="text-theme-text-tertiary hover:text-theme-text-secondary">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="form-label">Template Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Monthly Newsletter Template"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Template Type *</label>
              <select
                className="form-select"
                value={formData.template_type}
                onChange={(e) => setFormData({ ...formData, template_type: e.target.value as any })}
                required
              >
                <option value="welcome">Welcome Email</option>
                <option value="follow_up">Follow Up</option>
                <option value="proposal">Proposal</option>
                <option value="thank_you">Thank You</option>
                <option value="reminder">Reminder</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="newsletter">Newsletter</option>
                <option value="promotional">Promotional</option>
                <option value="transactional">Transactional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Email Subject *</label>
            <input
              type="text"
              className="form-input"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Your monthly newsletter is here!"
              required
            />
            <p className="text-xs text-theme-text-secondary mt-1">
              You can use variables: {'{{contact_name}}, {{company_name}}, {{email}}'}
            </p>
          </div>

          <div>
            <label className="form-label">Preview Text (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={formData.preview_text}
              onChange={(e) => setFormData({ ...formData, preview_text: e.target.value })}
              placeholder="This shows up in email client previews..."
            />
            <p className="text-xs text-theme-text-secondary mt-1">
              The snippet shown in inbox before opening the email
            </p>
          </div>

          <div>
            <label className="form-label">Email Body *</label>
            <RichTextEditor
              value={formData.body_html}
              onChange={(value) => setFormData({ ...formData, body_html: value })}
              placeholder="Start writing your email..."
              height="400px"
              showVariables={true}
            />
            <p className="text-xs text-theme-text-secondary mt-1">
              Use the toolbar to format your email. Click "Insert Variable" to add personalization.
            </p>
          </div>

          <div>
            <label className="form-label">Plain Text Version *</label>
            <textarea
              className="form-input"
              value={formData.body_text}
              onChange={(e) => setFormData({ ...formData, body_text: e.target.value })}
              placeholder="Hello {{contact_name}},&#10;&#10;Your email content here..."
              rows={6}
              required
            />
            <p className="text-xs text-theme-text-secondary mt-1">
              Fallback for email clients that don't support HTML
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-theme-text-secondary">
              Active (available for use in campaigns)
            </label>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-1">Template Variables</p>
            <p className="text-sm text-blue-700">
              Use double curly braces to insert dynamic content: {'{{contact_name}}, {{email}}, {{company_name}}, {{first_name}}, {{last_name}}'}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-theme-border-primary">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {template ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EmailTemplates: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: () => emailTemplatesAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => emailTemplatesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      alert('Template deleted successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to delete template');
    },
  });

  const handleDelete = (template: EmailTemplate) => {
    if (window.confirm(`Delete template "${template.name}"?`)) {
      deleteMutation.mutate(template.id);
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowForm(true);
  };

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      await emailTemplatesAPI.create({
        ...template,
        name: `${template.name} (Copy)`,
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      alert('Template duplicated successfully!');
    } catch (error: any) {
      alert(error?.response?.data?.detail || 'Failed to duplicate template');
    }
  };

  const templateTypeColors: Record<string, string> = {
    welcome: 'bg-green-100 text-green-700',
    follow_up: 'bg-blue-100 text-blue-700',
    proposal: 'bg-purple-100 text-purple-700',
    thank_you: 'bg-pink-100 text-pink-700',
    reminder: 'bg-yellow-100 text-yellow-700',
    custom: 'bg-gray-100 text-gray-700',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Mail className="w-8 h-8 animate-pulse mx-auto text-blue-600" />
          <p className="mt-2 text-theme-text-secondary">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-semibold text-theme-text-primary">Email Templates</h1>
          </div>
          <p className="text-theme-text-secondary">
            Create and manage reusable email templates for your campaigns
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first email template to use in campaigns
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template: EmailTemplate) => (
            <Card key={template.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                      <Mail className="w-5 h-5" />
                    </div>
                    {!template.is_active && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        Inactive
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${templateTypeColors[template.template_type]}`}>
                    {template.template_type.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-theme-text-secondary mb-1 font-medium">Subject:</p>
                <p className="text-sm text-theme-text-secondary mb-3 line-clamp-2">{template.subject}</p>

                {template.category && (
                  <div className="text-xs text-theme-text-secondary mb-3">
                    Category: <span className="font-medium">{template.category}</span>
                  </div>
                )}

                {(template.avg_open_rate !== undefined || template.times_used !== undefined) && (
                  <div className="flex gap-4 text-xs text-theme-text-secondary mb-3 pb-3 border-b">
                    {template.times_used !== undefined && (
                      <div>
                        <span className="font-medium">{template.times_used}</span> uses
                      </div>
                    )}
                    {template.avg_open_rate !== undefined && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-medium">{(template.avg_open_rate * 100).toFixed(1)}%</span> open
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 text-sm px-3 py-2 bg-theme-bg-tertiary hover:bg-theme-bg-secondary rounded-lg flex items-center justify-center gap-1"
                    title="Preview template"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="text-sm px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg"
                    title="Edit template"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="text-sm px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg"
                    title="Duplicate template"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template)}
                    className="text-sm px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg"
                    title="Delete template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Form Modal */}
      {showForm && (
        <EmailTemplateForm
          template={selectedTemplate}
          onClose={() => {
            setShowForm(false);
            setSelectedTemplate(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedTemplate(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-theme-bg-primary rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-theme-border-primary sticky top-0 bg-theme-bg-primary">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Template Preview</h2>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-theme-text-tertiary hover:text-theme-text-secondary"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{previewTemplate.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${templateTypeColors[previewTemplate.template_type]}`}>
                  {previewTemplate.template_type.replace('_', ' ')}
                </span>
              </div>

              <div>
                <p className="text-sm text-theme-text-secondary mb-1 font-medium">Subject:</p>
                <p className="text-base">{previewTemplate.subject}</p>
              </div>

              {previewTemplate.preview_text && (
                <div>
                  <p className="text-sm text-theme-text-secondary mb-1 font-medium">Preview Text:</p>
                  <p className="text-sm text-theme-text-secondary">{previewTemplate.preview_text}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-theme-text-secondary mb-2 font-medium">HTML Preview:</p>
                <div className="border rounded-lg p-4 bg-theme-bg-tertiary max-h-96 overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: previewTemplate.body_html }} />
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-theme-text-secondary mb-2 font-medium">Plain Text Version:</p>
                <div className="border rounded-lg p-4 bg-theme-bg-tertiary max-h-48 overflow-auto">
                  <pre className="whitespace-pre-wrap text-sm">{previewTemplate.body_text}</pre>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
