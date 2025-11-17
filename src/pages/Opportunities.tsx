import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export const Opportunities: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Opportunities</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Track your sales opportunities
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="empty-state">
            <TrendingUp size={64} className="empty-state-icon" />
            <h3 className="text-lg font-semibold mb-2">Opportunities Pipeline</h3>
            <p className="empty-state-text">
              Opportunities page coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
