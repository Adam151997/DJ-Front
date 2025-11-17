import React from 'react';
import { Briefcase } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export const Cases: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Cases</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Customer support cases
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="empty-state">
            <Briefcase size={64} className="empty-state-icon" />
            <h3 className="text-lg font-semibold mb-2">Case Management</h3>
            <p className="empty-state-text">Cases page coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
