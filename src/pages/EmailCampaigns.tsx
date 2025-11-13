import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailCampaignsAPI, emailTemplatesAPI } from '../services/api';
import { EmailCampaign } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import {
  Plus,
  Send,
  Pause,
  Edit,
  Trash2,
  Mail,
  Eye,
  MousePointer,
  AlertCircle,
} from 'lucide-react';

export const EmailCampaigns: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['email-campaigns'],
    queryFn: () => emailCampaignsAPI.getAll(),
  });

  const { data: templates } = useQuery({
    queryKey: ['email-templates'],
    queryFn: () => emailTemplatesAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => emailCampaignsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (id: number) => emailCampaignsAPI.send(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
      alert('Campaign sent successfully!');
    },
  });

  const pauseMutation = useMutation({
    mutationFn: (id: number) => emailCampaignsAPI.pause(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
    },
  });

  const handleDelete = (campaign: EmailCampaign) => {
    if (window.confirm(`Delete campaign "${campaign.name}"?`)) {
      deleteMutation.mutate(campaign.id);
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    scheduled: 'bg-blue-100 text-blue-700',
    sending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    paused: 'bg-red-100 text-red-700',
  };

  const totalSent = campaigns?.reduce((sum: number, c: EmailCampaign) => sum + c.sent_count, 0) || 0;
  const totalOpened = campaigns?.reduce((sum: number, c: EmailCampaign) => sum + c.opened_count, 0) || 0;
  const totalClicked = campaigns?.reduce((sum: number, c: EmailCampaign) => sum + c.clicked_count, 0) || 0;
  const totalBounced = campaigns?.reduce((sum: number, c: EmailCampaign) => sum + c.bounced_count, 0) || 0;

  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0';
  const clickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : '0';
  const bounceRate = totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(1) : '0';

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
            <Mail className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-semibold text-gray-900">Email Campaigns</h1>
          </div>
          <p className="text-gray-600">
            Create and manage email campaigns with advanced tracking
          </p>
        </div>
        <Button
          onClick={() => alert('Campaign builder coming soon!')}
          icon={Plus}
          size="lg"
        >
          Create Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          title="Total Sent"
          value={totalSent}
          icon={Send}
          description="All campaigns"
        />
        <StatCard
          title="Open Rate"
          value={`${openRate}%`}
          icon={Eye}
          description={`${totalOpened} opened`}
        />
        <StatCard
          title="Click Rate"
          value={`${clickRate}%`}
          icon={MousePointer}
          description={`${totalClicked} clicked`}
        />
        <StatCard
          title="Bounce Rate"
          value={`${bounceRate}%`}
          icon={AlertCircle}
          description={`${totalBounced} bounced`}
        />
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="text-left py-3 px-6">Campaign</th>
                  <th className="text-left py-3 px-6">Status</th>
                  <th className="text-left py-3 px-6">Recipients</th>
                  <th className="text-left py-3 px-6">Sent</th>
                  <th className="text-left py-3 px-6">Opened</th>
                  <th className="text-left py-3 px-6">Clicked</th>
                  <th className="text-right py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns?.map((campaign: EmailCampaign) => (
                  <tr key={campaign.id}>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${statusColors[campaign.status]} text-xs`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900">{campaign.total_recipients}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900">{campaign.sent_count}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900">{campaign.opened_count}</p>
                        <p className="text-xs text-gray-500">
                          {campaign.sent_count > 0
                            ? `${((campaign.opened_count / campaign.sent_count) * 100).toFixed(1)}%`
                            : '0%'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900">{campaign.clicked_count}</p>
                        <p className="text-xs text-gray-500">
                          {campaign.sent_count > 0
                            ? `${((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1)}%`
                            : '0%'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {campaign.status === 'draft' && (
                          <button
                            onClick={() => sendMutation.mutate(campaign.id)}
                            className="table-action-btn hover:text-green-600 hover:bg-green-50"
                            title="Send campaign"
                            disabled={sendMutation.isPending}
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        {campaign.status === 'sending' && (
                          <button
                            onClick={() => pauseMutation.mutate(campaign.id)}
                            className="table-action-btn hover:text-yellow-600 hover:bg-yellow-50"
                            title="Pause campaign"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedCampaign(campaign)}
                          className="table-action-btn"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(campaign)}
                          className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                          title="Delete campaign"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!campaigns || campaigns.length === 0) && (
              <div className="empty-state py-16">
                <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                  <Mail className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">No campaigns yet</h3>
                <p className="text-sm text-gray-500">
                  Create your first email campaign to engage with your contacts
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{selectedCampaign.name}</h2>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`badge ${statusColors[selectedCampaign.status]}`}>
                    {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Recipients</p>
                  <p className="text-lg font-semibold">{selectedCampaign.total_recipients}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sent</p>
                  <p className="text-lg font-semibold">{selectedCampaign.sent_count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Opened</p>
                  <p className="text-lg font-semibold">
                    {selectedCampaign.opened_count}{' '}
                    <span className="text-sm text-gray-500">
                      ({selectedCampaign.sent_count > 0
                        ? ((selectedCampaign.opened_count / selectedCampaign.sent_count) * 100).toFixed(1)
                        : 0}%)
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Clicked</p>
                  <p className="text-lg font-semibold">
                    {selectedCampaign.clicked_count}{' '}
                    <span className="text-sm text-gray-500">
                      ({selectedCampaign.sent_count > 0
                        ? ((selectedCampaign.clicked_count / selectedCampaign.sent_count) * 100).toFixed(1)
                        : 0}%)
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bounced</p>
                  <p className="text-lg font-semibold">
                    {selectedCampaign.bounced_count}{' '}
                    <span className="text-sm text-gray-500">
                      ({selectedCampaign.sent_count > 0
                        ? ((selectedCampaign.bounced_count / selectedCampaign.sent_count) * 100).toFixed(1)
                        : 0}%)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCampaign(null)}
                >
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
