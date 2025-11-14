import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { emailProvidersAPI } from '../services/api';
import { EmailProvider, EmailProviderStats } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import {
  Plus,
  Mail,
  CheckCircle,
  XCircle,
  Send,
  Edit,
  Trash2,
  BarChart3,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  Server,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';

const PROVIDER_LABELS: Record<string, string> = {
  sendgrid: 'SendGrid',
  mailgun: 'Mailgun',
  mailchimp: 'Mailchimp (Mandrill)',
  brevo: 'Brevo (Sendinblue)',
  klaviyo: 'Klaviyo',
};

const PROVIDER_COLORS: Record<string, string> = {
  sendgrid: 'bg-blue-100 text-blue-700',
  mailgun: 'bg-red-100 text-red-700',
  mailchimp: 'bg-yellow-100 text-yellow-700',
  brevo: 'bg-green-100 text-green-700',
  klaviyo: 'bg-purple-100 text-purple-700',
};

interface EmailProviderFormProps {
  provider?: EmailProvider | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EmailProviderForm: React.FC<EmailProviderFormProps> = ({ provider, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    provider_type: provider?.provider_type || 'sendgrid',
    name: provider?.name || '',
    api_key: '',
    api_secret: '',
    sender_email: provider?.sender_email || '',
    sender_name: provider?.sender_name || '',
    daily_limit: provider?.daily_limit || null,
    monthly_limit: provider?.monthly_limit || null,
    priority: provider?.priority || 0,
    config: provider?.config || {},
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: any) => emailProvidersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-providers'] });
      onSuccess();
      alert('Email provider created successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to create provider');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => emailProvidersAPI.update(provider!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-providers'] });
      onSuccess();
      alert('Email provider updated successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to update provider');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };

    // Remove empty API key/secret if editing
    if (provider && !submitData.api_key) delete submitData.api_key;
    if (provider && !submitData.api_secret) delete submitData.api_secret;

    if (provider) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  // Provider-specific config fields
  const renderConfigFields = () => {
    switch (formData.provider_type) {
      case 'mailgun':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Mailgun Domain</label>
              <input
                type="text"
                className="form-input"
                value={formData.config.domain || ''}
                onChange={(e) =>
                  setFormData({ ...formData, config: { ...formData.config, domain: e.target.value } })
                }
                placeholder="mg.yourdomain.com"
                required
              />
            </div>
            <div>
              <label className="form-label">Region</label>
              <select
                className="form-select"
                value={formData.config.region || 'us'}
                onChange={(e) =>
                  setFormData({ ...formData, config: { ...formData.config, region: e.target.value } })
                }
              >
                <option value="us">US</option>
                <option value="eu">EU</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {provider ? 'Edit' : 'Add'} Email Provider
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Provider Type */}
          <div>
            <label className="form-label">Provider Type</label>
            <select
              className="form-select"
              value={formData.provider_type}
              onChange={(e) => setFormData({ ...formData, provider_type: e.target.value as any })}
              disabled={!!provider}
              required
            >
              <option value="sendgrid">SendGrid (Twilio)</option>
              <option value="mailgun">Mailgun</option>
              <option value="mailchimp">Mailchimp (Mandrill)</option>
              <option value="brevo">Brevo (Sendinblue)</option>
              <option value="klaviyo">Klaviyo</option>
            </select>
            {provider && (
              <p className="text-xs text-gray-500 mt-1">Provider type cannot be changed</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="form-label">Provider Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My SendGrid Account"
              required
            />
          </div>

          {/* API Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                API Key {provider && <span className="text-xs text-gray-500">(leave blank to keep current)</span>}
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  className="form-input pr-10"
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  placeholder={provider ? '••••••••••••••••' : 'Your API key'}
                  required={!provider}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {formData.provider_type === 'mailgun' && (
              <div>
                <label className="form-label">
                  API Secret {provider && <span className="text-xs text-gray-500">(optional)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showApiSecret ? 'text' : 'password'}
                    className="form-input pr-10"
                    value={formData.api_secret}
                    onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                    placeholder={provider ? '••••••••••••••••' : 'Optional'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sender Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Sender Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.sender_email}
                onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                placeholder="noreply@yourdomain.com"
                required
              />
            </div>
            <div>
              <label className="form-label">Sender Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.sender_name}
                onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                placeholder="Your Company"
                required
              />
            </div>
          </div>

          {/* Provider-specific config */}
          {renderConfigFields()}

          {/* Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Daily Limit (optional)</label>
              <input
                type="number"
                className="form-input"
                value={formData.daily_limit || ''}
                onChange={(e) =>
                  setFormData({ ...formData, daily_limit: e.target.value ? parseInt(e.target.value) : null })
                }
                placeholder="10000"
              />
            </div>
            <div>
              <label className="form-label">Monthly Limit (optional)</label>
              <input
                type="number"
                className="form-input"
                value={formData.monthly_limit || ''}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_limit: e.target.value ? parseInt(e.target.value) : null })
                }
                placeholder="300000"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="form-label">Priority (0 = highest)</label>
            <input
              type="number"
              className="form-input"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
              min="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers = higher priority when using priority strategy
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : provider
                ? 'Update Provider'
                : 'Add Provider'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface StatsModalProps {
  provider: EmailProvider;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ provider, onClose }) => {
  const { data: stats, isLoading } = useQuery<EmailProviderStats>({
    queryKey: ['email-provider-stats', provider.id],
    queryFn: () => emailProvidersAPI.getStats(provider.id),
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{provider.name} - Statistics</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading statistics...</p>
            </div>
          ) : stats ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Total Sent</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total_sent}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Delivered</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{stats.delivered}</p>
                  <p className="text-xs text-green-600 mt-1">{stats.delivery_rate.toFixed(1)}%</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Opened</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{stats.opened}</p>
                  <p className="text-xs text-purple-600 mt-1">{stats.open_rate.toFixed(1)}%</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-600 font-medium">Clicked</p>
                  <p className="text-2xl font-bold text-orange-900 mt-1">{stats.clicked}</p>
                  <p className="text-xs text-orange-600 mt-1">{stats.click_rate.toFixed(1)}%</p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-red-600 font-medium">Bounced</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">{stats.bounced}</p>
                  <p className="text-xs text-red-600 mt-1">{stats.bounce_rate.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Failed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.failed}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-600 font-medium">Sent Today</p>
                  <p className="text-2xl font-bold text-indigo-900 mt-1">{stats.sent_today}</p>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <p className="text-sm text-pink-600 font-medium">This Month</p>
                  <p className="text-2xl font-bold text-pink-900 mt-1">{stats.sent_this_month}</p>
                </div>
              </div>

              {/* Usage vs Limits */}
              {(provider.daily_limit || provider.monthly_limit) && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Usage Limits</h3>
                  {provider.daily_limit && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Daily Usage</span>
                        <span className="font-medium">
                          {stats.sent_today} / {provider.daily_limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((stats.sent_today / provider.daily_limit) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {provider.monthly_limit && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Monthly Usage</span>
                        <span className="font-medium">
                          {stats.sent_this_month} / {provider.monthly_limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((stats.sent_this_month / provider.monthly_limit) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No statistics available</p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EmailProviders: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<EmailProvider | null>(null);
  const [statsProvider, setStatsProvider] = useState<EmailProvider | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testingProviderId, setTestingProviderId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: providers, isLoading } = useQuery<EmailProvider[]>({
    queryKey: ['email-providers'],
    queryFn: () => emailProvidersAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => emailProvidersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-providers'] });
      alert('Provider deleted successfully!');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (id: number) => emailProvidersAPI.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-providers'] });
      alert('Provider verified successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Verification failed');
    },
  });

  const testSendMutation = useMutation({
    mutationFn: ({ id, email }: { id: number; email: string }) =>
      emailProvidersAPI.testSend(id, { test_email: email }),
    onSuccess: () => {
      alert('Test email sent successfully!');
      setTestEmail('');
      setTestingProviderId(null);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Test email failed');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id: number) => emailProvidersAPI.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-providers'] });
    },
  });

  const handleDelete = (provider: EmailProvider) => {
    if (window.confirm(`Delete provider "${provider.name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(provider.id);
    }
  };

  const handleEdit = (provider: EmailProvider) => {
    setEditingProvider(provider);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProvider(null);
  };

  const handleCopyKey = (provider: EmailProvider) => {
    // Simulating copy (we don't actually have the full key)
    navigator.clipboard.writeText(`Provider ID: ${provider.id}`);
    setCopiedId(provider.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate aggregate stats
  const totalSent =
    providers?.reduce((sum, p) => sum + p.sent_today + p.sent_this_month, 0) || 0;
  const activeCount = providers?.filter((p) => p.is_active).length || 0;
  const verifiedCount = providers?.filter((p) => p.is_verified).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-16 w-full bg-gray-200 rounded"></div>
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
            <Server className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-semibold text-gray-900">Email Providers</h1>
          </div>
          <p className="text-gray-600">
            Manage your email service providers and monitor performance
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} icon={Plus} size="lg">
          Add Provider
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          title="Total Providers"
          value={providers?.length || 0}
          icon={Server}
          description="Configured providers"
        />
        <StatCard
          title="Active"
          value={activeCount}
          icon={PlayCircle}
          description="Currently active"
        />
        <StatCard
          title="Verified"
          value={verifiedCount}
          icon={CheckCircle}
          description="API keys verified"
        />
        <StatCard
          title="Total Sent"
          value={totalSent}
          icon={Send}
          description="All time"
        />
      </div>

      {/* Providers List */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Providers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="text-left py-3 px-6">Provider</th>
                  <th className="text-left py-3 px-6">Status</th>
                  <th className="text-left py-3 px-6">Sender</th>
                  <th className="text-left py-3 px-6">Usage</th>
                  <th className="text-left py-3 px-6">Priority</th>
                  <th className="text-right py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers?.map((provider) => (
                  <tr key={provider.id}>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{provider.name}</p>
                        <span className={`badge ${PROVIDER_COLORS[provider.provider_type]} text-xs mt-1`}>
                          {PROVIDER_LABELS[provider.provider_type]}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {provider.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <PauseCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">
                            {provider.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {provider.is_verified ? (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">
                            {provider.is_verified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{provider.sender_name}</p>
                        <p className="text-xs text-gray-500">{provider.sender_email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="text-gray-900">
                          Today: <span className="font-medium">{provider.sent_today}</span>
                          {provider.daily_limit && (
                            <span className="text-gray-500"> / {provider.daily_limit}</span>
                          )}
                        </p>
                        <p className="text-gray-900">
                          Month: <span className="font-medium">{provider.sent_this_month}</span>
                          {provider.monthly_limit && (
                            <span className="text-gray-500"> / {provider.monthly_limit}</span>
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="badge bg-gray-100 text-gray-700">{provider.priority}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {!provider.is_verified && (
                          <button
                            onClick={() => verifyMutation.mutate(provider.id)}
                            className="table-action-btn hover:text-blue-600 hover:bg-blue-50"
                            title="Verify API key"
                            disabled={verifyMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setStatsProvider(provider)}
                          className="table-action-btn hover:text-purple-600 hover:bg-purple-50"
                          title="View statistics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setTestingProviderId(provider.id)}
                          className="table-action-btn hover:text-green-600 hover:bg-green-50"
                          title="Send test email"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleActiveMutation.mutate(provider.id)}
                          className="table-action-btn hover:text-orange-600 hover:bg-orange-50"
                          title={provider.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {provider.is_active ? (
                            <PauseCircle className="h-4 w-4" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(provider)}
                          className="table-action-btn"
                          title="Edit provider"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(provider)}
                          className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                          title="Delete provider"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!providers || providers.length === 0) && (
              <div className="empty-state py-16">
                <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                  <Server className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">No providers configured</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add your first email provider to start sending campaigns
                </p>
                <Button onClick={() => setShowForm(true)} icon={Plus}>
                  Add Provider
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Forms and Modals */}
      {showForm && (
        <EmailProviderForm
          provider={editingProvider}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}

      {statsProvider && (
        <StatsModal provider={statsProvider} onClose={() => setStatsProvider(null)} />
      )}

      {/* Test Email Modal */}
      {testingProviderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Send Test Email</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Test Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTestingProviderId(null);
                    setTestEmail('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => testSendMutation.mutate({ id: testingProviderId, email: testEmail })}
                  disabled={!testEmail || testSendMutation.isPending}
                  icon={Send}
                >
                  {testSendMutation.isPending ? 'Sending...' : 'Send Test'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
