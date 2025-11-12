import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealsAPI, contactsAPI } from '../services/api';
import { Deal, Contact } from '../types';
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
  const [selectedStage, setSelectedStage] = useState<string>('all');
  
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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => dealsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deals', 'analytics'] });
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ dealId, stage }: { dealId: number; stage: string }) =>
      dealsAPI.updateStage(dealId, stage),
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

  const handleStageUpdate = (deal: Deal, newStage: string) => {
    updateStageMutation.mutate({ dealId: deal.id, stage: newStage });
  };

  const filteredDeals = deals?.filter(deal => {
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contact_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = selectedStage === 'all' || deal.stage === selectedStage;
    
    return matchesSearch && matchesStage;
  });

  const stageOptions = [
    { value: 'all', label: 'All Stages', color: 'gray' },
    { value: 'prospect', label: 'Prospect', color: 'blue' },
    { value: 'qualification', label: 'Qualification', color: 'yellow' },
    { value: 'proposal', label: 'Proposal', color: 'orange' },
    { value: 'negotiation', label: 'Negotiation', color: 'purple' },
    { value: 'closed_won', label: 'Won', color: 'green' },
    { value: 'closed_lost', label: 'Lost', color: 'red' },
  ];

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-600 mt-2">Manage your sales pipeline and track deals</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search deals by name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                        ? 'bg-gray-600 text-white'
                        : `bg-${stage.color}-600 text-white`
                      : stage.value === 'all'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Deals Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Deal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stage</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Close Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Probability</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals?.map((deal) => (
                  <tr key={deal.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{deal.name}</p>
                        <p className="text-sm text-gray-500">
                          {deal.assigned_to_name || 'Unassigned'}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-600">{deal.contact_name || 'No contact'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(deal.amount)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={deal.stage}
                        onChange={(e) => handleStageUpdate(deal, e.target.value)}
                        className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-primary-500 ${
                          deal.stage === 'closed_won' ? 'bg-green-100 text-green-800' :
                          deal.stage === 'closed_lost' ? 'bg-red-100 text-red-800' :
                          deal.stage === 'prospect' ? 'bg-blue-100 text-blue-800' :
                          deal.stage === 'qualification' ? 'bg-yellow-100 text-yellow-800' :
                          deal.stage === 'proposal' ? 'bg-orange-100 text-orange-800' :
                          'bg-purple-100 text-purple-800'
                        }`}
                      >
                        <option value="prospect">Prospect</option>
                        <option value="qualification">Qualification</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="closed_won">Won</option>
                        <option value="closed_lost">Lost</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-600">
                          {deal.expected_close_date 
                            ? new Date(deal.expected_close_date).toLocaleDateString()
                            : 'Not set'
                          }
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {deal.probability}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit}
                          onClick={() => setEditingDeal(deal)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(deal)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!filteredDeals || filteredDeals.length === 0) && (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No deals found</p>
                {searchTerm && (
                  <p className="text-sm text-gray-400 mt-2">Try changing your search terms</p>
                )}
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