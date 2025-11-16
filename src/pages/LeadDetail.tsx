import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsAPI, contactsAPI } from '../services/api';
import { Lead } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { NotesSection } from '../components/NotesSection';
import { TasksSection } from '../components/TasksSection';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { LeadForm } from '../components/forms/LeadForm';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  MapPin,
  Edit,
  Trash2,
  UserCheck,
  Loader2,
} from 'lucide-react';

export const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showEditForm, setShowEditForm] = useState(false);

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsAPI.getById(parseInt(id!)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (leadId: number) => leadsAPI.delete(leadId),
    onSuccess: () => {
      navigate('/leads');
    },
  });

  const convertMutation = useMutation({
    mutationFn: (leadId: number) => leadsAPI.convert(leadId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      if (data.contact_id) {
        navigate(`/contacts/${data.contact_id}`);
      }
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Delete lead ${lead?.first_name} ${lead?.last_name}?`)) {
      deleteMutation.mutate(parseInt(id!));
    }
  };

  const handleConvert = () => {
    if (window.confirm(`Convert ${lead?.first_name} ${lead?.last_name} to a contact?`)) {
      convertMutation.mutate(parseInt(id!));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-danger-600 mb-4">Failed to load lead details</p>
        <Button onClick={() => navigate('/leads')} icon={ArrowLeft}>
          Back to Leads
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
            onClick={() => navigate('/leads')}
            icon={ArrowLeft}
            size="sm"
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-theme-text-primary">
              {lead.first_name} {lead.last_name}
            </h1>
            <p className="text-theme-text-secondary mt-1">{lead.company || 'No company'}</p>
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
            variant="primary"
            onClick={handleConvert}
            icon={convertMutation.isPending ? Loader2 : UserCheck}
            disabled={convertMutation.isPending}
          >
            {convertMutation.isPending ? 'Converting...' : 'Convert to Contact'}
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

      {/* Lead Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                Status
              </label>
              <span className={`inline-block mt-1 badge ${
                lead.status === 'new' ? 'badge-primary' :
                lead.status === 'qualified' ? 'badge-success' :
                lead.status === 'contacted' ? 'badge-warning' :
                'badge-gray'
              }`}>
                {lead.status}
              </span>
            </div>

            <div>
              <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Email
              </label>
              <p className="text-sm text-theme-text-primary mt-1">
                <a href={`mailto:${lead.email}`} className="hover:text-primary-600">
                  {lead.email}
                </a>
              </p>
            </div>

            {lead.phone && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  Phone
                </label>
                <p className="text-sm text-theme-text-primary mt-1">
                  <a href={`tel:${lead.phone}`} className="hover:text-primary-600">
                    {lead.phone}
                  </a>
                </p>
              </div>
            )}

            {lead.company && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                  <Building className="h-3 w-3" />
                  Company
                </label>
                <p className="text-sm text-theme-text-primary mt-1">{lead.company}</p>
              </div>
            )}

            {lead.address && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Address
                </label>
                <p className="text-sm text-theme-text-primary mt-1">{lead.address}</p>
              </div>
            )}

            {lead.source && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                  Source
                </label>
                <p className="text-sm text-theme-text-primary mt-1">{lead.source}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                Created
              </label>
              <p className="text-sm text-theme-text-primary mt-1">
                {new Date(lead.created_at).toLocaleDateString()}
              </p>
            </div>

            {lead.last_contact_date && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                  Last Contact
                </label>
                <p className="text-sm text-theme-text-primary mt-1">
                  {new Date(lead.last_contact_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {lead.notes && (
            <div className="mt-6 pt-6 border-t border-theme-border-primary">
              <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                Description
              </label>
              <p className="text-sm text-theme-text-secondary mt-2 whitespace-pre-wrap">
                {lead.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Layout for Notes/Tasks and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Notes and Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <NotesSection leadId={parseInt(id!)} />
          <TasksSection leadId={parseInt(id!)} />
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-1">
          <ActivityTimeline leadId={parseInt(id!)} />
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <LeadForm
          lead={lead}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            queryClient.invalidateQueries({ queryKey: ['lead', id] });
          }}
        />
      )}
    </div>
  );
};
