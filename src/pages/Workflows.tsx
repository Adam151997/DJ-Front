import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowsAPI } from '../services/api';
import { Workflow } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const Workflows: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const queryClient = useQueryClient();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => workflowsAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => workflowsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => workflowsAPI.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  const pauseMutation = useMutation({
    mutationFn: (id: number) => workflowsAPI.pause(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  const handleDelete = (workflow: Workflow) => {
    if (window.confirm(`Delete workflow "${workflow.name}"?`)) {
      deleteMutation.mutate(workflow.id);
    }
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    draft: 'bg-gray-100 text-gray-700',
  };

  const triggerTypeLabels: Record<string, string> = {
    deal_created: 'Deal Created',
    deal_updated: 'Deal Updated',
    stage_changed: 'Stage Changed',
    field_updated: 'Field Updated',
    lead_created: 'Lead Created',
    contact_created: 'Contact Created',
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-20 w-full bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-semibold text-gray-900">Automation Workflows</h1>
          </div>
          <p className="text-gray-600">
            Automate repetitive tasks with triggers and actions
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon={Plus}
          size="lg"
        >
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{workflows?.length || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {workflows?.filter((w: Workflow) => w.status === 'active').length || 0}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Paused</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {workflows?.filter((w: Workflow) => w.status === 'paused').length || 0}
                </p>
              </div>
              <Pause className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Executions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workflows?.reduce((sum: number, w: Workflow) => sum + w.execution_count, 0) || 0}
                </p>
              </div>
              <Zap className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows?.map((workflow: Workflow) => (
          <Card key={workflow.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {workflow.name}
                    </h3>
                    <span className={`badge ${statusColors[workflow.status]} text-xs`}>
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </span>
                  </div>

                  {workflow.description && (
                    <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Trigger:</span>
                      <span className="font-medium">
                        {triggerTypeLabels[workflow.trigger_type] || workflow.trigger_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Actions:</span>
                      <span className="font-medium">{workflow.actions.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Executions:</span>
                      <span className="font-medium">{workflow.execution_count}</span>
                    </div>
                    {workflow.last_executed_at && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Last Run:</span>
                        <span className="font-medium">
                          {new Date(workflow.last_executed_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {workflow.status === 'active' ? (
                    <button
                      onClick={() => pauseMutation.mutate(workflow.id)}
                      className="table-action-btn hover:text-yellow-600 hover:bg-yellow-50"
                      title="Pause workflow"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => activateMutation.mutate(workflow.id)}
                      className="table-action-btn hover:text-green-600 hover:bg-green-50"
                      title="Activate workflow"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedWorkflow(workflow)}
                    className="table-action-btn"
                    title="View details"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(workflow)}
                    className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                    title="Delete workflow"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!workflows || workflows.length === 0) && (
          <div className="empty-state py-16">
            <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
              <Zap className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">No workflows yet</h3>
            <p className="text-sm text-gray-500">
              Create your first automation workflow to save time
            </p>
          </div>
        )}
      </div>

      {/* Workflow Details Modal (simplified - full builder coming soon) */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{selectedWorkflow.name}</h2>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{selectedWorkflow.description || 'No description'}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Trigger</h3>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium">
                    {triggerTypeLabels[selectedWorkflow.trigger_type] || selectedWorkflow.trigger_type}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Actions ({selectedWorkflow.actions.length})</h3>
                <div className="space-y-2">
                  {selectedWorkflow.actions.map((action: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">{action.type || 'Action ' + (index + 1)}</p>
                      {action.description && (
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedWorkflow(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
