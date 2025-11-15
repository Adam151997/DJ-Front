import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dripCampaignsAPI, dripStepsAPI } from '../services/api';
import { DripCampaign, DripCampaignStep } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Mail,
  Calendar,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  draft: 'bg-gray-100 text-gray-700',
};

const TRIGGER_TYPES = [
  { value: 'on_signup', label: 'On Signup / Contact Created' },
  { value: 'on_lead_status_change', label: 'Lead Status Changed' },
  { value: 'on_deal_stage_change', label: 'Deal Stage Changed' },
  { value: 'on_tag_added', label: 'Tag Added' },
  { value: 'on_form_submission', label: 'Form Submission' },
  { value: 'on_date_based', label: 'Date-Based (Birthday, Anniversary)' },
  { value: 'manual_enrollment', label: 'Manual Enrollment' },
];

interface DripCampaignFormProps {
  dripCampaign?: DripCampaign | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DripCampaignForm: React.FC<DripCampaignFormProps> = ({ dripCampaign, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: dripCampaign?.name || '',
    description: dripCampaign?.description || '',
    trigger_type: dripCampaign?.trigger_type || 'on_signup',
    trigger_config: dripCampaign?.trigger_config || {},
    enrollment_rules: dripCampaign?.enrollment_rules || {},
    exit_conditions: dripCampaign?.exit_conditions || {},
    skip_weekends: dripCampaign?.skip_weekends ?? true,
    skip_holidays: dripCampaign?.skip_holidays ?? true,
    send_time_hour: dripCampaign?.send_time_hour || 9,
    time_zone: dripCampaign?.time_zone || 'America/New_York',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => dripCampaignsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drip-campaigns'] });
      onSuccess();
      alert('Drip campaign created successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to create drip campaign');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => dripCampaignsAPI.update(dripCampaign!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drip-campaigns'] });
      onSuccess();
      alert('Drip campaign updated successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to update drip campaign');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dripCampaign) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-theme-bg-primary rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-theme-border-primary sticky top-0 bg-theme-bg-primary">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {dripCampaign ? 'Edit Drip Campaign' : 'Create Drip Campaign'}
            </h2>
            <button onClick={onClose} className="text-theme-text-tertiary hover:text-theme-text-secondary">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="form-label">Campaign Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Welcome Series"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Automated welcome sequence for new contacts"
              rows={3}
            />
          </div>

          <div>
            <label className="form-label">Trigger Type</label>
            <select
              className="form-select"
              value={formData.trigger_type}
              onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
              required
            >
              {TRIGGER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Send Time (Hour)</label>
              <input
                type="number"
                className="form-input"
                value={formData.send_time_hour}
                onChange={(e) => setFormData({ ...formData, send_time_hour: parseInt(e.target.value) })}
                min="0"
                max="23"
              />
              <p className="text-xs text-theme-text-secondary mt-1">Hour of day to send emails (0-23)</p>
            </div>

            <div>
              <label className="form-label">Time Zone</label>
              <select
                className="form-select"
                value={formData.time_zone}
                onChange={(e) => setFormData({ ...formData, time_zone: e.target.value })}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.skip_weekends}
                onChange={(e) => setFormData({ ...formData, skip_weekends: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Skip weekends</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.skip_holidays}
                onChange={(e) => setFormData({ ...formData, skip_holidays: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Skip holidays</span>
            </label>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Next Steps:</p>
            <p className="text-sm text-blue-700">
              After creating the drip campaign, you'll be able to add email steps with specific delays and conditions.
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
              {dripCampaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const DripCampaigns: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<DripCampaign | null>(null);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['drip-campaigns'],
    queryFn: dripCampaignsAPI.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => dripCampaignsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drip-campaigns'] });
      alert('Drip campaign deleted successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to delete drip campaign');
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => dripCampaignsAPI.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drip-campaigns'] });
      alert('Drip campaign activated!');
    },
  });

  const pauseMutation = useMutation({
    mutationFn: (id: number) => dripCampaignsAPI.pause(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drip-campaigns'] });
      alert('Drip campaign paused!');
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this drip campaign?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (campaign: DripCampaign) => {
    setSelectedCampaign(campaign);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedCampaign(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-theme-text-secondary">Loading drip campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Drip Campaigns</h1>
          <p className="text-theme-text-secondary mt-1">
            Automated email sequences triggered by actions and events
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Drip Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Drip Campaigns Yet</h3>
            <p className="text-theme-text-secondary mb-4">
              Create automated email sequences to nurture leads and engage contacts
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Drip Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign: DripCampaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-4 bg-purple-100 text-purple-700 rounded-lg">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold">{campaign.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[campaign.status]}`}>
                          {campaign.status_display || campaign.status}
                        </span>
                      </div>
                      {campaign.description && (
                        <p className="text-theme-text-secondary text-sm mb-3">{campaign.description}</p>
                      )}

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-theme-text-secondary text-xs">Total Enrolled</p>
                            <p className="font-semibold">{campaign.total_enrollments}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-theme-text-secondary text-xs">Active</p>
                            <p className="font-semibold">{campaign.active_enrollments}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-theme-text-secondary text-xs">Completed</p>
                            <p className="font-semibold">{campaign.completed_enrollments}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-theme-text-secondary text-xs">Emails Sent</p>
                            <p className="font-semibold">{campaign.total_emails_sent}</p>
                          </div>
                        </div>
                      </div>

                      {campaign.avg_open_rate !== undefined && (
                        <div className="flex gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-theme-text-secondary">Avg Open Rate:</span>
                            <span className="font-semibold ml-2 text-green-600">
                              {(campaign.avg_open_rate * 100).toFixed(1)}%
                            </span>
                          </div>
                          {campaign.avg_click_rate !== undefined && (
                            <div>
                              <span className="text-theme-text-secondary">Avg Click Rate:</span>
                              <span className="font-semibold ml-2 text-blue-600">
                                {(campaign.avg_click_rate * 100).toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-2 text-xs text-theme-text-secondary">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Trigger: {campaign.trigger_type_display || campaign.trigger_type}
                        {campaign.skip_weekends && ' • Skips weekends'}
                        {campaign.skip_holidays && ' • Skips holidays'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {campaign.status === 'draft' || campaign.status === 'paused' ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => activateMutation.mutate(campaign.id)}
                        disabled={activateMutation.isPending}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => pauseMutation.mutate(campaign.id)}
                        disabled={pauseMutation.isPending}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(campaign)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(campaign.id)}
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
        <DripCampaignForm
          dripCampaign={selectedCampaign}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}
    </div>
  );
};
