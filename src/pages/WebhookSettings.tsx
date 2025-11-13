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

export const WebhookSettings: React.FC = () => {
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
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
          onClick={() => alert('Webhook builder coming soon!')}
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
                          onClick={() => setSelectedWebhook(webhook)}
                          className="table-action-btn"
                          title="View details"
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
    </div>
  );
};
