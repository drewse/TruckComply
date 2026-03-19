export type UserRole = "customer" | "admin" | "partner"

export type ServiceOrderStatus =
  | "pending_payment"
  | "paid"
  | "in_progress"
  | "waiting_documents"
  | "submitted"
  | "completed"
  | "cancelled"

export type DocumentStatus = "pending" | "approved" | "rejected"

export type TaskStatus = "pending" | "in_progress" | "completed" | "blocked"

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "cancelled"
  | "trialing"
  | "incomplete"

export type InvoiceStatus = "paid" | "open" | "void" | "uncollectible"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  owner_id: string
  dot_number: string | null
  cvor_number: string | null
  province: string
  address: string | null
  city: string | null
  postal_code: string | null
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: string
  created_at: string
}

export interface ServiceOrder {
  id: string
  organization_id: string
  service_type: string
  status: ServiceOrderStatus
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  amount_paid: number | null
  assigned_partner_id: string | null
  notes: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface ComplianceTask {
  id: string
  organization_id: string
  service_order_id: string | null
  title: string
  description: string | null
  status: TaskStatus
  due_date: string | null
  completed_at: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  organization_id: string
  service_order_id: string | null
  uploaded_by: string
  name: string
  file_path: string
  file_type: string | null
  file_size: number | null
  status: DocumentStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  organization_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  status: SubscriptionStatus
  price_id: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  organization_id: string
  stripe_invoice_id: string
  amount: number
  currency: string
  status: InvoiceStatus
  description: string | null
  invoice_url: string | null
  paid_at: string | null
  created_at: string
}

export interface PartnerAssignment {
  id: string
  service_order_id: string
  partner_id: string
  assigned_by: string
  assigned_at: string
  completed_at: string | null
  notes: string | null
}

export interface Note {
  id: string
  organization_id: string
  service_order_id: string | null
  author_id: string
  content: string
  is_internal: boolean
  created_at: string
}

export interface ActivityLog {
  id: string
  organization_id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}
