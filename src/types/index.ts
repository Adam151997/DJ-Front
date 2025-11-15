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
  preview_text?: string;
  design_json?: any;
  thumbnail?: string;
  category?: 'newsletter' | 'promotional' | 'transactional';
  ai_optimization_score?: number;
  spam_score?: number;
  times_used?: number;
  avg_open_rate?: number;
  avg_click_rate?: number;
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
  campaign_type?: 'one_time' | 'recurring' | 'drip' | 'triggered';
  segment?: number | null;
  segment_name?: string;
  recipient_filter: any;
  scheduled_at: string | null;
  send_optimization?: 'immediate' | 'optimal_time' | 'time_zone_aware';
  throttle_rate?: number;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  total_recipients: number;
  sent_count: number;
  delivered_count?: number;
  opened_count: number;
  unique_opens?: number;
  clicked_count: number;
  unique_clicks?: number;
  bounced_count: number;
  hard_bounces?: number;
  soft_bounces?: number;
  unsubscribe_count?: number;
  spam_complaints?: number;
  conversions?: number;
  revenue?: number;
  roi?: number;
  ab_test_enabled?: boolean;
  ab_test_config?: any;
  goal_metric?: string;
  goal_value?: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  providers?: number[];
  provider_strategy?: 'priority' | 'round_robin' | 'failover';
}

export interface EmailProvider {
  id: number;
  account: number;
  provider_type: 'sendgrid' | 'mailgun' | 'mailchimp' | 'brevo' | 'klaviyo';
  name: string;
  api_key?: string; // write-only
  api_secret?: string; // write-only
  sender_email: string;
  sender_name: string;
  config: any;
  is_active: boolean;
  is_verified: boolean;
  daily_limit: number | null;
  monthly_limit: number | null;
  sent_today: number;
  sent_this_month: number;
  last_error: string;
  last_sent_at: string | null;
  priority: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface EmailProviderStats {
  total_sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
  sent_today: number;
  sent_this_month: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
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

// Plugin Integrations (Google Ads, Meta Ads, TikTok Ads, Shopify)
export interface Plugin {
  id: number;
  account: number;
  plugin_type: 'google_ads' | 'meta_ads' | 'tiktok_ads' | 'shopify';
  plugin_display?: string;
  name: string;
  category: 'advertising' | 'ecommerce' | 'analytics' | 'other';
  category_display?: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  status_display?: string;
  client_id: string;
  client_secret?: string; // write-only
  masked_client_secret?: string; // read-only masked value
  access_token?: string; // write-only
  masked_access_token?: string; // read-only masked value
  refresh_token?: string; // write-only
  token_expires_at: string | null;
  is_token_expired_flag?: boolean;
  config: any;
  is_active: boolean;
  is_verified: boolean;
  last_sync_at: string | null;
  last_error: string;
  sync_frequency: number;
  created_by: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface PluginEvent {
  id: number;
  plugin: number;
  plugin_name?: string;
  event_type: string;
  event_id: string;
  payload: any;
  processed: boolean;
  processed_at: string | null;
  lead_created: number | null;
  contact_created: number | null;
  deal_created: number | null;
  error_message: string;
  created_at: string;
}

export interface PluginSyncLog {
  id: number;
  plugin: number;
  plugin_name?: string;
  sync_type: string;
  status: 'success' | 'failed' | 'partial';
  records_synced: number;
  records_created: number;
  records_updated: number;
  records_failed: number;
  error_message: string;
  started_at: string;
  completed_at: string | null;
  metadata: any;
}

export interface PluginOAuthUrl {
  oauth_url: string;
  state: string;
}

export interface PluginAccountInfo {
  account_id?: string;
  account_name?: string;
  account_email?: string;
  account_status?: string;
  additional_info?: any;
}

// Enhanced Email Campaign Features

export interface Segment {
  id: number;
  account: number;
  name: string;
  description: string;
  segment_type: 'static' | 'dynamic' | 'behavioral';
  segment_type_display?: string;
  filter_conditions: any;
  static_contacts?: number[];
  estimated_size: number;
  actual_size: number;
  auto_update: boolean;
  is_active: boolean;
  tags?: string[];
  created_by: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  last_updated_at?: string | null;
}

export interface CampaignABTest {
  id: number;
  campaign: number;
  campaign_name?: string;
  test_name: string;
  status: 'testing' | 'completed' | 'cancelled';
  status_display?: string;
  test_element: string;
  variant_a_value: string;
  variant_a_sent: number;
  variant_a_opened: number;
  variant_a_clicked: number;
  variant_a_conversions: number;
  variant_b_value: string;
  variant_b_sent: number;
  variant_b_opened: number;
  variant_b_clicked: number;
  variant_b_conversions: number;
  test_sample_size: number;
  winner?: 'A' | 'B';
  is_statistically_significant: boolean;
  confidence_level?: number;
  started_at: string;
  completed_at?: string | null;
  created_at: string;
}

export interface DripCampaign {
  id: number;
  account: number;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  status_display?: string;
  trigger_type: string;
  trigger_type_display?: string;
  trigger_config: any;
  enrollment_rules: any;
  exit_conditions: any;
  skip_weekends: boolean;
  skip_holidays: boolean;
  send_time_hour?: number;
  time_zone?: string;
  total_enrollments: number;
  active_enrollments: number;
  completed_enrollments: number;
  total_emails_sent: number;
  avg_open_rate?: number;
  avg_click_rate?: number;
  created_by: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  activated_at?: string | null;
}

export interface DripCampaignStep {
  id: number;
  drip_campaign: number;
  drip_campaign_name?: string;
  order: number;
  step_name: string;
  delay_value: number;
  delay_unit: 'minutes' | 'hours' | 'days';
  template: number;
  template_name?: string;
  branch_on_action: boolean;
  branch_conditions?: any;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  created_at: string;
  updated_at: string;
}

export interface DripCampaignEnrollment {
  id: number;
  drip_campaign: number;
  drip_campaign_name?: string;
  contact?: number | null;
  lead?: number | null;
  recipient_email: string;
  recipient_name?: string;
  status: 'active' | 'completed' | 'exited' | 'paused';
  status_display?: string;
  current_step?: number | null;
  current_step_name?: string;
  next_send_at?: string | null;
  enrolled_at: string;
  completed_at?: string | null;
  exited_at?: string | null;
  exit_reason?: string;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
}

export interface EmailEngagement {
  id: number;
  email: number;
  contact?: number | null;
  lead?: number | null;
  engagement_score: number;
  opens_count: number;
  clicks_count: number;
  last_opened_at?: string | null;
  last_clicked_at?: string | null;
  device_type?: string;
  email_client?: string;
  location?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface LinkClick {
  id: number;
  email: number;
  contact?: number | null;
  lead?: number | null;
  url: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  clicked_at: string;
  device_type?: string;
  ip_address?: string;
  location?: string;
}

export interface UnsubscribePreference {
  id: number;
  contact?: number | null;
  lead?: number | null;
  email: string;
  unsubscribed_at: string;
  reason?: string;
  reason_text?: string;
  campaign_type_preferences?: any;
  frequency_preference?: string;
  resubscribe_token: string;
}

export interface CampaignGoal {
  id: number;
  campaign: number;
  campaign_name?: string;
  goal_type: 'open_rate' | 'click_rate' | 'conversion' | 'revenue';
  goal_type_display?: string;
  target_value: number;
  actual_value: number;
  achieved: boolean;
  achieved_at?: string | null;
  created_at: string;
}

// Analytics Types
export interface CampaignAnalytics {
  campaign_id: number;
  campaign_name: string;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  unique_opens: number;
  total_clicked: number;
  unique_clicks: number;
  total_bounced: number;
  hard_bounces: number;
  soft_bounces: number;
  total_unsubscribed: number;
  spam_complaints: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  click_to_open_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  spam_complaint_rate: number;
  conversions: number;
  conversion_rate: number;
  revenue: number;
  roi: number;
  device_breakdown?: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  timeline?: Array<{
    date: string;
    opens: number;
    clicks: number;
    conversions: number;
  }>;
}

export interface ContactEngagement {
  contact_id?: number;
  lead_id?: number;
  email: string;
  name: string;
  engagement_score: number;
  total_emails_received: number;
  total_opens: number;
  total_clicks: number;
  lifetime_open_rate: number;
  lifetime_click_rate: number;
  last_engaged_at?: string | null;
  best_send_time?: string;
  preferred_device?: string;
  churn_risk_score?: number;
}

// AI Feature Response Types
export interface SubjectLineOptimization {
  original: string;
  suggestions: Array<{
    subject: string;
    score: number;
    predicted_open_rate: number;
    reasoning: string;
  }>;
  best_performer: {
    subject: string;
    score: number;
    predicted_open_rate: number;
  };
}

export interface ContentImprovement {
  original_content: string;
  improved_content: string;
  improvements: string[];
  readability_score: number;
  spam_score: number;
  suggestions: string[];
}

export interface SendTimeOptimization {
  recommended_time: string;
  predicted_open_rate: number;
  reasoning: string;
  timezone: string;
  historical_data_points: number;
}

export interface SpamScoreResult {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  issues: Array<{
    severity: 'high' | 'medium' | 'low';
    issue: string;
    suggestion: string;
  }>;
  suggestions: string[];
}