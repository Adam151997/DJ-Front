import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export const Settings: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Application settings
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="empty-state">
            <SettingsIcon size={64} className="empty-state-icon" />
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="empty-state-text">Settings page coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
