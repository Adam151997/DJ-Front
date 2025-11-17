import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsAPI } from '../services/api';
import { Account } from '../types';
import { AccountForm } from '../components/forms/AccountForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import {
  Plus,
  Search,
  Filter,
  Building2,
  Users,
  DollarSign,
  Edit,
  Trash2,
  TrendingUp
} from 'lucide-react';

export const Accounts: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  const { data: accountsResponse, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsAPI.getAll(),
  });

  // Handle both paginated and non-paginated responses
  const accounts = Array.isArray(accountsResponse)
    ? accountsResponse
    : accountsResponse?.results || [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => accountsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const handleDelete = (account: Account) => {
    if (window.confirm(`Delete account ${account.name}?`)) {
      deleteMutation.mutate(account.id);
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.website?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for the accounts page
  const accountStats = {
    total: accounts.length || 0,
    active: accounts.filter(account => account.contacts_count > 0).length || 0,
    totalRevenue: accounts.reduce((sum, acc) => sum + (parseFloat(acc.annual_revenue || '0')), 0) || 0,
    avgContacts: accounts.length ? Math.round(accounts.reduce((sum, acc) => sum + (acc.contacts_count || 0), 0) / accounts.length) : 0,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Accounts</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your company accounts</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon={Plus}
          size="lg"
        >
          Add Account
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Accounts"
          value={accountStats.total}
          icon={Building2}
          description="All accounts"
        />
        <StatCard
          title="Active Accounts"
          value={accountStats.active}
          icon={Users}
          description="With contacts"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(accountStats.totalRevenue)}
          icon={DollarSign}
          description="Annual revenue"
        />
        <StatCard
          title="Avg Contacts"
          value={accountStats.avgContacts}
          icon={TrendingUp}
          description="Per account"
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
                placeholder="Search accounts by name, industry, or website..."
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

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Accounts ({filteredAccounts?.length || 0})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="text-left py-3 px-6">Account Name</th>
                  <th className="text-left py-3 px-6">Industry</th>
                  <th className="text-left py-3 px-6">Website</th>
                  <th className="text-left py-3 px-6">Contacts</th>
                  <th className="text-left py-3 px-6">Revenue</th>
                  <th className="text-right py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts?.map((account) => (
                  <tr
                    key={account.id}
                    onClick={() => navigate(`/accounts/${account.id}`)}
                    className="cursor-pointer hover:bg-theme-bg-tertiary transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }}>
                          <Building2 className="h-5 w-5" style={{ color: 'var(--bg-primary)' }} />
                        </div>
                        <div>
                          <p className="font-medium text-theme-text-primary text-sm">{account.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-theme-text-secondary">{account.industry || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-theme-text-secondary">{account.website || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${
                        account.contacts_count > 0
                          ? 'badge-success'
                          : 'badge-gray'
                      }`}>
                        {account.contacts_count || 0} contacts
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-theme-text-primary">
                        {account.annual_revenue ? formatCurrency(parseFloat(account.annual_revenue)) : '-'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAccount(account);
                          }}
                          className="table-action-btn"
                          title="Edit account"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(account);
                          }}
                          className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                          title="Delete account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!filteredAccounts || filteredAccounts.length === 0) && (
              <div className="empty-state py-16">
                <div className="p-4 bg-theme-bg-tertiary rounded-full inline-block mb-4">
                  <Building2 className="h-10 w-10 text-theme-text-tertiary" />
                </div>
                <h3 className="text-base font-medium text-theme-text-primary mb-1">No accounts found</h3>
                <p className="text-sm text-theme-text-secondary">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first account'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Form Modal */}
      {(showForm || editingAccount) && (
        <AccountForm
          account={editingAccount}
          onClose={() => {
            setShowForm(false);
            setEditingAccount(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingAccount(null);
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
          }}
        />
      )}
    </div>
  );
};
