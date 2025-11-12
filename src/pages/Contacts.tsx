import React, { useState } from 'react';
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
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConvertModal, setShowConvertModal] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactsAPI.getAll(),
  });

  const { data: unconvertedLeads } = useQuery({
    queryKey: ['leads', 'unconverted'],
    queryFn: () => leadsAPI.getAll().then(leads => 
      leads.filter(lead => lead.status !== 'converted')
    ),
    enabled: showConvertModal,
  });

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

  const filteredContacts = contacts?.filter(contact =>
    contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for the contacts page
  const contactStats = {
    total: contacts?.length || 0,
    withLeads: contacts?.filter(contact => contact.lead).length || 0,
    withDeals: contacts?.filter(contact => contact.deal_count > 0).length || 0,
    companies: new Set(contacts?.map(contact => contact.company).filter(Boolean)).size,
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
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-2">Manage your customer relationships</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search contacts by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" icon={Filter}>
              Filter
            </Button>
            <Button variant="outline" icon={Download}>
              Export
            </Button>
            <Button variant="outline" icon={Upload}>
              Import
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Company</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Contact Info</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Deals</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Source</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts?.map((contact) => (
                  <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {contact.first_name?.[0]}{contact.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{contact.first_name} {contact.last_name}</p>
                          <p className="text-sm text-gray-500">{contact.title || 'No title'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-600">{contact.company || '-'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-600">{contact.email}</p>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <p className="text-gray-600">{contact.phone}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        contact.deal_count > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.deal_count} deals
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {contact.lead_source ? (
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          From Lead
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          Manual
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit}
                          onClick={() => setEditingContact(contact)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(contact)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!filteredContacts || filteredContacts.length === 0) && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No contacts found</p>
                {searchTerm && (
                  <p className="text-sm text-gray-400 mt-2">Try changing your search terms</p>
                )}
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
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Convert Lead to Contact</h3>
              <button 
                onClick={() => setShowConvertModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {unconvertedLeads?.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div>
                    <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                    <p className="text-sm text-gray-500">{lead.company} • {lead.email}</p>
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
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No unconverted leads available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};