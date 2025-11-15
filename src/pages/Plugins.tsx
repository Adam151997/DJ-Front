import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pluginsAPI, pluginEventsAPI, pluginSyncLogsAPI } from '../services/api';
import { Plugin, PluginEvent, PluginSyncLog, PluginAccountInfo } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Plus,
  ExternalLink,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  BarChart3,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
  ShoppingCart,
  Globe,
  TrendingUp,
  Calendar,
  CheckCheck,
} from 'lucide-react';

const PLUGIN_LABELS: Record<string, string> = {
  google_ads: 'Google Ads',
  meta_ads: 'Meta Ads (Facebook & Instagram)',
  tiktok_ads: 'TikTok Ads',
  shopify: 'Shopify',
};

const PLUGIN_COLORS: Record<string, string> = {
  google_ads: 'bg-blue-100 text-blue-700',
  meta_ads: 'bg-indigo-100 text-indigo-700',
  tiktok_ads: 'bg-pink-100 text-pink-700',
  shopify: 'bg-green-100 text-green-700',
};

const PLUGIN_ICONS: Record<string, React.ReactNode> = {
  google_ads: <Globe className="w-5 h-5" />,
  meta_ads: <TrendingUp className="w-5 h-5" />,
  tiktok_ads: <Zap className="w-5 h-5" />,
  shopify: <ShoppingCart className="w-5 h-5" />,
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  error: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

interface PluginFormProps {
  plugin?: Plugin | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PluginForm: React.FC<PluginFormProps> = ({ plugin, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    plugin_type: plugin?.plugin_type || 'google_ads',
    name: plugin?.name || '',
    client_id: plugin?.client_id || '',
    client_secret: '',
    config: plugin?.config || {},
  });

  const [showClientSecret, setShowClientSecret] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: any) => pluginsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      onSuccess();
      alert('Plugin created successfully! You can now connect it via OAuth.');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to create plugin');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => pluginsAPI.update(plugin!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      onSuccess();
      alert('Plugin updated successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to update plugin');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };

    // Remove empty client_secret if editing
    if (plugin && !submitData.client_secret) delete submitData.client_secret;

    if (plugin) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  // Plugin-specific config fields
  const renderConfigFields = () => {
    switch (formData.plugin_type) {
      case 'google_ads':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Customer ID (CID)</label>
              <input
                type="text"
                className="form-input"
                value={formData.config.customer_id || ''}
                onChange={(e) =>
                  setFormData({ ...formData, config: { ...formData.config, customer_id: e.target.value } })
                }
                placeholder="1234567890"
              />
              <p className="text-xs text-theme-text-tertiary mt-1">Your Google Ads Customer ID (without hyphens)</p>
            </div>
            <div>
              <label className="form-label">Developer Token</label>
              <input
                type="text"
                className="form-input"
                value={formData.config.developer_token || ''}
                onChange={(e) =>
                  setFormData({ ...formData, config: { ...formData.config, developer_token: e.target.value } })
                }
                placeholder="Your developer token"
              />
            </div>
          </div>
        );
      case 'meta_ads':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Ad Account ID</label>
              <input
                type="text"
                className="form-input"
                value={formData.config.ad_account_id || ''}
                onChange={(e) =>
                  setFormData({ ...formData, config: { ...formData.config, ad_account_id: e.target.value } })
                }
                placeholder="act_123456789"
              />
              <p className="text-xs text-theme-text-tertiary mt-1">Your Meta Ad Account ID</p>
            </div>
          </div>
        );
      case 'tiktok_ads':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Advertiser ID</label>
              <input
                type="text"
                className="form-input"
                value={formData.config.advertiser_id || ''}
                onChange={(e) =>
                  setFormData({ ...formData, config: { ...formData.config, advertiser_id: e.target.value } })
                }
                placeholder="1234567890123456"
              />
            </div>
          </div>
        );
      case 'shopify':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Shop Domain</label>
              <input
                type="text"
                className="form-input"
                value={formData.config.shop_domain || ''}
                onChange={(e) =>
                  setFormData({ ...formData, config: { ...formData.config, shop_domain: e.target.value } })
                }
                placeholder="your-store.myshopify.com"
                required
              />
              <p className="text-xs text-theme-text-tertiary mt-1">Your Shopify store domain</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-theme-bg-primary rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-theme-border-primary sticky top-0 bg-theme-bg-primary">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {plugin ? 'Edit Plugin' : 'Add New Plugin'}
            </h2>
            <button onClick={onClose} className="text-theme-text-tertiary hover:text-theme-text-secondary">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="form-label">Plugin Type</label>
            <select
              className="form-select"
              value={formData.plugin_type}
              onChange={(e) => setFormData({ ...formData, plugin_type: e.target.value as any })}
              disabled={!!plugin}
              required
            >
              <option value="google_ads">Google Ads</option>
              <option value="meta_ads">Meta Ads (Facebook & Instagram)</option>
              <option value="tiktok_ads">TikTok Ads</option>
              <option value="shopify">Shopify</option>
            </select>
          </div>

          <div>
            <label className="form-label">Plugin Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Google Ads Account"
              required
            />
          </div>

          <div>
            <label className="form-label">Client ID / App ID</label>
            <input
              type="text"
              className="form-input"
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              placeholder="Your client/app ID"
              required
            />
          </div>

          <div>
            <label className="form-label">Client Secret / App Secret</label>
            <div className="relative">
              <input
                type={showClientSecret ? 'text' : 'password'}
                className="form-input pr-10"
                value={formData.client_secret}
                onChange={(e) => setFormData({ ...formData, client_secret: e.target.value })}
                placeholder={plugin ? 'Leave blank to keep unchanged' : 'Your client/app secret'}
                required={!plugin}
              />
              <button
                type="button"
                onClick={() => setShowClientSecret(!showClientSecret)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-theme-text-tertiary hover:text-theme-text-secondary"
              >
                {showClientSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {plugin && (
              <p className="text-xs text-theme-text-tertiary mt-1">Current: {plugin.masked_client_secret}</p>
            )}
          </div>

          {renderConfigFields()}

          <div className="flex justify-end gap-3 pt-4 border-t border-theme-border-primary">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {plugin ? 'Update Plugin' : 'Create Plugin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PluginDetailsModalProps {
  plugin: Plugin;
  onClose: () => void;
}

const PluginDetailsModal: React.FC<PluginDetailsModalProps> = ({ plugin, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'sync-logs'>('overview');
  const [accountInfo, setAccountInfo] = useState<PluginAccountInfo | null>(null);
  const [loadingAccountInfo, setLoadingAccountInfo] = useState(false);

  const { data: events = [] } = useQuery({
    queryKey: ['plugin-events', plugin.id],
    queryFn: () => pluginEventsAPI.getAll(plugin.id),
    enabled: activeTab === 'events',
  });

  const { data: syncLogs = [] } = useQuery({
    queryKey: ['plugin-sync-logs', plugin.id],
    queryFn: () => pluginSyncLogsAPI.getAll(plugin.id),
    enabled: activeTab === 'sync-logs',
  });

  const loadAccountInfo = async () => {
    if (!plugin.is_verified) {
      alert('Please verify the plugin first');
      return;
    }

    setLoadingAccountInfo(true);
    try {
      const info = await pluginsAPI.getAccountInfo(plugin.id);
      setAccountInfo(info);
    } catch (error: any) {
      alert(error?.response?.data?.detail || 'Failed to load account info');
    } finally {
      setLoadingAccountInfo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-theme-bg-primary rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-theme-border-primary sticky top-0 bg-theme-bg-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${PLUGIN_COLORS[plugin.plugin_type]}`}>
                {PLUGIN_ICONS[plugin.plugin_type]}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{plugin.name}</h2>
                <p className="text-sm text-theme-text-tertiary">{PLUGIN_LABELS[plugin.plugin_type]}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-theme-text-tertiary hover:text-theme-text-secondary">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'overview'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-theme-text-secondary hover:bg-theme-bg-tertiary'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'events'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-theme-text-secondary hover:bg-theme-bg-tertiary'
              }`}
            >
              Webhook Events
            </button>
            <button
              onClick={() => setActiveTab('sync-logs')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'sync-logs'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-theme-text-secondary hover:bg-theme-bg-tertiary'
              }`}
            >
              Sync Logs
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-theme-text-tertiary">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[plugin.status]}`}>
                    {plugin.status_display || plugin.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-theme-text-tertiary">Category</p>
                  <p className="font-medium">{plugin.category_display || plugin.category}</p>
                </div>
                <div>
                  <p className="text-sm text-theme-text-tertiary">Client ID</p>
                  <p className="font-mono text-sm">{plugin.client_id}</p>
                </div>
                <div>
                  <p className="text-sm text-theme-text-tertiary">Last Sync</p>
                  <p className="font-medium">
                    {plugin.last_sync_at
                      ? new Date(plugin.last_sync_at).toLocaleString()
                      : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-theme-text-tertiary">Verified</p>
                  <p className="flex items-center gap-1">
                    {plugin.is_verified ? (
                      <><CheckCircle className="w-4 h-4 text-green-600" /> Yes</>
                    ) : (
                      <><XCircle className="w-4 h-4 text-red-600" /> No</>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-theme-text-tertiary">Active</p>
                  <p className="flex items-center gap-1">
                    {plugin.is_active ? (
                      <><CheckCircle className="w-4 h-4 text-green-600" /> Yes</>
                    ) : (
                      <><XCircle className="w-4 h-4 text-gray-400" /> No</>
                    )}
                  </p>
                </div>
              </div>

              {plugin.last_error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800">Last Error:</p>
                  <p className="text-sm text-red-700 mt-1">{plugin.last_error}</p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Account Information</h3>
                  <Button
                    size="sm"
                    onClick={loadAccountInfo}
                    disabled={loadingAccountInfo || !plugin.is_verified}
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${loadingAccountInfo ? 'animate-spin' : ''}`} />
                    Load
                  </Button>
                </div>
                {accountInfo && (
                  <div className="p-4 bg-theme-bg-tertiary rounded-lg space-y-2">
                    {accountInfo.account_id && (
                      <div>
                        <p className="text-sm text-theme-text-tertiary">Account ID</p>
                        <p className="font-medium">{accountInfo.account_id}</p>
                      </div>
                    )}
                    {accountInfo.account_name && (
                      <div>
                        <p className="text-sm text-theme-text-tertiary">Account Name</p>
                        <p className="font-medium">{accountInfo.account_name}</p>
                      </div>
                    )}
                    {accountInfo.account_email && (
                      <div>
                        <p className="text-sm text-theme-text-tertiary">Account Email</p>
                        <p className="font-medium">{accountInfo.account_email}</p>
                      </div>
                    )}
                    {accountInfo.account_status && (
                      <div>
                        <p className="text-sm text-theme-text-tertiary">Account Status</p>
                        <p className="font-medium">{accountInfo.account_status}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Configuration</h3>
                <pre className="p-4 bg-theme-bg-tertiary rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(plugin.config, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-center text-theme-text-tertiary py-8">No webhook events yet</p>
              ) : (
                events.map((event: PluginEvent) => (
                  <div key={event.id} className="p-4 bg-theme-bg-tertiary rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{event.event_type}</p>
                        <p className="text-xs text-gray-500">Event ID: {event.event_id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${event.processed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {event.processed ? 'Processed' : 'Pending'}
                      </span>
                    </div>
                    {event.processed_at && (
                      <p className="text-xs text-gray-500 mb-2">
                        Processed: {new Date(event.processed_at).toLocaleString()}
                      </p>
                    )}
                    {(event.lead_created || event.contact_created || event.deal_created) && (
                      <div className="text-xs text-green-600 mb-2">
                        Created: {event.lead_created && 'Lead '}
                        {event.contact_created && 'Contact '}
                        {event.deal_created && 'Deal'}
                      </div>
                    )}
                    {event.error_message && (
                      <p className="text-xs text-red-600 mb-2">{event.error_message}</p>
                    )}
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-600">View Payload</summary>
                      <pre className="mt-2 p-2 bg-theme-bg-primary rounded overflow-x-auto">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'sync-logs' && (
            <div className="space-y-4">
              {syncLogs.length === 0 ? (
                <p className="text-center text-theme-text-tertiary py-8">No sync logs yet</p>
              ) : (
                syncLogs.map((log: PluginSyncLog) => (
                  <div key={log.id} className="p-4 bg-theme-bg-tertiary rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{log.sync_type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.started_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : log.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <p className="text-theme-text-tertiary">Synced</p>
                        <p className="font-medium">{log.records_synced}</p>
                      </div>
                      <div>
                        <p className="text-theme-text-tertiary">Created</p>
                        <p className="font-medium text-green-600">{log.records_created}</p>
                      </div>
                      <div>
                        <p className="text-theme-text-tertiary">Updated</p>
                        <p className="font-medium text-blue-600">{log.records_updated}</p>
                      </div>
                      <div>
                        <p className="text-theme-text-tertiary">Failed</p>
                        <p className="font-medium text-red-600">{log.records_failed}</p>
                      </div>
                    </div>
                    {log.error_message && (
                      <p className="text-xs text-red-600 mt-2">{log.error_message}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Plugins: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [viewPlugin, setViewPlugin] = useState<Plugin | null>(null);

  const { data: plugins = [], isLoading } = useQuery({
    queryKey: ['plugins'],
    queryFn: pluginsAPI.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pluginsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      alert('Plugin deleted successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to delete plugin');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (id: number) => pluginsAPI.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      alert('Plugin verified successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to verify plugin');
    },
  });

  const syncMutation = useMutation({
    mutationFn: (id: number) => pluginsAPI.sync(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      alert('Sync started! Check sync logs for details.');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to start sync');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id: number) => pluginsAPI.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to toggle plugin status');
    },
  });

  const handleConnectOAuth = async (plugin: Plugin) => {
    try {
      const redirectUri = `${window.location.origin}/plugins/oauth-callback`;
      const response = await pluginsAPI.getOAuthUrl(plugin.id, redirectUri);

      // Store plugin ID in sessionStorage to use in callback
      sessionStorage.setItem('oauth_plugin_id', plugin.id.toString());
      sessionStorage.setItem('oauth_state', response.state);

      // Redirect to OAuth URL
      window.location.href = response.oauth_url;
    } catch (error: any) {
      alert(error?.response?.data?.detail || 'Failed to get OAuth URL');
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this plugin? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setShowForm(true);
  };

  const handleView = (plugin: Plugin) => {
    setViewPlugin(plugin);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedPlugin(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-theme-text-secondary">Loading plugins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Plugins</h1>
          <p className="text-theme-text-secondary mt-1">
            Connect external platforms like Google Ads, Meta Ads, TikTok Ads, and Shopify
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Plugin
        </Button>
      </div>

      {plugins.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Globe className="w-12 h-12 mx-auto text-theme-text-tertiary mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Plugins Connected</h3>
            <p className="text-theme-text-secondary mb-4">
              Connect your first external platform to start syncing data
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Plugin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {plugins.map((plugin: Plugin) => (
            <Card key={plugin.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-4 rounded-lg ${PLUGIN_COLORS[plugin.plugin_type]}`}>
                      {PLUGIN_ICONS[plugin.plugin_type]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold">{plugin.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[plugin.status]}`}>
                          {plugin.status_display || plugin.status}
                        </span>
                        {plugin.is_verified && (
                          <CheckCheck className="w-4 h-4 text-green-600" title="Verified" />
                        )}
                        {!plugin.is_active && (
                          <PauseCircle className="w-4 h-4 text-gray-400" title="Inactive" />
                        )}
                      </div>
                      <p className="text-theme-text-secondary text-sm mb-2">{PLUGIN_LABELS[plugin.plugin_type]}</p>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-theme-text-secondary">Category:</span>
                          <span className="font-medium">{plugin.category_display || plugin.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-theme-text-secondary">Last Sync:</span>
                          <span className="font-medium">
                            {plugin.last_sync_at
                              ? new Date(plugin.last_sync_at).toLocaleDateString()
                              : 'Never'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-theme-text-secondary">Created:</span>
                          <span className="font-medium">
                            {new Date(plugin.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {plugin.last_error && (
                          <div className="flex items-center gap-2 col-span-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-red-600 text-xs">{plugin.last_error}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!plugin.is_verified && (
                      <Button
                        size="sm"
                        onClick={() => handleConnectOAuth(plugin)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                    )}
                    {plugin.is_verified && plugin.is_active && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => syncMutation.mutate(plugin.id)}
                        disabled={syncMutation.isPending}
                      >
                        <RefreshCw className={`w-4 h-4 mr-1 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                        Sync
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleActiveMutation.mutate(plugin.id)}
                    >
                      {plugin.is_active ? (
                        <><PauseCircle className="w-4 h-4" /></>
                      ) : (
                        <><PlayCircle className="w-4 h-4" /></>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleView(plugin)}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(plugin)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(plugin.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <PluginForm
          plugin={selectedPlugin}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      {viewPlugin && (
        <PluginDetailsModal
          plugin={viewPlugin}
          onClose={() => setViewPlugin(null)}
        />
      )}
    </div>
  );
};
