export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  department: string;
  account: number;  // Account ID
  account_name?: string;  // Account name for display
}

export interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  notes: string;
  assigned_to: number | null;
  assigned_to_name?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  custom_data: any;
}

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  department: string;
  lead: number | null;
  lead_source?: string;
  deal_count?: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  custom_data: any;
}

export interface Deal {
  id: number;
  name: string;
  contact: number;
  contact_name?: string;
  assigned_to: number | null;
  assigned_to_name?: string;
  amount: string | null;
  stage: string; // Legacy field, kept for backward compatibility
  pipeline_stage: number | null; // New field - pipeline stage ID
  expected_close_date: string | null;
  probability: number;
  notes: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  custom_data: any;
}

// Custom Objects System
export interface CustomObject {
  id: number;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  created_at: string;
  created_by: number;
  account: number;
}

export interface CustomField {
  id: number;
  name: string;
  display_name: string;
  field_type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'email' | 'phone' | 'textarea' | 'currency';
  required: boolean;
  options: string[] | null;
  order: number;
  custom_object: number;
  default_value?: string;
}

export interface CustomObjectRecord {
  id: number;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
  custom_object: number;
  created_by: number;
}

// Pipeline Stage Configuration
export interface PipelineStage {
  id: number;
  name: string;
  display_name: string;
  color: string;
  order: number;
  is_closed: boolean;
  is_won: boolean;
  account: number;
  created_at: string;
  updated_at: string;
}

// Business Templates
export interface BusinessTemplate {
  id: number;
  name: string;
  template_type: 'saas' | 'real_estate' | 'ecommerce' | 'consulting' | 'agency' | 'custom';
  description: string;
  icon: string;
  is_active: boolean;
  pipeline_stages: any[];
  custom_fields: any[];
  automation_rules: any[];
  email_templates: any[];
  created_at: string;
  updated_at: string;
}

export interface AppliedTemplate {
  id: number;
  account: number;
  template: number;
  template_name?: string;
  applied_by: number;
  applied_at: string;
  configuration: any;
}

// AI & Automation
export interface AIInsight {
  id: number;
  account: number;
  insight_type: 'lead_score' | 'deal_prediction' | 'sentiment' | 'suggestion' | 'summary';
  lead?: number;
  contact?: number;
  deal?: number;
  title: string;
  content: string;
  confidence_score: number;
  metadata: any;
  is_read: boolean;
  created_at: string;
}

export interface Workflow {
  id: number;
  account: number;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  trigger_type: string;
  trigger_config: any;
  actions: any[];
  execution_count: number;
  last_executed_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecution {
  id: number;
  workflow: number;
  workflow_name?: string;
  status: 'success' | 'failed' | 'running';
  trigger_data: any;
  actions_executed: any[];
  error_message: string;
  started_at: string;
  completed_at: string | null;
}

// Email & Communications
export interface EmailTemplate {
  id: number;
  account: number;
  name: string;
  template_type: 'welcome' | 'follow_up' | 'proposal' | 'thank_you' | 'reminder' | 'custom';
  subject: string;
  body_html: string;
  body_text: string;
  available_variables: string[];
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: number;
  account: number;
  name: string;
  template: number | null;
  template_name?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused';
  recipient_filter: any;
  scheduled_at: string | null;
  total_recipients: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Email {
  id: number;
  account: number;
  campaign: number | null;
  from_email: string;
  to_email: string;
  subject: string;
  body_html: string;
  body_text: string;
  lead: number | null;
  contact: number | null;
  deal: number | null;
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  tracking_id: string;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  error_message: string;
  created_at: string;
}

// Integrations
export interface Webhook {
  id: number;
  account: number;
  name: string;
  url: string;
  event_types: string[];
  secret: string;
  headers: any;
  is_active: boolean;
  total_calls: number;
  failed_calls: number;
  last_called_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: number;
  webhook: number;
  webhook_name?: string;
  event_type: string;
  payload: any;
  response_code: number | null;
  response_body: string;
  status: 'success' | 'failed';
  error_message: string;
  created_at: string;
}

export interface ExternalIntegration {
  id: number;
  account: number;
  platform: 'zapier' | 'make' | 'n8n' | 'custom_api' | 'slack' | 'google_sheets' | 'hubspot' | 'salesforce';
  name: string;
  config: any;
  is_active: boolean;
  last_sync_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}