import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { segmentsAPI } from '../services/api';
import { Segment } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Plus,
  Users,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  BarChart3,
  Filter,
  CheckCircle,
  XCircle,
  Calculator,
} from 'lucide-react';

const SEGMENT_TYPE_COLORS: Record<string, string> = {
  static: 'bg-blue-100 text-blue-700',
  dynamic: 'bg-green-100 text-green-700',
  behavioral: 'bg-purple-100 text-purple-700',
};

interface SegmentFormProps {
  segment?: Segment | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SegmentForm: React.FC<SegmentFormProps> = ({ segment, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: segment?.name || '',
    description: segment?.description || '',
    segment_type: segment?.segment_type || 'dynamic',
    filter_conditions: segment?.filter_conditions || { match: 'all', rules: [] },
    auto_update: segment?.auto_update ?? true,
    is_active: segment?.is_active ?? true,
    tags: segment?.tags || [],
  });

  const [newTag, setNewTag] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: any) => segmentsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      onSuccess();
      alert('Segment created successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to create segment');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => segmentsAPI.update(segment!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      onSuccess();
      alert('Segment updated successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to update segment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (segment) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {segment ? 'Edit Segment' : 'Create New Segment'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="form-label">Segment Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="High-value customers"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Customers who have spent over $1000 in the last 6 months"
              rows={3}
            />
          </div>

          <div>
            <label className="form-label">Segment Type</label>
            <select
              className="form-select"
              value={formData.segment_type}
              onChange={(e) => setFormData({ ...formData, segment_type: e.target.value as any })}
              required
            >
              <option value="dynamic">Dynamic (Auto-updates based on conditions)</option>
              <option value="static">Static (Fixed list of contacts)</option>
              <option value="behavioral">Behavioral (Based on actions & engagement)</option>
            </select>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="form-label mb-2">Filter Conditions</label>
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <p className="text-sm text-gray-600">
                Define conditions for {formData.segment_type === 'static' ? 'including' : 'automatically including'} contacts in this segment.
              </p>
              <div className="text-sm text-gray-500">
                <strong>Example conditions:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Email opened in last 30 days</li>
                  <li>Deal amount greater than $1000</li>
                  <li>Lead status equals "qualified"</li>
                  <li>Engagement score &gt; 50</li>
                </ul>
              </div>
              <div className="mt-2">
                <p className="text-xs text-blue-600">
                  💡 Tip: Use the visual filter builder in the full UI to create complex conditions with AND/OR logic
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.auto_update}
                onChange={(e) => setFormData({ ...formData, auto_update: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Auto-update segment membership</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Active</span>
            </label>
          </div>

          <div>
            <label className="form-label">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="form-input flex-1"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {segment ? 'Update Segment' : 'Create Segment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Segments: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

  const { data: segments = [], isLoading } = useQuery({
    queryKey: ['segments'],
    queryFn: segmentsAPI.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => segmentsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      alert('Segment deleted successfully!');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Failed to delete segment');
    },
  });

  const calculateSizeMutation = useMutation({
    mutationFn: (id: number) => segmentsAPI.calculateSize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      alert('Segment size updated!');
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this segment?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (segment: Segment) => {
    setSelectedSegment(segment);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedSegment(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading segments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audience Segments</h1>
          <p className="text-gray-600 mt-1">
            Create targeted segments for personalized email campaigns
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Segment
        </Button>
      </div>

      {segments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Segments Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first segment to target specific groups of contacts
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Segment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {segments.map((segment: Segment) => (
            <Card key={segment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-4 bg-blue-100 text-blue-700 rounded-lg">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold">{segment.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SEGMENT_TYPE_COLORS[segment.segment_type]}`}>
                          {segment.segment_type_display || segment.segment_type}
                        </span>
                        {segment.is_active ? (
                          <CheckCircle className="w-4 h-4 text-green-600" title="Active" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" title="Inactive" />
                        )}
                      </div>
                      {segment.description && (
                        <p className="text-gray-600 text-sm mb-2">{segment.description}</p>
                      )}

                      <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="font-semibold ml-2">
                            {segment.actual_size.toLocaleString()} contacts
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Auto-update:</span>
                          <span className="font-semibold ml-2">
                            {segment.auto_update ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <span className="font-semibold ml-2">
                            {new Date(segment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {segment.tags && segment.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {segment.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => calculateSizeMutation.mutate(segment.id)}
                      disabled={calculateSizeMutation.isPending}
                      title="Recalculate size"
                    >
                      <Calculator className={`w-4 h-4 ${calculateSizeMutation.isPending ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(segment)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(segment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <SegmentForm
          segment={selectedSegment}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}
    </div>
  );
};
