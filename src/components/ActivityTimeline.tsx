import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { activityLogsAPI } from '../services/api';
import { ActivityLog } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import {
  FileText,
  CheckSquare,
  Mail,
  Paperclip,
  UserCheck,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface ActivityTimelineProps {
  leadId?: number;
  contactId?: number;
  dealId?: number;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  leadId,
  contactId,
  dealId,
}) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activity-logs', { lead: leadId, contact: contactId, deal: dealId }],
    queryFn: () => activityLogsAPI.getAll({ lead: leadId, contact: contactId, deal: dealId }),
  });

  const getIcon = (actionType: string) => {
    const icons: Record<string, any> = {
      note_added: FileText,
      task_created: CheckSquare,
      task_completed: CheckSquare,
      email_sent: Mail,
      file_attached: Paperclip,
      converted: UserCheck,
      updated: Edit,
      deleted: Trash2,
      stage_changed: TrendingUp,
      created: Clock,
    };

    return icons[actionType] || Clock;
  };

  const getColor = (actionType: string) => {
    const colors: Record<string, string> = {
      note_added: 'text-blue-600',
      task_created: 'text-purple-600',
      task_completed: 'text-success-600',
      email_sent: 'text-primary-600',
      file_attached: 'text-orange-600',
      converted: 'text-green-600',
      deleted: 'text-danger-600',
      stage_changed: 'text-indigo-600',
    };

    return colors[actionType] || 'text-gray-600';
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading activity...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity: ActivityLog) => {
            const Icon = getIcon(activity.action_type);
            const colorClass = getColor(activity.action_type);

            return (
              <div key={activity.id} className="flex gap-3">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${colorClass} bg-opacity-10`}>
                  <Icon className={`h-4 w-4 ${colorClass}`} />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-theme-text-primary">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-theme-text-tertiary">
                      {activity.performed_by_name}
                    </span>
                    <span className="text-xs text-theme-text-tertiary">•</span>
                    <span className="text-xs text-theme-text-tertiary">
                      {new Date(activity.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {(!activities || activities.length === 0) && (
            <p className="text-center text-sm text-theme-text-tertiary py-8">
              No activity yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
