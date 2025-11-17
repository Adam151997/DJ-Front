import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export const Invoices: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Invoices</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Manage invoices and billing
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="empty-state">
            <FileText size={64} className="empty-state-icon" />
            <h3 className="text-lg font-semibold mb-2">Invoice Management</h3>
            <p className="empty-state-text">Invoices page coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
