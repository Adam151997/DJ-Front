import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { emailAnalyticsAPI, emailCampaignsAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import {
  Mail,
  TrendingUp,
  MousePointer,
  Users,
  BarChart3,
  DollarSign,
  XCircle,
  RefreshCw,
  Calendar,
} from 'lucide-react';

export const EmailAnalytics: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState(30);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  const { data: globalStats, isLoading: loadingGlobal } = useQuery({
    queryKey: ['email-analytics-global', selectedDays],
    queryFn: () => emailAnalyticsAPI.globalStats({ days: selectedDays }),
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['email-campaigns'],
    queryFn: emailCampaignsAPI.getAll,
  });

  const { data: campaignAnalytics, isLoading: loadingCampaign } = useQuery({
    queryKey: ['campaign-analytics', selectedCampaignId],
    queryFn: () => selectedCampaignId ? emailAnalyticsAPI.campaignOverview(selectedCampaignId) : null,
    enabled: !!selectedCampaignId,
  });

  const { data: providerPerformance } = useQuery({
    queryKey: ['provider-performance', selectedDays],
    queryFn: () => emailAnalyticsAPI.providerPerformance({ days: selectedDays }),
  });

  if (loadingGlobal) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive performance metrics for your email campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <select
            className="form-select"
            value={selectedDays}
            onChange={(e) => setSelectedDays(parseInt(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Global Stats */}
      {globalStats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Sent"
              value={globalStats.total_sent?.toLocaleString() || '0'}
              icon={<Mail className="w-5 h-5" />}
              trend={globalStats.sent_vs_previous ? {
                value: globalStats.sent_vs_previous,
                label: 'vs previous period'
              } : undefined}
            />
            <StatCard
              title="Open Rate"
              value={`${(globalStats.avg_open_rate * 100).toFixed(1)}%`}
              icon={<TrendingUp className="w-5 h-5" />}
              trend={globalStats.open_rate_change ? {
                value: globalStats.open_rate_change,
                label: 'vs previous period'
              } : undefined}
            />
            <StatCard
              title="Click Rate"
              value={`${(globalStats.avg_click_rate * 100).toFixed(1)}%`}
              icon={<MousePointer className="w-5 h-5" />}
              trend={globalStats.click_rate_change ? {
                value: globalStats.click_rate_change,
                label: 'vs previous period'
              } : undefined}
            />
            <StatCard
              title="Total Revenue"
              value={`$${globalStats.total_revenue?.toLocaleString() || '0'}`}
              icon={<DollarSign className="w-5 h-5" />}
              trend={globalStats.revenue_change ? {
                value: globalStats.revenue_change,
                label: 'vs previous period'
              } : undefined}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Delivery Rate"
              value={`${(globalStats.delivery_rate * 100).toFixed(1)}%`}
              icon={<Mail className="w-5 h-5" />}
            />
            <StatCard
              title="Bounce Rate"
              value={`${(globalStats.bounce_rate * 100).toFixed(1)}%`}
              icon={<XCircle className="w-5 h-5" />}
            />
            <StatCard
              title="Unsubscribe Rate"
              value={`${(globalStats.unsubscribe_rate * 100).toFixed(1)}%`}
              icon={<Users className="w-5 h-5" />}
            />
          </div>
        </>
      )}

      {/* Campaign Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="form-label">Select Campaign</label>
            <select
              className="form-select"
              value={selectedCampaignId || ''}
              onChange={(e) => setSelectedCampaignId(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">-- Select a campaign --</option>
              {campaigns.map((campaign: any) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name} ({new Date(campaign.created_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {loadingCampaign && (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
              <p className="mt-2 text-gray-600">Loading campaign analytics...</p>
            </div>
          )}

          {campaignAnalytics && !loadingCampaign && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Sent</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {campaignAnalytics.total_sent.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Unique Opens</p>
                  <p className="text-2xl font-bold text-green-700">
                    {campaignAnalytics.unique_opens.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(campaignAnalytics.open_rate * 100).toFixed(1)}% rate
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Unique Clicks</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {campaignAnalytics.unique_clicks.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(campaignAnalytics.click_rate * 100).toFixed(1)}% rate
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Conversions</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {campaignAnalytics.conversions}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(campaignAnalytics.conversion_rate * 100).toFixed(1)}% rate
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Performance Metrics</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Delivery Rate:</span>
                      <span className="font-semibold">{(campaignAnalytics.delivery_rate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Click-to-Open Rate:</span>
                      <span className="font-semibold">{(campaignAnalytics.click_to_open_rate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bounce Rate:</span>
                      <span className="font-semibold text-red-600">{(campaignAnalytics.bounce_rate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unsubscribe Rate:</span>
                      <span className="font-semibold text-red-600">{(campaignAnalytics.unsubscribe_rate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {campaignAnalytics.device_breakdown && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Device Breakdown</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Desktop:</span>
                        <span className="font-semibold">{campaignAnalytics.device_breakdown.desktop}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobile:</span>
                        <span className="font-semibold">{campaignAnalytics.device_breakdown.mobile}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tablet:</span>
                        <span className="font-semibold">{campaignAnalytics.device_breakdown.tablet}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {campaignAnalytics.revenue > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Revenue Generated</p>
                      <p className="text-3xl font-bold text-green-700">
                        ${campaignAnalytics.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">ROI</p>
                      <p className="text-3xl font-bold text-green-700">
                        {(campaignAnalytics.roi * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!selectedCampaignId && !loadingCampaign && (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Select a campaign to view detailed analytics</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Provider Performance */}
      {providerPerformance && providerPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Email Provider Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Provider</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Sent</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Delivered</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Open Rate</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Click Rate</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Bounce Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {providerPerformance.map((provider: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{provider.provider_name}</td>
                      <td className="text-right py-3 px-4">{provider.total_sent.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{provider.total_delivered.toLocaleString()}</td>
                      <td className="text-right py-3 px-4 text-green-600">
                        {(provider.open_rate * 100).toFixed(1)}%
                      </td>
                      <td className="text-right py-3 px-4 text-blue-600">
                        {(provider.click_rate * 100).toFixed(1)}%
                      </td>
                      <td className="text-right py-3 px-4 text-red-600">
                        {(provider.bounce_rate * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
