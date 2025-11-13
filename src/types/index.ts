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
  stage: string;
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