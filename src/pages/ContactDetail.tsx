import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsAPI } from '../services/api';
import { Contact } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { NotesSection } from '../components/NotesSection';
import { TasksSection } from '../components/TasksSection';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { ContactForm } from '../components/forms/ContactForm';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  MapPin,
  Edit,
  Trash2,
  Loader2,
  Briefcase,
  User,
} from 'lucide-react';

export const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showEditForm, setShowEditForm] = useState(false);

  const { data: contact, isLoading, error } = useQuery({
    queryKey: ['contact', id],
    queryFn: () => contactsAPI.getById(parseInt(id!)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (contactId: number) => contactsAPI.delete(contactId),
    onSuccess: () => {
      navigate('/contacts');
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Delete contact ${contact?.first_name} ${contact?.last_name}?`)) {
      deleteMutation.mutate(parseInt(id!));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-danger-600 mb-4">Failed to load contact details</p>
        <Button onClick={() => navigate('/contacts')} icon={ArrowLeft}>
          Back to Contacts
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
            onClick={() => navigate('/contacts')}
            icon={ArrowLeft}
            size="sm"
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-theme-text-primary">
              {contact.first_name} {contact.last_name}
            </h1>
            <p className="text-theme-text-secondary mt-1">
              {contact.job_title && contact.company
                ? `${contact.job_title} at ${contact.company}`
                : contact.company || contact.job_title || 'Contact'}
            </p>
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

      {/* Contact Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contact.is_converted && (
              <div className="lg:col-span-3">
                <div className="bg-success-50 border border-success-200 rounded-lg p-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-success-600" />
                  <span className="text-sm font-medium text-success-700">
                    Converted from lead
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Email
              </label>
              <p className="text-sm text-theme-text-primary mt-1">
                <a href={`mailto:${contact.email}`} className="hover:text-primary-600">
                  {contact.email}
                </a>
              </p>
            </div>

            {contact.phone && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  Phone
                </label>
                <p className="text-sm text-theme-text-primary mt-1">
                  <a href={`tel:${contact.phone}`} className="hover:text-primary-600">
                    {contact.phone}
                  </a>
                </p>
              </div>
            )}

            {contact.job_title && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                  <Briefcase className="h-3 w-3" />
                  Job Title
                </label>
                <p className="text-sm text-theme-text-primary mt-1">{contact.job_title}</p>
              </div>
            )}

            {contact.company && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                  <Building className="h-3 w-3" />
                  Company
                </label>
                <p className="text-sm text-theme-text-primary mt-1">{contact.company}</p>
              </div>
            )}

            {contact.address && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Address
                </label>
                <p className="text-sm text-theme-text-primary mt-1">{contact.address}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                Created
              </label>
              <p className="text-sm text-theme-text-primary mt-1">
                {new Date(contact.created_at).toLocaleDateString()}
              </p>
            </div>

            {contact.last_contact_date && (
              <div>
                <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                  Last Contact
                </label>
                <p className="text-sm text-theme-text-primary mt-1">
                  {new Date(contact.last_contact_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {contact.notes && (
            <div className="mt-6 pt-6 border-t border-theme-border-primary">
              <label className="text-xs font-medium text-theme-text-tertiary uppercase">
                Description
              </label>
              <p className="text-sm text-theme-text-secondary mt-2 whitespace-pre-wrap">
                {contact.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Layout for Notes/Tasks and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Notes and Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <NotesSection contactId={parseInt(id!)} />
          <TasksSection contactId={parseInt(id!)} />
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-1">
          <ActivityTimeline contactId={parseInt(id!)} />
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <ContactForm
          contact={contact}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            queryClient.invalidateQueries({ queryKey: ['contact', id] });
          }}
        />
      )}
    </div>
  );
};
