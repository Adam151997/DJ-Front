import React from 'react';
import { Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Accounts: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Accounts</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Manage your company accounts
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="empty-state">
            <Building2 size={64} className="empty-state-icon" />
            <h3 className="text-lg font-semibold mb-2">Accounts Management</h3>
            <p className="empty-state-text">
              Accounts page coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
