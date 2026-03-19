-- ============================================================
-- TruckComply Seed Data
-- NOTE: Run after creating auth users manually or via Admin API
-- Replace UUIDs with actual auth user IDs from your Supabase project
-- ============================================================

-- Sample profiles (these are inserted by trigger on auth signup;
-- use these for manual testing in Supabase Studio)

-- Admin user
insert into profiles (id, email, full_name, role) values
  ('00000000-0000-0000-0000-000000000001', 'admin@truckcomply.ca', 'Admin User', 'admin')
on conflict (id) do update set role = 'admin';

-- Partner user
insert into profiles (id, email, full_name, role, phone) values
  ('00000000-0000-0000-0000-000000000002', 'partner@truckcomply.ca', 'John Partner', 'partner', '416-555-0102')
on conflict (id) do update set role = 'partner';

-- Customer users
insert into profiles (id, email, full_name, role, phone) values
  ('00000000-0000-0000-0000-000000000003', 'mike@speedfreight.ca', 'Mike Johnson', 'customer', '905-555-0103'),
  ('00000000-0000-0000-0000-000000000004', 'sara@oaklogistics.ca', 'Sara Chen', 'customer', '647-555-0104'),
  ('00000000-0000-0000-0000-000000000005', 'raj@punjabtrucking.ca', 'Raj Patel', 'customer', '519-555-0105')
on conflict (id) do nothing;

-- Sample organizations
insert into organizations (id, name, owner_id, province, city, address) values
  ('10000000-0000-0000-0000-000000000001', 'Speed Freight Inc.', '00000000-0000-0000-0000-000000000003', 'ON', 'Mississauga', '123 Logistics Blvd'),
  ('10000000-0000-0000-0000-000000000002', 'Oak Logistics Ltd.', '00000000-0000-0000-0000-000000000004', 'ON', 'Toronto', '456 Commerce St'),
  ('10000000-0000-0000-0000-000000000003', 'Punjab Trucking Co.', '00000000-0000-0000-0000-000000000005', 'ON', 'Brampton', '789 Industrial Ave')
on conflict (id) do nothing;

-- Sample service orders
insert into service_orders (id, organization_id, service_type, status, amount_paid, assigned_partner_id) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'cvor_ontario', 'in_progress', 14900, '00000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'cvor_ontario', 'waiting_documents', 14900, null),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'cvor_ontario', 'paid', 14900, null)
on conflict (id) do nothing;

-- Sample compliance tasks
insert into compliance_tasks (organization_id, service_order_id, title, description, status, due_date) values
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Upload proof of insurance', 'Minimum $2M liability required for Ontario CVOR', 'completed', '2026-03-15'),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Submit CVOR application to MTO', 'Application being processed by Ontario MTO', 'in_progress', '2026-03-25'),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Receive CVOR certificate', 'Awaiting MTO processing (5-10 business days)', 'pending', '2026-04-05'),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Upload business registration', 'Provide Ontario Business Registry certificate', 'pending', '2026-03-22'),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Upload proof of insurance', 'Insurance certificate from licensed provider', 'pending', '2026-03-22'),
  ('10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'Upload business registration', 'Required to start application', 'pending', '2026-03-28')
on conflict do nothing;

-- Sample invoices
insert into invoices (organization_id, stripe_invoice_id, amount, currency, status, description, paid_at) values
  ('10000000-0000-0000-0000-000000000001', 'in_seed_001', 14900, 'cad', 'paid', 'CVOR Ontario Setup Package', '2026-03-01 10:00:00+00'),
  ('10000000-0000-0000-0000-000000000002', 'in_seed_002', 14900, 'cad', 'paid', 'CVOR Ontario Setup Package', '2026-03-05 14:30:00+00'),
  ('10000000-0000-0000-0000-000000000003', 'in_seed_003', 14900, 'cad', 'paid', 'CVOR Ontario Setup Package', '2026-03-10 09:15:00+00')
on conflict do nothing;

-- Sample notes
insert into notes (organization_id, service_order_id, author_id, content, is_internal) values
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Application submitted to MTO. Processing time 7-10 business days.', false),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Insurance was slightly under minimum — contacted customer to update.', true),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Waiting on customer to upload business registration and insurance.', true)
on conflict do nothing;
