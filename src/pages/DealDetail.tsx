import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealsAPI, pipelineStagesAPI } from '../services/api';
import { Deal } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { NotesSection } from '../components/NotesSection';
import { TasksSection } from '../components/TasksSection';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { DealForm } from '../components/forms/DealForm';
import {
  ArrowLeft,
  DollarSign,
  Building,
  MapPin,
  Edit,
  Trash2,
  Loader2,
  Globe,
  Users,
  TrendingUp,
  Calendar,
  FileText,
} from 'lucide-react';

export const DealDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showEditForm, setShowEditForm] = useState(false);

  const { data: deal, isLoading, error } = useQuery({
    queryKey: ['deal', id],
    queryFn: () => dealsAPI.getById(parseInt(id!)),
    enabled: !!id,
  });

  const { data: pipelineStages } = useQuery({
    queryKey: ['pipeline-stages'],
    queryFn: () => pipelineStagesAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (dealId: number) => dealsAPI.delete(dealId),
    onSuccess: () => {
      navigate('/deals');
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Delete deal "${deal?.name}"?`)) {
      deleteMutation.mutate(parseInt(id!));
    }
  };

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
    if (!pipelineStageId || !pipelineStages) return 'badge-gray';
    const stage = pipelineStages.find((s: any) => s.id === pipelineStageId);

    if (!stage) return 'badge-gray';

    if (stage.is_won) {
      return 'badge-success';
    } else if (stage.is_closed && !stage.is_won) {
      return 'badge-danger';
    } else {
      return 'badge-warning';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-danger-600 mb-4">Failed to load deal details</p>
        <Button onClick={() => navigate('/deals')} icon={ArrowLeft}>
          Back to Deals
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/deals')}
            icon={ArrowLeft}
            size="sm"
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-theme-text-primary">
              {deal.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-bold text-primary-600">
                {formatCurrency(deal.amount)}
              </span>
              <span className={`badge ${getStageColor(deal.pipeline_stage)}`}>
                {getStageName(deal.pipeline_stage)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowEditForm(true)}
            icon={Edit}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            icon={deleteMutation.isPending ? Loader2 : Trash2}
            disabled={deleteMutation.isPending}
            className="hover:bg-danger-50 hover:text-danger-600 hover:border-danger-200"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Deal & Contact Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                <DollarSign className="h-3 w-3" />
                Amount
              </label>
              <p className="text-lg font-semibold text-theme-text-primary mt-1">
                {formatCurrency(deal.amount)}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Stage
              </label>
              <span className={`inline-block mt-1 badge ${getStageColor(deal.pipeline_stage)}`}>
                {getStageName(deal.pipeline_stage)}
              </span>
            </div>

            {deal.probability && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                  Probability
                </label>
                <p className="text-sm text-theme-text-primary mt-1">{deal.probability}%</p>
              </div>
            )}

            {deal.expected_close_date && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Expected Close Date
                </label>
                <p className="text-sm text-theme-text-primary mt-1">
                  {new Date(deal.expected_close_date).toLocaleDateString()}
                </p>
              </div>
            )}

            {deal.contact_name && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                  Contact
                </label>
                <p className="text-sm text-theme-text-primary mt-1">{deal.contact_name}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                Created
              </label>
              <p className="text-sm text-theme-text-primary mt-1">
                {new Date(deal.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {deal.description && (
            <div className="mt-6 pt-6 border-t border-theme-border-primary">
              <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Description
              </label>
              <p className="text-sm text-theme-text-secondary mt-2 whitespace-pre-wrap">
                {deal.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Information Card */}
      {(deal.company_name || deal.company_industry || deal.company_size || deal.company_website || deal.company_address) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deal.company_name && (
                <div>
                  <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                    <Building className="h-3 w-3" />
                    Company Name
                  </label>
                  <p className="text-sm text-theme-text-primary mt-1">{deal.company_name}</p>
                </div>
              )}

              {deal.company_industry && (
                <div>
                  <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                    Industry
                  </label>
                  <p className="text-sm text-theme-text-primary mt-1">{deal.company_industry}</p>
                </div>
              )}

              {deal.company_size && (
                <div>
                  <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Company Size
                  </label>
                  <p className="text-sm text-theme-text-primary mt-1">{deal.company_size}</p>
                </div>
              )}

              {deal.company_website && (
                <div>
                  <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    Website
                  </label>
                  <p className="text-sm text-theme-text-primary mt-1">
                    <a
                      href={deal.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {deal.company_website}
                    </a>
                  </p>
                </div>
              )}

              {deal.company_address && (
                <div>
                  <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Address
                  </label>
                  <p className="text-sm text-theme-text-primary mt-1">{deal.company_address}</p>
                </div>
              )}
            </div>

            {deal.company_notes && (
              <div className="mt-6 pt-6 border-t border-theme-border-primary">
                <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                  Company Notes
                </label>
                <p className="text-sm text-theme-text-secondary mt-2 whitespace-pre-wrap">
                  {deal.company_notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Two Column Layout for Notes/Tasks and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Notes and Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <NotesSection dealId={parseInt(id!)} />
          <TasksSection dealId={parseInt(id!)} />
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-1">
          <ActivityTimeline dealId={parseInt(id!)} />
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <DealForm
          deal={deal}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            queryClient.invalidateQueries({ queryKey: ['deal', id] });
          }}
        />
      )}
    </div>
  );
};
