import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesAPI } from '../services/api';
import { Opportunity } from '../types';
import { OpportunityForm } from '../components/forms/OpportunityForm';
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
  Edit,
  Trash2,
  Clock
} from 'lucide-react';

export const Opportunities: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => opportunitiesAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => opportunitiesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });

  const handleDelete = (opportunity: Opportunity) => {
    if (window.confirm(`Delete opportunity ${opportunity.name}?`)) {
      deleteMutation.mutate(opportunity.id);
    }
  };

  const filteredOpportunities = opportunities?.filter(opp =>
    opp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for the opportunities page
  const oppStats = {
    total: opportunities?.length || 0,
    totalValue: opportunities?.reduce((sum, opp) => sum + parseFloat(opp.amount || '0'), 0) || 0,
    avgValue: opportunities?.length
      ? (opportunities.reduce((sum, opp) => sum + parseFloat(opp.amount || '0'), 0) / opportunities.length)
      : 0,
    closingSoon: opportunities?.filter(opp => {
      if (!opp.close_date) return false;
      const closeDate = new Date(opp.close_date);
      const today = new Date();
      const daysUntilClose = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilClose >= 0 && daysUntilClose <= 30;
    }).length || 0,
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
              <div className="h-4 w-20 bg-theme-bg-secondary rounded"></div>
              <div className="h-8 w-16 bg-theme-bg-secondary rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Opportunities</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your sales opportunities</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon={Plus}
          size="lg"
        >
          Add Opportunity
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Opportunities"
          value={oppStats.total}
          icon={Target}
          description="All opportunities"
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(oppStats.totalValue)}
          icon={DollarSign}
          description="Total value"
        />
        <StatCard
          title="Average Deal"
          value={formatCurrency(oppStats.avgValue)}
          icon={TrendingUp}
          description="Per opportunity"
        />
        <StatCard
          title="Closing Soon"
          value={oppStats.closingSoon}
          icon={Clock}
          description="Within 30 days"
        />
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-tertiary h-4 w-4" />
              <input
                type="text"
                placeholder="Search opportunities by name, account, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <Button variant="outline" icon={Filter}>
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Opportunities ({filteredOpportunities?.length || 0})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="text-left py-3 px-6">Opportunity</th>
                  <th className="text-left py-3 px-6">Account</th>
                  <th className="text-left py-6">Contact</th>
                  <th className="text-left py-3 px-6">Amount</th>
                  <th className="text-left py-3 px-6">Close Date</th>
                  <th className="text-left py-3 px-6">Probability</th>
                  <th className="text-right py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities?.map((opportunity) => (
                  <tr
                    key={opportunity.id}
                    onClick={() => navigate(`/opportunities/${opportunity.id}`)}
                    className="cursor-pointer hover:bg-theme-bg-tertiary transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }}>
                          <TrendingUp className="h-5 w-5" style={{ color: 'var(--bg-primary)' }} />
                        </div>
                        <div>
                          <p className="font-medium text-theme-text-primary text-sm">{opportunity.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-theme-text-secondary">{opportunity.account_name || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-theme-text-secondary">{opportunity.contact_name || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-theme-text-primary">
                        {formatCurrency(parseFloat(opportunity.amount || '0'))}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-theme-text-secondary">{formatDate(opportunity.close_date)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${
                        (opportunity.probability || 0) >= 75 ? 'badge-success' :
                        (opportunity.probability || 0) >= 50 ? 'badge-warning' :
                        'badge-gray'
                      }`}>
                        {opportunity.probability || 0}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingOpportunity(opportunity);
                          }}
                          className="table-action-btn"
                          title="Edit opportunity"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(opportunity);
                          }}
                          className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                          title="Delete opportunity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!filteredOpportunities || filteredOpportunities.length === 0) && (
              <div className="empty-state py-16">
                <div className="p-4 bg-theme-bg-tertiary rounded-full inline-block mb-4">
                  <TrendingUp className="h-10 w-10 text-theme-text-tertiary" />
                </div>
                <h3 className="text-base font-medium text-theme-text-primary mb-1">No opportunities found</h3>
                <p className="text-sm text-theme-text-secondary">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first opportunity'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Opportunity Form Modal */}
      {(showForm || editingOpportunity) && (
        <OpportunityForm
          opportunity={editingOpportunity}
          onClose={() => {
            setShowForm(false);
            setEditingOpportunity(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingOpportunity(null);
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
          }}
        />
      )}
    </div>
  );
};
