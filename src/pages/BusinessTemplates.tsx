import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templatesAPI } from '../services/api';
import { BusinessTemplate } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, Sparkles } from 'lucide-react';

export const BusinessTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<BusinessTemplate | null>(null);
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesAPI.getAll(),
  });

  const { data: appliedTemplates } = useQuery({
    queryKey: ['applied-templates'],
    queryFn: () => templatesAPI.getApplied(),
  });

  const applyMutation = useMutation({
    mutationFn: (id: number) => templatesAPI.apply(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applied-templates'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      setSelectedTemplate(null);
      alert('Template applied successfully! Your pipeline stages and custom fields have been updated.');
    },
  });

  const isTemplateApplied = (templateId: number) => {
    return appliedTemplates?.some((at: any) => at.template === templateId);
  };

  const handleApplyTemplate = (template: BusinessTemplate) => {
    if (window.confirm(`Apply the "${template.name}" template? This will add:\n- ${template.pipeline_stages.length} pipeline stages\n- ${template.custom_fields.length} custom fields\n\nYour existing data will not be affected.`)) {
      applyMutation.mutate(template.id);
    }
  };

  const templateTypeLabels: Record<string, string> = {
    saas: 'SaaS',
    real_estate: 'Real Estate',
    ecommerce: 'E-commerce',
    consulting: 'Consulting',
    agency: 'Agency',
    custom: 'Custom',
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-semibold text-gray-900">Business Templates</h1>
        </div>
        <p className="text-gray-600">
          Quick-start templates pre-configured for your industry with pipeline stages, custom fields, and automations
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template: BusinessTemplate) => {
          const applied = isTemplateApplied(template.id);

          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{template.icon}</div>
                  {applied && (
                    <span className="badge badge-success flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Applied
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  {template.description}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pipeline Stages:</span>
                    <span className="font-medium text-gray-900">
                      {template.pipeline_stages.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Custom Fields:</span>
                    <span className="font-medium text-gray-900">
                      {template.custom_fields.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="badge badge-info">
                      {templateTypeLabels[template.template_type]}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTemplate(template)}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApplyTemplate(template)}
                    disabled={applied || applyMutation.isPending}
                    className="flex-1"
                  >
                    {applied ? 'Applied' : 'Apply'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Template Details Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedTemplate.icon}</span>
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedTemplate.name}</h2>
                    <span className="badge badge-info">
                      {templateTypeLabels[selectedTemplate.template_type]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{selectedTemplate.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Pipeline Stages</h3>
                <div className="space-y-2">
                  {selectedTemplate.pipeline_stages.map((stage: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      ></div>
                      <span className="font-medium">{stage.display_name}</span>
                      {stage.is_closed && (
                        <span className="text-xs badge badge-secondary">
                          {stage.is_won ? 'Won' : 'Lost'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Custom Fields</h3>
                <div className="space-y-2">
                  {selectedTemplate.custom_fields.map((field: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{field.display_name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({field.field_type})
                        </span>
                      </div>
                      {field.required && (
                        <span className="badge badge-danger">Required</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleApplyTemplate(selectedTemplate)}
                  disabled={isTemplateApplied(selectedTemplate.id) || applyMutation.isPending}
                  loading={applyMutation.isPending}
                >
                  {isTemplateApplied(selectedTemplate.id) ? 'Already Applied' : 'Apply Template'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
