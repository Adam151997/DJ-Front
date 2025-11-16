import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '../services/api';
import { Task } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, Check, Trash2, Loader2 } from 'lucide-react';

interface TasksSectionProps {
  leadId?: number;
  contactId?: number;
  dealId?: number;
}

export const TasksSection: React.FC<TasksSectionProps> = ({ leadId, contactId, dealId }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
  });
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', { lead: leadId, contact: contactId, deal: dealId }],
    queryFn: () => tasksAPI.getAll({ lead: leadId, contact: contactId, deal: dealId }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => tasksAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      setFormData({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => tasksAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tasksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    createMutation.mutate({
      ...formData,
      status: 'pending',
      ...(leadId && { lead: leadId }),
      ...(contactId && { contact: contactId }),
      ...(dealId && { deal: dealId }),
    });
  };

  const toggleComplete = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateMutation.mutate({
      id: task.id,
      data: {
        status: newStatus,
        ...(newStatus === 'completed' && { completed_at: new Date().toISOString() }),
      },
    });
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading tasks...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <Button onClick={() => setShowForm(!showForm)} icon={Plus} size="sm">
          Add Task
        </Button>
      </CardHeader>

      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-theme-bg-tertiary rounded-lg space-y-3">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Task title *"
              required
            />

            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={2}
              placeholder="Description (optional)"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-theme-text-secondary mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-theme-text-secondary mb-1">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                icon={createMutation.isPending ? Loader2 : Plus}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Task'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: '', description: '', priority: 'medium', due_date: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {tasks?.map((task: Task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border ${
                task.status === 'completed'
                  ? 'bg-success-50 border-success-200'
                  : 'bg-theme-bg-secondary border-theme-border-primary'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleComplete(task)}
                  className={`mt-1 h-5 w-5 rounded flex-shrink-0 flex items-center justify-center border-2 ${
                    task.status === 'completed'
                      ? 'bg-success-500 border-success-500'
                      : 'border-theme-border-secondary hover:border-primary-500'
                  }`}
                >
                  {task.status === 'completed' && <Check className="h-3 w-3 text-white" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4
                        className={`font-medium ${
                          task.status === 'completed'
                            ? 'text-theme-text-tertiary line-through'
                            : 'text-theme-text-primary'
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-theme-text-secondary mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => deleteMutation.mutate(task.id)}
                      className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className={`badge ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>

                    {task.due_date && (
                      <span className="text-theme-text-tertiary">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}

                    {task.assigned_to_name && (
                      <span className="text-theme-text-tertiary">
                        Assigned to: {task.assigned_to_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!tasks || tasks.length === 0) && !showForm && (
            <p className="text-center text-sm text-theme-text-tertiary py-8">
              No tasks yet. Click "Add Task" to create one.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
