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
  Layout as LayoutIcon
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

  const settingsNavigation = [
    { name: 'Pipeline Stages', href: '/settings/pipeline', icon: Sliders },
    { name: 'Custom Fields', href: '/settings/custom-fields', icon: LayoutIcon },
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
          className="p-2 bg-white rounded-lg shadow-medium border border-gray-200"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200 transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">MoldCRM</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Settings Section */}
          <div className="space-y-2">
            <div className="flex items-center px-4 py-2">
              <Settings className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </span>
            </div>
            {settingsNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center px-4 py-3">
            <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
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