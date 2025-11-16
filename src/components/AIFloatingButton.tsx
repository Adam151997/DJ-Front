import React from 'react';
import { useAIChat } from '../contexts/AIChatContext';
import { MessageSquare, Sparkles } from 'lucide-react';

export const AIFloatingButton: React.FC = () => {
  const { toggle, isOpen } = useAIChat();

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 right-6 z-30 group transition-all duration-300 ${
        isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Toggle AI Assistant"
    >
      {/* Main button */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />

        {/* Button */}
        <div className="relative h-14 w-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200">
          <MessageSquare className="h-6 w-6 text-white" />

          {/* Sparkle indicator */}
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-success-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Open AI Assistant
        <div className="absolute top-full right-4 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900" />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Press <kbd className="px-1 py-0.5 bg-gray-800 rounded text-xs">⌘K</kbd>
        </div>
      </div>
    </button>
  );
};
