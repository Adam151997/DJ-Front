import React from 'react';
import { Activity, Note } from '../../types';
import { 
  Phone, 
  Mail, 
  Users, 
  FileText, 
  CheckCircle2, 
  Circle,
  Clock,
  Calendar
} from 'lucide-react';

interface ActivityTimelineProps {
  activities: Activity[];
  notes: Note[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ 
  activities, 
  notes 
}) => {
  const allItems = [
    ...activities.map(activity => ({ ...activity, type: 'activity' as const })),
    ...notes.map(note => ({ ...note, type: 'note' as const }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getActivityIcon = (type: string, completed: boolean = false) => {
    if (completed) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }

    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4 text-blue-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-purple-500" />;
      case 'meeting':
        return <Users className="h-4 w-4 text-orange-500" />;
      case 'task':
        return <CheckCircle2 className="h-4 w-4 text-yellow-500" />;
      case 'note':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (allItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No activities or notes yet</p>
        <p className="text-sm mt-1">Start by adding an activity or note</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allItems.map((item) => (
        <div key={`${item.type}-${item.id}`} className="flex space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-soft transition-shadow">
          <div className="flex-shrink-0 mt-1">
            {item.type === 'activity' 
              ? getActivityIcon(item.activity_type, item.completed)
              : <FileText className="h-4 w-4 text-gray-500" />
            }
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {item.type === 'activity' ? item.title : 'Note'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {item.type === 'activity' ? item.description : item.content}
                </p>
                
                {item.type === 'activity' && item.due_date && (
                  <div className="flex items-center space-x-1 mt-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Due: {new Date(item.due_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                <div>{formatDate(item.created_at)}</div>
                <div className="mt-1">by {item.created_by_name}</div>
              </div>
            </div>
            
            {item.related_object && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.related_object.type}: {item.related_object.name}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};