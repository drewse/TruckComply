-- ============================================================
-- TruckComply Initial Schema (idempotent — safe to re-run)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

do $$ begin
  create type user_role as enum ('customer', 'admin', 'partner');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_order_status as enum (
    'pending_payment',
    'paid',
    'in_progress',
    'waiting_documents',
    'submitted',
    'completed',
    'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type document_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_status as enum ('pending', 'in_progress', 'completed', 'blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_status as enum (
    'active',
    'past_due',
    'cancelled',
    'trialing',
    'incomplete'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type invoice_status as enum ('paid', 'open', 'void', 'uncollectible');
exception when duplicate_object then null; end $$;

-- ============================================================
-- PROFILES
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  role user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

do $$ begin
  create policy "Users can view own profile"
    on profiles for select
    using (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own profile"
    on profiles for update
    using (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins can view all profiles"
    on profiles for select
    using (
      exists (
        select 1 from profiles
        where id = auth.uid() and role = 'admin'
      )
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- ORGANIZATIONS
-- ============================================================

create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_id uuid not null references profiles(id),
  dot_number text,
  cvor_number text,
  province text not null default 'ON',
  address text,
  city text,
  postal_code text,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table organizations enable row level security;

do $$ begin
  create policy "Org owners can update their org"
    on organizations for update
    using (owner_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins can manage all orgs"
    on organizations for all
    using (
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- ORGANIZATION MEMBERS
-- ============================================================

create table if not exists organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique(organization_id, user_id)
);

alter table organization_members enable row level security;

do $$ begin
  create policy "Members can view memberships"
    on organization_members for select
    using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

-- Cross-table policy on organizations (safe now that organization_members exists)
do $$ begin
  create policy "Org members can view their org"
    on organizations for select
    using (
      owner_id = auth.uid()
      or exists (
        select 1 from organization_members
        where organization_id = organizations.id and user_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- SERVICE ORDERS
-- ============================================================

create table if not exists service_orders (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  service_type text not null default 'cvor_ontario',
  status service_order_status not null default 'pending_payment',
  stripe_payment_intent_id text,
  stripe_session_id text,
  amount_paid integer, -- in cents
  assigned_partner_id uuid references profiles(id),
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table service_orders enable row level security;

do $$ begin
  create policy "Customers view own org orders"
    on service_orders for select
    using (
      exists (
        select 1 from organizations
        where id = service_orders.organization_id
        and (owner_id = auth.uid() or exists (
          select 1 from organization_members
          where organization_id = organizations.id and user_id = auth.uid()
        ))
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Partners view assigned orders"
    on service_orders for select
    using (assigned_partner_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins manage all orders"
    on service_orders for all
    using (
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- COMPLIANCE TASKS
-- ============================================================

create table if not exists compliance_tasks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  service_order_id uuid references service_orders(id) on delete set null,
  title text not null,
  description text,
  status task_status not null default 'pending',
  due_date date,
  completed_at timestamptz,
  assigned_to uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table compliance_tasks enable row level security;

do $$ begin
  create policy "Users view own org tasks"
    on compliance_tasks for select
    using (
      exists (
        select 1 from organizations
        where id = compliance_tasks.organization_id
        and (owner_id = auth.uid() or exists (
          select 1 from organization_members
          where organization_id = organizations.id and user_id = auth.uid()
        ))
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Partners view assigned tasks"
    on compliance_tasks for select
    using (assigned_to = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Partners update assigned tasks"
    on compliance_tasks for update
    using (assigned_to = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins manage all tasks"
    on compliance_tasks for all
    using (
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- DOCUMENTS
-- ============================================================

create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  service_order_id uuid references service_orders(id) on delete set null,
  uploaded_by uuid not null references profiles(id),
  name text not null,
  file_path text not null,
  file_type text,
  file_size integer,
  status document_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table documents enable row level security;

do $$ begin
  create policy "Users manage own org documents"
    on documents for all
    using (
      exists (
        select 1 from organizations
        where id = documents.organization_id
        and (owner_id = auth.uid() or exists (
          select 1 from organization_members
          where organization_id = organizations.id and user_id = auth.uid()
        ))
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins manage all documents"
    on documents for all
    using (
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================

create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_customer_id text not null,
  status subscription_status not null default 'active',
  price_id text not null,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

do $$ begin
  create policy "Org owners view own subscriptions"
    on subscriptions for select
    using (
      exists (
        select 1 from organizations
        where id = subscriptions.organization_id and owner_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins manage all subscriptions"
    on subscriptions for all
    using (
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- INVOICES
-- ============================================================

create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  stripe_invoice_id text not null unique,
  amount integer not null, -- in cents
  currency text not null default 'cad',
  status invoice_status not null default 'open',
  description text,
  invoice_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table invoices enable row level security;

do $$ begin
  create policy "Org owners view own invoices"
    on invoices for select
    using (
      exists (
        select 1 from organizations
        where id = invoices.organization_id and owner_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins manage all invoices"
    on invoices for all
    using (
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- PARTNER ASSIGNMENTS
-- ============================================================

create table if not exists partner_assignments (
  id uuid primary key default uuid_generate_v4(),
  service_order_id uuid not null references service_orders(id) on delete cascade,
  partner_id uuid not null references profiles(id),
  assigned_by uuid not null references profiles(id),
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  notes text
);

alter table partner_assignments enable row level security;

do $$ begin
  create policy "Partners view own assignments"
    on partner_assignments for select
    using (partner_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins manage all assignments"
    on partner_assignments for all
    using (
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- NOTES
-- ============================================================

create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  service_order_id uuid references service_orders(id) on delete set null,
  author_id uuid not null references profiles(id),
  content text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

alter table notes enable row level security;

do $$ begin
  create policy "Admins see all notes"
    on notes for all
    using (
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Partners see assigned order notes"
    on notes for select
    using (
      not is_internal
      and exists (
        select 1 from service_orders
        where id = notes.service_order_id and assigned_partner_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Customers see non-internal notes for own org"
    on notes for select
    using (
      not is_internal
      and exists (
        select 1 from organizations
        where id = notes.organization_id and owner_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- ACTIVITY LOG
-- ============================================================

create table if not exists activity_log (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table activity_log enable row level security;

do $$ begin
  create policy "Org owners see own activity"
    on activity_log for select
    using (
      exists (
        select 1 from organizations
        where id = activity_log.organization_id and owner_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Admins see all activity"
    on activity_log for all
    using (
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null; end $$;

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_organizations_owner on organizations(owner_id);
create index if not exists idx_organizations_stripe_customer on organizations(stripe_customer_id);
create index if not exists idx_service_orders_org on service_orders(organization_id);
create index if not exists idx_service_orders_status on service_orders(status);
create index if not exists idx_service_orders_partner on service_orders(assigned_partner_id);
create index if not exists idx_compliance_tasks_org on compliance_tasks(organization_id);
create index if not exists idx_compliance_tasks_order on compliance_tasks(service_order_id);
create index if not exists idx_documents_org on documents(organization_id);
create index if not exists idx_subscriptions_org on subscriptions(organization_id);
create index if not exists idx_invoices_org on invoices(organization_id);
create index if not exists idx_activity_org on activity_log(organization_id);
create index if not exists idx_activity_user on activity_log(user_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

drop trigger if exists update_organizations_updated_at on organizations;
create trigger update_organizations_updated_at
  before update on organizations
  for each row execute function update_updated_at();

drop trigger if exists update_service_orders_updated_at on service_orders;
create trigger update_service_orders_updated_at
  before update on service_orders
  for each row execute function update_updated_at();

drop trigger if exists update_compliance_tasks_updated_at on compliance_tasks;
create trigger update_compliance_tasks_updated_at
  before update on compliance_tasks
  for each row execute function update_updated_at();

drop trigger if exists update_documents_updated_at on documents;
create trigger update_documents_updated_at
  before update on documents
  for each row execute function update_updated_at();

drop trigger if exists update_subscriptions_updated_at on subscriptions;
create trigger update_subscriptions_updated_at
  before update on subscriptions
  for each row execute function update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
