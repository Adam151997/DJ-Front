import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pipelineStagesAPI } from '../services/api';
import { PipelineStage } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Save,
  X,
  Settings2
} from 'lucide-react';

export const PipelineSettings: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    color: '#3B82F6',
    is_closed: false,
    is_won: false,
    order: 0,
  });

  const queryClient = useQueryClient();

  const { data: stages, isLoading } = useQuery({
    queryKey: ['pipeline-stages'],
    queryFn: () => pipelineStagesAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => pipelineStagesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      pipelineStagesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pipelineStagesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      color: '#3B82F6',
      is_closed: false,
      is_won: false,
      order: 0,
    });
    setShowForm(false);
    setEditingStage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStage) {
      updateMutation.mutate({ id: editingStage.id, data: formData });
    } else {
      const orderValue = stages ? stages.length : 0;
      createMutation.mutate({ ...formData, order: orderValue });
    }
  };

  const handleEdit = (stage: PipelineStage) => {
    setEditingStage(stage);
    setFormData({
      name: stage.name,
      display_name: stage.display_name,
      color: stage.color,
      is_closed: stage.is_closed,
      is_won: stage.is_won,
      order: stage.order,
    });
    setShowForm(true);
  };

  const handleDelete = (stage: PipelineStage) => {
    if (window.confirm(`Delete stage "${stage.display_name}"? This will affect existing deals.`)) {
      deleteMutation.mutate(stage.id);
    }
  };

  const colorOptions = [
    { value: '#3B82F6', label: 'Blue', bg: 'bg-blue-500' },
    { value: '#8B5CF6', label: 'Purple', bg: 'bg-purple-500' },
    { value: '#EC4899', label: 'Pink', bg: 'bg-pink-500' },
    { value: '#F59E0B', label: 'Orange', bg: 'bg-orange-500' },
    { value: '#10B981', label: 'Green', bg: 'bg-green-500' },
    { value: '#EF4444', label: 'Red', bg: 'bg-red-500' },
    { value: '#6366F1', label: 'Indigo', bg: 'bg-indigo-500' },
    { value: '#14B8A6', label: 'Teal', bg: 'bg-teal-500' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline Settings</h1>
          <p className="text-gray-600 mt-2">Configure your deal pipeline stages</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon={Plus}
          size="lg"
        >
          Add Stage
        </Button>
      </div>

      {/* Stages List */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-gray-600" />
            Pipeline Stages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stages?.map((stage) => (
              <div
                key={stage.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />

                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  ></div>

                  <div>
                    <h3 className="font-semibold text-gray-900">{stage.display_name}</h3>
                    <p className="text-sm text-gray-500">
                      {stage.name}
                      {stage.is_closed && (
                        <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                          Closed
                        </span>
                      )}
                      {stage.is_won && (
                        <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                          Won
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit}
                    onClick={() => handleEdit(stage)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDelete(stage)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {(!stages || stages.length === 0) && (
              <div className="text-center py-12">
                <Settings2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No pipeline stages configured</p>
                <p className="text-sm text-gray-400 mt-2">Add your first stage to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stage Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {editingStage ? 'Edit Stage' : 'Add New Stage'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Qualification"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Internal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., qualification"
                />
                <p className="text-xs text-gray-500 mt-1">Lowercase, no spaces (used for API)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`h-12 rounded-lg ${color.bg} transition-transform ${
                        formData.color === color.value ? 'ring-2 ring-offset-2 ring-primary-500 scale-105' : ''
                      }`}
                    >
                      {formData.color === color.value && (
                        <div className="flex items-center justify-center">
                          <div className="h-6 w-6 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_closed}
                    onChange={(e) => setFormData({ ...formData, is_closed: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">This is a closed stage</span>
                </label>

                {formData.is_closed && (
                  <label className="flex items-center gap-2 ml-6">
                    <input
                      type="checkbox"
                      checked={formData.is_won}
                      onChange={(e) => setFormData({ ...formData, is_won: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Mark as won (success)</span>
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createMutation.isPending || updateMutation.isPending}
                >
                  {editingStage ? 'Update Stage' : 'Create Stage'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
