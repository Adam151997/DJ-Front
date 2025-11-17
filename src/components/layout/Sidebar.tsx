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
  Briefcase,
  CheckSquare,
  FileText,
  Calendar,
  UserCircle,
  UsersRound,
  Moon,
  Sun,
  Building2,
  Brain,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Main CRM Navigation - matching DJCRM backend
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Contacts', href: '/contacts', icon: Contact },
    { name: 'Accounts', href: '/accounts', icon: Building2 },
    { name: 'Opportunities', href: '/opportunities', icon: TrendingUp },
  ];

  // AI Features - matching DJCRM backend
  const aiNavigation = [
    { name: 'AI Insights', href: '/ai-insights', icon: Brain },
    { name: 'AI Agent', href: '/ai-agent', icon: Sparkles },
  ];

  // Operations - matching DJCRM backend
  const operationsNavigation = [
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Cases', href: '/cases', icon: Briefcase },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Events', href: '/events', icon: Calendar },
  ];

  // Administration - matching DJCRM backend
  const adminNavigation = [
    { name: 'Users', href: '/users', icon: UserCircle },
    { name: 'Teams', href: '/teams', icon: UsersRound },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderNavItem = (item: { name: string; href: string; icon: React.ElementType }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={`nav-item ${active ? 'active' : ''}`}
      >
        <Icon size={20} />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="btn-secondary p-2"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        sidebar w-64
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        flex flex-col
      `}>
        {/* Logo/Brand */}
        <div className="sidebar-header">
          <h1 className="text-xl font-bold gradient-text">
            DJ CRM
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Futuristic CRM System
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 px-4" style={{ color: 'var(--text-tertiary)' }}>
              Main
            </h3>
            <div className="space-y-1">
              {navigation.map(renderNavItem)}
            </div>
          </div>

          {/* AI Features */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 px-4 neon-text">
              AI Powered
            </h3>
            <div className="space-y-1">
              {aiNavigation.map(renderNavItem)}
            </div>
          </div>

          {/* Operations */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 px-4" style={{ color: 'var(--text-tertiary)' }}>
              Operations
            </h3>
            <div className="space-y-1">
              {operationsNavigation.map(renderNavItem)}
            </div>
          </div>

          {/* Administration */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 px-4" style={{ color: 'var(--text-tertiary)' }}>
              Administration
            </h3>
            <div className="space-y-1">
              {adminNavigation.map(renderNavItem)}
            </div>
          </div>
        </nav>

        {/* Footer - User & Theme */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-secondary w-full mb-3 justify-center"
          >
            {theme === 'light' ? (
              <>
                <Moon size={16} />
                Dark Mode
              </>
            ) : (
              <>
                <Sun size={16} />
                Light Mode
              </>
            )}
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
            >
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs capitalize truncate" style={{ color: 'var(--text-tertiary)' }}>
                {user?.role || 'User'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-70 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};
