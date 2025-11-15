import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { webhooksAPI } from '../services/api';
import { Webhook } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Plus,
  Edit,
  Trash2,
  Webhook as WebhookIcon,
  CheckCircle2,
  XCircle,
  Activity,
} from 'lucide-react';

interface WebhookFormProps {
  webhook?: Webhook | null;
  onClose: () => void;
  onSuccess: () => void;
}

const WebhookForm: React.FC<WebhookFormProps> = ({ webhook, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: webhook?.name || '',
    url: webhook?.url || '',
    event_types: webhook?.event_types || [],
    secret: webhook?.secret || '',
    headers: webhook?.headers ? JSON.stringify(webhook.headers, null, 2) : '{}',
    is_active: webhook?.is_active ?? true,
  });

  const availableEvents = [
    { value: 'lead.created', label: 'Lead Created' },
    { value: 'lead.updated', label: 'Lead Updated' },
    { value: 'lead.deleted', label: 'Lead Deleted' },
    { value: 'contact.created', label: 'Contact Created' },
    { value: 'contact.updated', label: 'Contact Updated' },
    { value: 'contact.deleted', label: 'Contact Deleted' },
    { value: 'deal.created', label: 'Deal Created' },
    { value: 'deal.updated', label: 'Deal Updated' },
    { value: 'deal.won', label: 'Deal Won' },
    { value: 'deal.lost', label: 'Deal Lost' },
    { value: 'email.sent', label: 'Email Sent' },
    { value: 'email.opened', label: 'Email Opened' },
    { value: 'email.clicked', label: 'Email Clicked' },
  ];

  const createMutation = useMutation({
    mutationFn: (data: any) => webhooksAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      onSuccess();
      alert('Webhook created successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to create webhook');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => webhooksAPI.update(webhook!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      onSuccess();
      alert('Webhook updated successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to update webhook');
    },
  });

  const handleEventToggle = (eventValue: string) => {
    setFormData(prev => ({
      ...prev,
      event_types: prev.event_types.includes(eventValue)
        ? prev.event_types.filter(e => e !== eventValue)
        : [...prev.event_types, eventValue]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let parsedHeaders = {};
    try {
      parsedHeaders = JSON.parse(formData.headers);
    } catch (error) {
      alert('Invalid JSON in headers field');
      return;
    }

    const payload = {
      name: formData.name,
      url: formData.url,
      event_types: formData.event_types,
      secret: formData.secret,
      headers: parsedHeaders,
      is_active: formData.is_active,
    };

    if (webhook) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {webhook ? 'Edit Webhook' : 'Create Webhook'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="form-label">Webhook Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Slack Deal Notifications"
              required
            />
          </div>

          <div>
            <label className="form-label">Webhook URL *</label>
            <input
              type="url"
              className="form-input"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The endpoint that will receive webhook POST requests
            </p>
          </div>

          <div>
            <label className="form-label">Event Types *</label>
            <div className="border rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
              {availableEvents.map((event) => (
                <label key={event.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.event_types.includes(event.value)}
                    onChange={() => handleEventToggle(event.value)}
                    className="rounded"
                  />
                  <span className="text-sm">{event.label}</span>
                  <span className="text-xs text-gray-500 ml-auto font-mono">{event.value}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select which events should trigger this webhook
            </p>
            {formData.event_types.length === 0 && (
              <p className="text-xs text-red-600 mt-1">At least one event type is required</p>
            )}
          </div>

          <div>
            <label className="form-label">Secret Key</label>
            <input
              type="text"
              className="form-input font-mono text-sm"
              value={formData.secret}
              onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              placeholder="your-secret-key-here"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Used to sign webhook requests for verification
            </p>
          </div>

          <div>
            <label className="form-label">Custom Headers (JSON)</label>
            <textarea
              className="form-input font-mono text-sm"
              value={formData.headers}
              onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
              placeholder='{"Authorization": "Bearer token", "Custom-Header": "value"}'
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Custom HTTP headers to include with webhook requests (valid JSON object)
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
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active (webhook will receive events)
            </label>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-1">How it works</p>
            <p className="text-sm text-blue-700">
              When selected events occur, MoldCRM will send a POST request to your webhook URL with event details in the request body.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending || formData.event_types.length === 0}
            >
              {webhook ? 'Update Webhook' : 'Create Webhook'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const WebhookSettings: React.FC = () => {
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const queryClient = useQueryClient();

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => webhooksAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => webhooksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  const testMutation = useMutation({
    mutationFn: (id: number) => webhooksAPI.test(id),
    onSuccess: () => {
      alert('Test webhook sent successfully!');
    },
    onError: () => {
      alert('Failed to send test webhook');
    },
  });

  const handleDelete = (webhook: Webhook) => {
    if (window.confirm(`Delete webhook "${webhook.name}"?`)) {
      deleteMutation.mutate(webhook.id);
    }
  };

  const eventTypeLabels: Record<string, string> = {
    'lead.created': 'Lead Created',
    'lead.updated': 'Lead Updated',
    'contact.created': 'Contact Created',
    'contact.updated': 'Contact Updated',
    'deal.created': 'Deal Created',
    'deal.updated': 'Deal Updated',
    'deal.won': 'Deal Won',
    'deal.lost': 'Deal Lost',
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-20 w-full bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <WebhookIcon className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-semibold text-gray-900">Webhooks</h1>
          </div>
          <p className="text-gray-600">
            Connect with external platforms via webhooks for real-time integrations
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon={Plus}
          size="lg"
        >
          Add Webhook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Webhooks</p>
                <p className="text-2xl font-bold text-gray-900">{webhooks?.length || 0}</p>
              </div>
              <WebhookIcon className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {webhooks?.filter((w: Webhook) => w.is_active).length || 0}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Calls</p>
                <p className="text-2xl font-bold text-gray-900">
                  {webhooks?.reduce((sum: number, w: Webhook) => sum + w.total_calls, 0) || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webhooks List */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Webhooks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="text-left py-3 px-6">Name</th>
                  <th className="text-left py-3 px-6">URL</th>
                  <th className="text-left py-3 px-6">Events</th>
                  <th className="text-left py-3 px-6">Status</th>
                  <th className="text-left py-3 px-6">Calls</th>
                  <th className="text-right py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {webhooks?.map((webhook: Webhook) => (
                  <tr key={webhook.id}>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{webhook.name}</p>
                        {webhook.last_called_at && (
                          <p className="text-xs text-gray-500">
                            Last called: {new Date(webhook.last_called_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600 font-mono truncate max-w-xs">
                        {webhook.url}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {webhook.event_types.slice(0, 2).map((event, index) => (
                          <span key={index} className="badge badge-secondary text-xs">
                            {eventTypeLabels[event] || event}
                          </span>
                        ))}
                        {webhook.event_types.length > 2 && (
                          <span className="badge badge-secondary text-xs">
                            +{webhook.event_types.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {webhook.is_active ? (
                        <span className="badge badge-success flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="badge badge-danger flex items-center gap-1 w-fit">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900">{webhook.total_calls}</p>
                        {webhook.failed_calls > 0 && (
                          <p className="text-xs text-red-600">
                            {webhook.failed_calls} failed
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => testMutation.mutate(webhook.id)}
                          className="table-action-btn hover:text-blue-600 hover:bg-blue-50"
                          title="Test webhook"
                          disabled={testMutation.isPending}
                        >
                          <Activity className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingWebhook(webhook);
                            setShowForm(true);
                          }}
                          className="table-action-btn"
                          title="Edit webhook"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(webhook)}
                          className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                          title="Delete webhook"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!webhooks || webhooks.length === 0) && (
              <div className="empty-state py-16">
                <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                  <WebhookIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">No webhooks configured</h3>
                <p className="text-sm text-gray-500">
                  Add your first webhook to connect with external platforms
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Webhook Details Modal */}
      {selectedWebhook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{selectedWebhook.name}</h2>
                <button
                  onClick={() => setSelectedWebhook(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">URL</h3>
                <p className="font-mono text-sm bg-gray-50 p-3 rounded break-all">
                  {selectedWebhook.url}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Event Types</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedWebhook.event_types.map((event, index) => (
                    <span key={index} className="badge badge-secondary">
                      {eventTypeLabels[event] || event}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Status</h3>
                  {selectedWebhook.is_active ? (
                    <span className="badge badge-success">Active</span>
                  ) : (
                    <span className="badge badge-danger">Inactive</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Calls</h3>
                  <p className="text-lg font-semibold">{selectedWebhook.total_calls}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedWebhook(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    testMutation.mutate(selectedWebhook.id);
                    setSelectedWebhook(null);
                  }}
                  disabled={testMutation.isPending}
                >
                  Test Webhook
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Form Modal */}
      {showForm && (
        <WebhookForm
          webhook={editingWebhook}
          onClose={() => {
            setShowForm(false);
            setEditingWebhook(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingWebhook(null);
          }}
        />
      )}
    </div>
  );
};
