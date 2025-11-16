import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiInsightsAPI } from '../services/api';
import { AIInsight } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AIAgentChat } from '../components/AIAgentChat';
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
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const AIInsights: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: () => aiInsightsAPI.getAll(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => aiInsightsAPI.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    },
  });

  const insightTypeIcons: Record<string, any> = {
    lead_score: Target,
    deal_prediction: TrendingUp,
    sentiment: MessageSquare,
    suggestion: Lightbulb,
    summary: FileText,
    agent_query: Sparkles,
    agent_lead: Target,
    agent_deal: TrendingUp,
    agent_report: FileText,
  };

  const insightTypeLabels: Record<string, string> = {
    lead_score: 'Lead Scoring',
    deal_prediction: 'Deal Prediction',
    sentiment: 'Sentiment Analysis',
    suggestion: 'Smart Suggestion',
    summary: 'Summary',
    agent_query: 'AI Agent Query',
    agent_lead: 'Lead Action',
    agent_deal: 'Deal Action',
    agent_report: 'Report',
  };

  const insightTypeColors: Record<string, string> = {
    lead_score: 'bg-blue-100 text-blue-700',
    deal_prediction: 'bg-green-100 text-green-700',
    sentiment: 'bg-purple-100 text-purple-700',
    suggestion: 'bg-yellow-100 text-yellow-700',
    summary: 'bg-gray-100 text-gray-700',
    agent_query: 'bg-primary-100 text-primary-700',
    agent_lead: 'bg-blue-100 text-blue-700',
    agent_deal: 'bg-green-100 text-green-700',
    agent_report: 'bg-gray-100 text-gray-700',
  };

  const filteredInsights = insights?.filter((insight: AIInsight) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !insight.is_read;
    return insight.insight_type === filter;
  });

  const unreadCount = insights?.filter((i: AIInsight) => !i.is_read).length || 0;

  const handleAgentActionComplete = () => {
    try {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    } catch (error) {
      console.error('Error refreshing data after AI action:', error);
      // Silently fail - don't crash the UI
    }
  };

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
            <h1 className="text-3xl font-semibold text-theme-text-primary">AI Assistant</h1>
          </div>
          <p className="text-theme-text-secondary">
            AI-powered conversational assistant powered by Google Gemini 1.5
          </p>
        </div>
        <div className="flex gap-2">
          <span className="badge badge-info">
            {unreadCount} New Insight{unreadCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* AI Agent Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div style={{ height: '600px' }}>
            <AIAgentChat
              context={{ page: 'ai-insights' }}
              onActionComplete={handleAgentActionComplete}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What You Can Ask</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
                  Lead Management
                </p>
                <ul className="text-sm text-theme-text-secondary space-y-1">
                  <li>• "Show me leads from Google"</li>
                  <li>• "Create a lead for John Doe"</li>
                  <li>• "Update lead #123 to qualified"</li>
                  <li>• "Score lead #456"</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
                  Deal Analytics
                </p>
                <ul className="text-sm text-theme-text-secondary space-y-1">
                  <li>• "Show my pipeline summary"</li>
                  <li>• "What's the status of deal #789?"</li>
                  <li>• "Move deal #123 to negotiation"</li>
                  <li>• "Predict deal #456 outcome"</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
                  Reporting
                </p>
                <ul className="text-sm text-theme-text-secondary space-y-1">
                  <li>• "How many deals in proposal?"</li>
                  <li>• "Total pipeline value?"</li>
                  <li>• "Lead conversion summary"</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-theme-text-secondary">
                {insights?.length || 0} total insights
              </p>
              <p className="text-sm text-theme-text-secondary">
                {unreadCount} unread
              </p>
            </CardContent>
          </Card>
        </div>
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

      {/* Insights History List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-theme-text-primary">Insights History</h2>
        {filteredInsights?.map((insight: AIInsight) => {
          const Icon = insightTypeIcons[insight.insight_type] || Sparkles;
          const colorClass = insightTypeColors[insight.insight_type] || 'bg-gray-100 text-gray-700';

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
                          {insightTypeLabels[insight.insight_type] || 'AI Agent'}
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
              Start chatting with the AI assistant above to generate insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
