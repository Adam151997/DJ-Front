import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsAPI, leadsAPI } from '../services/api';
import { Contact, Lead } from '../types';
import { ContactForm } from '../components/forms/ContactForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import {
  Plus,
  Search,
  Filter,
  Users,
  Mail,
  Phone,
  Building,
  Edit,
  Trash2,
  UserPlus,
  Download,
  Upload
} from 'lucide-react';

export const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConvertModal, setShowConvertModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: contactsResponse, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactsAPI.getAll(),
  });

  // Handle both paginated and non-paginated responses
  const contacts = Array.isArray(contactsResponse)
    ? contactsResponse
    : contactsResponse?.results || [];

  const { data: unconvertedLeadsResponse } = useQuery({
    queryKey: ['leads', 'unconverted'],
    queryFn: async () => {
      const leadsData = await leadsAPI.getAll();
      const leadsArray = Array.isArray(leadsData) ? leadsData : leadsData?.results || [];
      return leadsArray.filter((lead: Lead) => lead.status !== 'converted');
    },
    enabled: showConvertModal,
  });

  const unconvertedLeads = unconvertedLeadsResponse || [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contactsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const convertMutation = useMutation({
    mutationFn: (leadId: number) => contactsAPI.convertFromLead(leadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', 'leads'] });
      setShowConvertModal(false);
    },
  });

  const handleDelete = (contact: Contact) => {
    if (window.confirm(`Delete contact ${contact.first_name} ${contact.last_name}?`)) {
      deleteMutation.mutate(contact.id);
    }
  };

  const handleConvertLead = (lead: Lead) => {
    if (window.confirm(`Convert lead ${lead.first_name} ${lead.last_name} to contact?`)) {
      convertMutation.mutate(lead.id);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for the contacts page
  const contactStats = {
    total: contacts.length || 0,
    withLeads: contacts.filter(contact => contact.lead).length || 0,
    withDeals: contacts.filter(contact => contact.deal_count > 0).length || 0,
    companies: new Set(contacts.map(contact => contact.company).filter(Boolean)).size,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-theme-text-primary mb-2">Contacts</h1>
          <p className="text-theme-text-secondary">Manage your customer relationships</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon={UserPlus}
            onClick={() => setShowConvertModal(true)}
          >
            Convert Lead
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            icon={Plus}
            size="lg"
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Contacts"
          value={contactStats.total}
          icon={Users}
          description="All contacts"
        />
        <StatCard
          title="From Leads"
          value={contactStats.withLeads}
          icon={UserPlus}
          description="Converted leads"
        />
        <StatCard
          title="Active Deals"
          value={contactStats.withDeals}
          icon={Mail}
          description="With active deals"
        />
        <StatCard
          title="Companies"
          value={contactStats.companies}
          icon={Building}
          description="Unique companies"
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
                placeholder="Search contacts by name, email, or company..."
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

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Contacts ({filteredContacts?.length || 0})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="text-left py-3 px-6">Contact</th>
                  <th className="text-left py-3 px-6">Company</th>
                  <th className="text-left py-3 px-6">Contact Info</th>
                  <th className="text-left py-3 px-6">Deals</th>
                  <th className="text-left py-3 px-6">Source</th>
                  <th className="text-right py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts?.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => navigate(`/contacts/${contact.id}`)}
                    className="cursor-pointer hover:bg-theme-bg-tertiary transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center ring-1 ring-primary-100 flex-shrink-0">
                          <span className="text-primary-700 font-semibold text-sm">
                            {contact.first_name?.[0]}{contact.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-theme-text-primary text-sm">{contact.first_name} {contact.last_name}</p>
                          <p className="text-xs text-theme-text-secondary">{contact.title || 'No title'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-theme-text-secondary">{contact.company || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <p className="text-sm text-theme-text-secondary">{contact.email}</p>
                        {contact.phone && (
                          <p className="text-sm text-theme-text-secondary">{contact.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${
                        contact.deal_count > 0
                          ? 'badge-success'
                          : 'badge-gray'
                      }`}>
                        {contact.deal_count} deals
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${
                        contact.lead_source
                          ? 'badge-primary'
                          : 'badge-gray'
                      }`}>
                        {contact.lead_source ? 'From Lead' : 'Manual'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingContact(contact);
                          }}
                          className="table-action-btn"
                          title="Edit contact"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(contact);
                          }}
                          className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                          title="Delete contact"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!filteredContacts || filteredContacts.length === 0) && (
              <div className="empty-state py-16">
                <div className="p-4 bg-theme-bg-tertiary rounded-full inline-block mb-4">
                  <Users className="h-10 w-10 text-theme-text-tertiary" />
                </div>
                <h3 className="text-base font-medium text-theme-text-primary mb-1">No contacts found</h3>
                <p className="text-sm text-theme-text-secondary">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first contact'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Form Modal */}
      {(showForm || editingContact) && (
        <ContactForm
          contact={editingContact}
          onClose={() => {
            setShowForm(false);
            setEditingContact(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingContact(null);
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
          }}
        />
      )}

      {/* Convert Lead Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-theme-bg-primary rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Convert Lead to Contact</h3>
              <button
                onClick={() => setShowConvertModal(false)}
                className="text-theme-text-tertiary hover:text-theme-text-secondary"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {unconvertedLeads?.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border-b border-theme-border-primary">
                  <div>
                    <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                    <p className="text-sm text-theme-text-secondary">{lead.company} • {lead.email}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleConvertLead(lead)}
                  >
                    Convert
                  </Button>
                </div>
              ))}

              {(!unconvertedLeads || unconvertedLeads.length === 0) && (
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 text-theme-text-tertiary mx-auto mb-4" />
                  <p className="text-theme-text-secondary">No unconverted leads available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};