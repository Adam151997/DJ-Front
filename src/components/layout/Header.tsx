import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun, LogOut, User } from 'lucide-react';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="header h-16 px-6">
      <div className="flex items-center justify-between h-full max-w-screen-2xl mx-auto">
        {/* Left section - Title/Breadcrumb */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold hidden sm:block" style={{ color: 'var(--text-primary)' }}>
            CRM Dashboard
          </h2>
        </div>

        {/* Right section - Actions & User */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost p-2"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs capitalize" style={{ color: 'var(--text-tertiary)' }}>
                {user?.role || 'User'}
              </p>
            </div>
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center font-semibold shadow-md"
              style={{ backgroundColor: 'var(--accent-primary)', color: theme === 'light' ? '#ffffff' : '#0a0a0a' }}
            >
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <button
              onClick={logout}
              className="btn-ghost p-2"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
