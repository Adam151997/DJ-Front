import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealsAPI, contactsAPI, pipelineStagesAPI } from '../services/api';
import { Deal, Contact, PipelineStage } from '../types';
import { DealForm } from '../components/forms/DealForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Target,
  Calendar,
  Edit, 
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const Deals: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | number>('all');
  
  const queryClient = useQueryClient();
  
  const { data: deals, isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealsAPI.getAll(),
  });

  const { data: pipelineAnalytics } = useQuery({
    queryKey: ['deals', 'analytics'],
    queryFn: () => dealsAPI.getPipelineAnalytics(),
  });

  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactsAPI.getAll(),
  });

  const { data: pipelineStages } = useQuery({
    queryKey: ['pipeline-stages'],
    queryFn: () => pipelineStagesAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => dealsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deals', 'analytics'] });
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ dealId, pipelineStageId }: { dealId: number; pipelineStageId: number }) =>
      dealsAPI.updateStage(dealId, pipelineStageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deals', 'analytics'] });
    },
  });

  const handleDelete = (deal: Deal) => {
    if (window.confirm(`Delete deal "${deal.name}"?`)) {
      deleteMutation.mutate(deal.id);
    }
  };

  const handleStageUpdate = (deal: Deal, pipelineStageId: number) => {
    updateStageMutation.mutate({ dealId: deal.id, pipelineStageId: pipelineStageId });
  };

  const filteredDeals = deals?.filter(deal => {
    const matchesSearch =
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contact_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = selectedStage === 'all' || deal.pipeline_stage === selectedStage;

    return matchesSearch && matchesStage;
  });

  // Use dynamic stages or fallback to default
  const defaultStages = [
    { value: 'all', label: 'All Stages', color: 'gray' },
    { value: 'prospect', label: 'Prospect', color: 'blue' },
    { value: 'qualification', label: 'Qualification', color: 'yellow' },
    { value: 'proposal', label: 'Proposal', color: 'orange' },
    { value: 'negotiation', label: 'Negotiation', color: 'purple' },
    { value: 'closed_won', label: 'Won', color: 'green' },
    { value: 'closed_lost', label: 'Lost', color: 'red' },
  ];

  const stageOptions = pipelineStages && pipelineStages.length > 0
    ? [
        { value: 'all', label: 'All Stages', color: 'gray' },
        ...pipelineStages.map(stage => ({
          value: stage.id,
          label: stage.display_name,
          color: stage.color.replace('#', ''), // Remove # for Tailwind classes
        }))
      ]
    : defaultStages;

  // Helper to get stage color class
  const getStageColorClass = (pipelineStageId: number | null) => {
    if (!pipelineStageId || !pipelineStages) {
      return { bg: '#6B72801A', text: '#6B7280' };
    }
    const stage = pipelineStages?.find(s => s.id === pipelineStageId);
    if (stage) {
      return {
        bg: stage.color + '1A', // 10% opacity
        text: stage.color,
      };
    }
    // Fallback color
    return { bg: '#6B72801A', text: '#6B7280' };
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '$0';
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-9 w-48 bg-theme-bg-secondary rounded-lg animate-pulse"></div>
            <div className="h-5 w-80 bg-theme-bg-secondary rounded-lg animate-pulse mt-3"></div>
          </div>
          <div className="h-10 w-32 bg-theme-bg-secondary rounded-lg animate-pulse"></div>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-theme-text-primary mb-2">Deals Pipeline</h1>
          <p className="text-theme-text-secondary">Manage your sales pipeline and track deals</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon={Plus}
          size="lg"
        >
          Add Deal
        </Button>
      </div>

      {/* Pipeline Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(pipelineAnalytics?.pipeline_value?.toString())}
          icon={DollarSign}
          description="Total open deals"
        />
        
        <StatCard
          title="Win Rate"
          value={`${pipelineAnalytics?.win_rate || 0}%`}
          icon={Target}
          description="Success rate"
        />
        
        <StatCard
          title="Total Deals"
          value={pipelineAnalytics?.total_deals || 0}
          icon={TrendingUp}
          description="All time"
        />
        
        <StatCard
          title="Deals Won"
          value={pipelineAnalytics?.won_deals || 0}
          icon={CheckCircle2}
          description="Closed successfully"
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-tertiary h-4 w-4" />
              <input
                type="text"
                placeholder="Search deals by name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {stageOptions.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => setSelectedStage(stage.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    selectedStage === stage.value
                      ? stage.value === 'all'
                        ? 'bg-theme-text-secondary text-white'
                        : `bg-${stage.color}-600 text-white`
                      : stage.value === 'all'
                      ? 'bg-theme-bg-tertiary text-theme-text-secondary hover:bg-theme-bg-secondary'
                      : `bg-${stage.color}-100 text-${stage.color}-700 hover:bg-${stage.color}-200`
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
            
            <Button variant="outline" icon={Filter}>
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Deals Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="text-left py-3 px-6">Deal</th>
                  <th className="text-left py-3 px-6">Contact</th>
                  <th className="text-left py-3 px-6">Amount</th>
                  <th className="text-left py-3 px-6">Stage</th>
                  <th className="text-left py-3 px-6">Close Date</th>
                  <th className="text-left py-3 px-6">Probability</th>
                  <th className="text-right py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals?.map((deal) => (
                  <tr key={deal.id}>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-theme-text-primary">{deal.name}</p>
                        <p className="text-sm text-theme-text-secondary">
                          {deal.assigned_to_name || 'Unassigned'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-theme-text-secondary">{deal.contact_name || 'No contact'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-theme-text-primary">
                        {formatCurrency(deal.amount)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={deal.pipeline_stage || ''}
                        onChange={(e) => handleStageUpdate(deal, Number(e.target.value))}
                        className="badge text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: getStageColorClass(deal.pipeline_stage).bg,
                          color: getStageColorClass(deal.pipeline_stage).text,
                          border: `1px solid ${getStageColorClass(deal.pipeline_stage).text}33`,
                        }}
                      >
                        {(pipelineStages && pipelineStages.length > 0 ? pipelineStages : []).map(stage => (
                          <option key={stage.id} value={stage.id}>
                            {stage.display_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-theme-text-tertiary" />
                        <p className="text-theme-text-secondary">
                          {deal.expected_close_date
                            ? new Date(deal.expected_close_date).toLocaleDateString()
                            : 'Not set'
                          }
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-theme-bg-secondary rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-theme-text-secondary">
                          {deal.probability}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingDeal(deal)}
                          className="table-action-btn"
                          title="Edit deal"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(deal)}
                          className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                          title="Delete deal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!filteredDeals || filteredDeals.length === 0) && (
              <div className="empty-state py-16">
                <div className="p-4 bg-theme-bg-tertiary rounded-full inline-block mb-4">
                  <TrendingUp className="h-10 w-10 text-theme-text-tertiary" />
                </div>
                <h3 className="text-base font-medium text-theme-text-primary mb-1">No deals found</h3>
                <p className="text-sm text-theme-text-secondary">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first deal'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deal Form Modal */}
      {(showForm || editingDeal) && (
        <DealForm
          deal={editingDeal}
          contacts={contacts || []}
          onClose={() => {
            setShowForm(false);
            setEditingDeal(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingDeal(null);
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            queryClient.invalidateQueries({ queryKey: ['deals', 'analytics'] });
          }}
        />
      )}
    </div>
  );
};