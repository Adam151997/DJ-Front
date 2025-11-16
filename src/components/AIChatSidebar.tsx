import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAIChat } from '../contexts/AIChatContext';
import { AIAgentChat } from './AIAgentChat';
import { X, Keyboard } from 'lucide-react';

export const AIChatSidebar: React.FC = () => {
  const { isOpen, close, context } = useAIChat();
  const queryClient = useQueryClient();

  const handleActionComplete = () => {
    try {
      // Refresh all relevant data after AI actions
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    } catch (error) {
      console.error('Error refreshing data after AI action:', error);
    }
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={close}
        style={{ backdropFilter: 'blur(2px)' }}
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-theme-bg-primary shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme-border-primary bg-theme-bg-secondary">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-theme-text-primary">AI Assistant</h2>
              <p className="text-xs text-theme-text-secondary flex items-center gap-1">
                <Keyboard className="h-3 w-3" />
                Press Cmd+K or Esc to close
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="p-2 hover:bg-theme-bg-tertiary rounded-lg transition-colors"
            aria-label="Close AI Assistant"
          >
            <X className="h-5 w-5 text-theme-text-secondary" />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          <AIAgentChat
            context={context}
            onActionComplete={handleActionComplete}
          />
        </div>
      </div>
    </>
  );
};
