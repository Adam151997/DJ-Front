import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiInsightsAPI, leadsAPI, dealsAPI } from '../services/api';
import { AIInsight, Lead, Deal } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Brain,
  TrendingUp,
  Target,
  MessageSquare,
  Lightbulb,
  FileText,
  Zap,
  Check,
  Eye,
} from 'lucide-react';

export const AIInsights: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: () => aiInsightsAPI.getAll(),
  });

  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: () => leadsAPI.getAll(),
  });

  const { data: deals } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealsAPI.getAll(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => aiInsightsAPI.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    },
  });

  const generateLeadScoreMutation = useMutation({
    mutationFn: (leadId: number) => aiInsightsAPI.generateLeadScore(leadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
      alert('Lead score generated successfully!');
    },
  });

  const generateDealPredictionMutation = useMutation({
    mutationFn: (dealId: number) => aiInsightsAPI.generateDealPrediction(dealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
      alert('Deal prediction generated successfully!');
    },
  });

  const insightTypeIcons: Record<string, any> = {
    lead_score: Target,
    deal_prediction: TrendingUp,
    sentiment: MessageSquare,
    suggestion: Lightbulb,
    summary: FileText,
  };

  const insightTypeLabels: Record<string, string> = {
    lead_score: 'Lead Scoring',
    deal_prediction: 'Deal Prediction',
    sentiment: 'Sentiment Analysis',
    suggestion: 'Smart Suggestion',
    summary: 'Summary',
  };

  const insightTypeColors: Record<string, string> = {
    lead_score: 'bg-blue-100 text-blue-700',
    deal_prediction: 'bg-green-100 text-green-700',
    sentiment: 'bg-purple-100 text-purple-700',
    suggestion: 'bg-yellow-100 text-yellow-700',
    summary: 'bg-gray-100 text-gray-700',
  };

  const filteredInsights = insights?.filter((insight: AIInsight) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !insight.is_read;
    return insight.insight_type === filter;
  });

  const unreadCount = insights?.filter((i: AIInsight) => !i.is_read).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-theme-bg-secondary rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-theme-bg-primary rounded-xl border border-theme-border-primary p-6 animate-pulse">
              <div className="h-16 w-full bg-theme-bg-secondary rounded"></div>
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
            <Brain className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-semibold text-theme-text-primary">AI Insights</h1>
          </div>
          <p className="text-theme-text-secondary">
            AI-powered insights and recommendations powered by Google Gemini
          </p>
        </div>
        <div className="flex gap-2">
          <span className="badge badge-info">
            {unreadCount} New Insight{unreadCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Lead Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-theme-text-secondary mb-4">
              Get AI-powered scoring for your leads with recommendations
            </p>
            <select
              className="select-field mb-3"
              onChange={(e) => {
                if (e.target.value) {
                  generateLeadScoreMutation.mutate(Number(e.target.value));
                  e.target.value = '';
                }
              }}
              disabled={generateLeadScoreMutation.isPending}
            >
              <option value="">Select a lead...</option>
              {leads?.map((lead: Lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.first_name} {lead.last_name} - {lead.company}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predict Deal Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-theme-text-secondary mb-4">
              Get AI predictions for your deals' close probability and date
            </p>
            <select
              className="select-field mb-3"
              onChange={(e) => {
                if (e.target.value) {
                  generateDealPredictionMutation.mutate(Number(e.target.value));
                  e.target.value = '';
                }
              }}
              disabled={generateDealPredictionMutation.isPending}
            >
              <option value="">Select a deal...</option>
              {deals?.map((deal: Deal) => (
                <option key={deal.id} value={deal.id}>
                  {deal.name} - ${deal.amount || 0}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-theme-bg-tertiary text-theme-text-secondary hover:bg-theme-bg-secondary'
              }`}
            >
              All Insights ({insights?.length || 0})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                filter === 'unread'
                  ? 'bg-primary-600 text-white'
                  : 'bg-theme-bg-tertiary text-theme-text-secondary hover:bg-theme-bg-secondary'
              }`}
            >
              Unread ({unreadCount})
            </button>
            {Object.entries(insightTypeLabels).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  filter === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-theme-bg-tertiary text-theme-text-secondary hover:bg-theme-bg-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights?.map((insight: AIInsight) => {
          const Icon = insightTypeIcons[insight.insight_type];
          const colorClass = insightTypeColors[insight.insight_type];

          return (
            <Card key={insight.id} className={!insight.is_read ? 'border-primary-300' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-theme-text-primary mb-1">
                          {insight.title}
                        </h3>
                        <span className={`badge ${colorClass} text-xs`}>
                          {insightTypeLabels[insight.insight_type]}
                        </span>
                      </div>
                      {!insight.is_read && (
                        <span className="badge badge-primary text-xs">New</span>
                      )}
                    </div>

                    <div className="prose prose-sm max-w-none mb-3">
                      <p className="text-theme-text-secondary whitespace-pre-wrap">{insight.content}</p>
                    </div>

                    {insight.confidence_score > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-theme-text-secondary">Confidence</span>
                          <span className="font-medium">
                            {Math.round(insight.confidence_score * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-theme-bg-secondary rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${insight.confidence_score * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-theme-text-tertiary">
                        {new Date(insight.created_at).toLocaleString()}
                      </span>
                      {!insight.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => markReadMutation.mutate(insight.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {(!filteredInsights || filteredInsights.length === 0) && (
          <div className="empty-state py-16">
            <div className="p-4 bg-theme-bg-tertiary rounded-full inline-block mb-4">
              <Brain className="h-10 w-10 text-theme-text-tertiary" />
            </div>
            <h3 className="text-base font-medium text-theme-text-primary mb-1">No insights yet</h3>
            <p className="text-sm text-theme-text-tertiary">
              Generate lead scores or deal predictions to get AI-powered insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
