import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export const Events: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Events</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Calendar and events
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="empty-state">
            <Calendar size={64} className="empty-state-icon" />
            <h3 className="text-lg font-semibold mb-2">Event Calendar</h3>
            <p className="empty-state-text">Events page coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
