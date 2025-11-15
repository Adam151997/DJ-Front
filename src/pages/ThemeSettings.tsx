import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Palette, Sun, Moon, Contrast } from 'lucide-react';

export const ThemeSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: 'light' as const,
      name: 'Light Mode',
      description: 'Bright and clean interface',
      icon: Sun,
      preview: 'bg-white border-gray-200',
      textColor: 'text-gray-900',
    },
    {
      id: 'dark' as const,
      name: 'Dark Mode',
      description: 'Easy on the eyes for night work',
      icon: Moon,
      preview: 'bg-gray-900 border-gray-700',
      textColor: 'text-gray-100',
    },
    {
      id: 'high-contrast' as const,
      name: 'High Contrast',
      description: 'Maximum readability with extreme blackness',
      icon: Contrast,
      preview: 'bg-black border-white',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Theme Settings
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Choose your preferred color scheme for the CRM interface
        </p>
      </div>

      {/* Theme Options */}
      <Card>
        <CardHeader>
          <CardTitle>Select Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isActive = theme === themeOption.id;

              return (
                <button
                  key={themeOption.id}
                  onClick={() => setTheme(themeOption.id)}
                  className={`
                    relative p-6 rounded-xl border-2 text-left transition-all duration-200
                    ${isActive
                      ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                      : 'border-theme-border-primary hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute top-3 right-3">
                      <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${isActive ? 'bg-primary-100' : 'bg-theme-bg-tertiary'}`}>
                      <Icon className={`h-6 w-6 ${isActive ? 'text-primary-600' : 'text-theme-text-secondary'}`} />
                    </div>
                  </div>

                  <h3 className={`text-lg font-semibold mb-1 ${isActive ? 'text-primary-700' : 'text-theme-text-primary'}`}>
                    {themeOption.name}
                  </h3>
                  <p className="text-sm text-theme-text-secondary mb-4">
                    {themeOption.description}
                  </p>

                  {/* Preview Box */}
                  <div className={`
                    h-16 rounded-lg border-2 p-3
                    ${themeOption.preview}
                  `}>
                    <div className="flex items-center justify-between h-full">
                      <div className="flex flex-col gap-1">
                        <div className={`h-2 w-16 rounded ${themeOption.id === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`} />
                        <div className={`h-2 w-12 rounded ${themeOption.id === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                      </div>
                      <div className={`h-8 w-8 rounded ${themeOption.id === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Theme Persistence</h4>
            <p className="text-sm text-blue-700">
              Your theme preference is saved locally and will be remembered across sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
