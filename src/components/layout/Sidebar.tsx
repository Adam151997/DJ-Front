import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Contact,
  TrendingUp,
  Menu,
  X,
  Settings,
  Sliders,
  Layout as LayoutIcon,
  Sparkles,
  Brain,
  Zap,
  Mail,
  Webhook as WebhookIcon,
  Plug,
  Filter,
  Repeat,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Contacts', href: '/contacts', icon: Contact },
    { name: 'Deals', href: '/deals', icon: TrendingUp },
  ];

  const automationNavigation = [
    { name: 'AI Insights', href: '/ai-insights', icon: Brain },
    { name: 'Workflows', href: '/workflows', icon: Zap },
    { name: 'Email Campaigns', href: '/email-campaigns', icon: Mail },
    { name: 'Drip Campaigns', href: '/drip-campaigns', icon: Repeat },
    { name: 'Segments', href: '/segments', icon: Filter },
    { name: 'Email Analytics', href: '/email-analytics', icon: BarChart3 },
  ];

  const settingsNavigation = [
    { name: 'Templates', href: '/settings/templates', icon: Sparkles },
    { name: 'Pipeline Stages', href: '/settings/pipeline', icon: Sliders },
    { name: 'Custom Fields', href: '/settings/custom-fields', icon: LayoutIcon },
    { name: 'Email Providers', href: '/email-providers', icon: Mail },
    { name: 'Plugins', href: '/plugins', icon: Plug },
    { name: 'Webhooks', href: '/settings/webhooks', icon: WebhookIcon },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-150"
        >
          {isMobileOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200 shadow-sm transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">MoldCRM</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                    active
                      ? 'bg-primary-50 text-primary-700 shadow-xs'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Automation Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2">
              <Zap className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Automation
              </span>
            </div>
            {automationNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                    active
                      ? 'bg-primary-50 text-primary-700 shadow-xs'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Settings Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2">
              <Settings className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Settings
              </span>
            </div>
            {settingsNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                    active
                      ? 'bg-primary-50 text-primary-700 shadow-xs'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 bg-gray-25">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-primary-100">
              <span className="text-sm font-semibold text-white">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};