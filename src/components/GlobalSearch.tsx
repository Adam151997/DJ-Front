import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { leadsAPI, contactsAPI, dealsAPI } from '../services/api';
import { Search, Users, Contact, TrendingUp, Loader2, X } from 'lucide-react';

interface SearchResult {
  id: number;
  type: 'lead' | 'contact' | 'deal';
  title: string;
  subtitle: string;
  path: string;
}

interface GlobalSearchProps {
  className?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search results
  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads', 'search', debouncedQuery],
    queryFn: () => leadsAPI.getAll(),
    enabled: debouncedQuery.length >= 2,
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['contacts', 'search', debouncedQuery],
    queryFn: () => contactsAPI.getAll(),
    enabled: debouncedQuery.length >= 2,
  });

  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ['deals', 'search', debouncedQuery],
    queryFn: () => dealsAPI.getAll(),
    enabled: debouncedQuery.length >= 2,
  });

  // Filter and format results
  const searchResults: SearchResult[] = [];

  if (debouncedQuery.length >= 2) {
    // Search leads
    leads?.filter((lead: any) =>
      lead.company_name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      lead.contact_name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(debouncedQuery.toLowerCase())
    ).forEach((lead: any) => {
      searchResults.push({
        id: lead.id,
        type: 'lead',
        title: lead.company_name || 'Unnamed Lead',
        subtitle: lead.contact_name || lead.email || 'No contact info',
        path: `/leads/${lead.id}`,
      });
    });

    // Search contacts
    contacts?.filter((contact: any) =>
      contact.first_name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      contact.last_name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(debouncedQuery.toLowerCase())
    ).forEach((contact: any) => {
      searchResults.push({
        id: contact.id,
        type: 'contact',
        title: `${contact.first_name} ${contact.last_name}`,
        subtitle: contact.company || contact.email || 'No company',
        path: `/contacts/${contact.id}`,
      });
    });

    // Search deals
    deals?.filter((deal: any) =>
      deal.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      deal.contact_name?.toLowerCase().includes(debouncedQuery.toLowerCase())
    ).forEach((deal: any) => {
      searchResults.push({
        id: deal.id,
        type: 'deal',
        title: deal.name,
        subtitle: deal.contact_name || `$${deal.amount || 0}`,
        path: `/deals/${deal.id}`,
      });
    });
  }

  const isLoading = leadsLoading || contactsLoading || dealsLoading;
  const hasResults = searchResults.length > 0;

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const getIcon = (type: 'lead' | 'contact' | 'deal') => {
    switch (type) {
      case 'lead':
        return Users;
      case 'contact':
        return Contact;
      case 'deal':
        return TrendingUp;
    }
  };

  const getTypeColor = (type: 'lead' | 'contact' | 'deal') => {
    switch (type) {
      case 'lead':
        return 'text-blue-600 bg-blue-50';
      case 'contact':
        return 'text-purple-600 bg-purple-50';
      case 'deal':
        return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-tertiary h-4 w-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search records, contacts, deals..."
          className="w-full pl-10 pr-10 py-2 text-sm border border-theme-border-primary rounded-lg bg-theme-bg-tertiary text-theme-text-primary
                   hover:bg-theme-bg-secondary hover:border-theme-border-secondary
                   focus:outline-none focus:bg-theme-bg-secondary focus:ring-2 focus:ring-primary-200 focus:border-primary-500
                   transition-all duration-200 placeholder-theme-text-tertiary"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-text-tertiary hover:text-theme-text-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-theme-bg-primary rounded-lg shadow-lg border border-theme-border-primary max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
              <span className="ml-2 text-sm text-theme-text-secondary">Searching...</span>
            </div>
          ) : hasResults ? (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-semibold text-theme-text-secondary uppercase tracking-wide">
                Results ({searchResults.length})
              </div>
              {searchResults.map((result, index) => {
                const Icon = getIcon(result.type);
                return (
                  <button
                    key={`${result.type}-${result.id}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-theme-bg-tertiary transition-colors duration-150"
                  >
                    <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-theme-text-primary">{result.title}</p>
                      <p className="text-xs text-theme-text-secondary">{result.subtitle}</p>
                    </div>
                    <div className="text-xs text-theme-text-tertiary capitalize">{result.type}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <Search className="h-8 w-8 text-theme-text-tertiary mb-2" />
              <p className="text-sm font-medium text-theme-text-primary mb-1">No results found</p>
              <p className="text-xs text-theme-text-secondary text-center">
                Try searching for a different name, company, or email
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search hint */}
      {isOpen && query.length > 0 && query.length < 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-theme-bg-primary rounded-lg shadow-lg border border-theme-border-primary p-4 z-50">
          <p className="text-sm text-theme-text-secondary">Type at least 2 characters to search</p>
        </div>
      )}
    </div>
  );
};
