import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI, pipelineStagesAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import {
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getData(),
    retry: 1,
  });

  const { data: pipelineStages } = useQuery({
    queryKey: ['pipeline-stages'],
    queryFn: () => pipelineStagesAPI.getAll(),
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-9 w-48 bg-theme-bg-secondary rounded-lg animate-pulse"></div>
            <div className="h-5 w-80 bg-theme-bg-secondary rounded-lg animate-pulse mt-3"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-theme-bg-primary rounded-xl border border-theme-border-primary p-6 shadow-sm animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="h-4 w-24 bg-theme-bg-secondary rounded"></div>
                  <div className="h-8 w-20 bg-theme-bg-secondary rounded"></div>
                  <div className="h-3 w-32 bg-theme-bg-secondary rounded"></div>
                </div>
                <div className="h-12 w-12 bg-theme-bg-secondary rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="p-4 bg-danger-50 rounded-full inline-block mb-4">
            <BarChart3 className="h-10 w-10 text-danger-500" />
          </div>
          <h3 className="text-lg font-semibold text-theme-text-primary mb-2">Failed to load dashboard data</h3>
          <p className="text-sm text-theme-text-secondary">
            {error instanceof Error ? error.message : 'Please check your connection and try again'}
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '$0';
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const getStageName = (pipelineStageId: number | null) => {
    if (!pipelineStageId || !pipelineStages) return 'Unknown';
    const stage = pipelineStages.find((s: any) => s.id === pipelineStageId);
    return stage?.display_name || 'Unknown';
  };

  const getStageColor = (pipelineStageId: number | null) => {
    if (!pipelineStageId || !pipelineStages) return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    const stage = pipelineStages.find((s: any) => s.id === pipelineStageId);

    if (!stage) return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

    // Determine color classes based on stage properties
    if (stage.is_won) {
      return { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200' };
    } else if (stage.is_closed && !stage.is_won) {
      return { bg: 'bg-danger-50', text: 'text-danger-700', border: 'border-danger-200' };
    } else {
      return { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-theme-text-primary mb-2">Dashboard</h1>
          <p className="text-theme-text-secondary">Welcome back! Here's an overview of your business today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Leads"
          value={dashboardData?.lead_analytics?.total || 0}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          description="All time leads"
        />

        <StatCard
          title="New Leads"
          value={dashboardData?.lead_analytics?.new || 0}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          description="This month"
        />

        <StatCard
          title="Pipeline Value"
          value={formatCurrency(dashboardData?.deal_analytics?.total_amount)}
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
          description="Total open deals"
        />

        <StatCard
          title="Open Deals"
          value={dashboardData?.deal_analytics?.open_deals || 0}
          icon={BarChart3}
          trend={{ value: 5, isPositive: true }}
          description="In progress"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {dashboardData?.recent_leads && dashboardData.recent_leads.length > 0 ? (
                dashboardData.recent_leads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 hover:bg-theme-bg-tertiary rounded-lg transition-all duration-150 group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center ring-1 ring-primary-100 flex-shrink-0">
                        <span className="text-primary-700 font-semibold text-sm">
                          {lead.first_name[0]}{lead.last_name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-theme-text-primary text-sm truncate">{lead.first_name} {lead.last_name}</p>
                        <p className="text-xs text-theme-text-secondary truncate">{lead.company || 'No company'}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-md border flex-shrink-0 ml-2 ${
                      lead.status === 'new' ? 'bg-primary-50 text-primary-700 border-primary-200' :
                      lead.status === 'qualified' ? 'bg-success-50 text-success-700 border-success-200' :
                      lead.status === 'contacted' ? 'bg-warning-50 text-warning-700 border-warning-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty-state py-12">
                  <div className="p-3 bg-theme-bg-tertiary rounded-full inline-block mb-3">
                    <Users className="h-8 w-8 text-theme-text-tertiary" />
                  </div>
                  <p className="text-sm text-theme-text-secondary">No recent leads</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {dashboardData?.recent_deals && dashboardData.recent_deals.length > 0 ? (
                dashboardData.recent_deals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-3 hover:bg-theme-bg-tertiary rounded-lg transition-all duration-150 group">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-theme-text-primary text-sm truncate">{deal.name}</p>
                      <p className="text-xs text-theme-text-secondary truncate">{deal.contact_name || 'No contact'}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-semibold text-theme-text-primary text-sm mb-1">{formatCurrency(deal.amount)}</p>
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border ${getStageColor(deal.pipeline_stage).bg} ${getStageColor(deal.pipeline_stage).text} ${getStageColor(deal.pipeline_stage).border}`}>
                        {getStageName(deal.pipeline_stage)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state py-12">
                  <div className="p-3 bg-theme-bg-tertiary rounded-full inline-block mb-3">
                    <DollarSign className="h-8 w-8 text-theme-text-tertiary" />
                  </div>
                  <p className="text-sm text-theme-text-secondary">No recent deals</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};