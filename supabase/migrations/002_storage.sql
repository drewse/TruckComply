-- ============================================================
-- TruckComply Storage Setup (idempotent — safe to re-run)
-- ============================================================

-- Create private documents bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760, -- 10 MB
  array['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
on conflict (id) do nothing;

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- Customers: upload to their own org folder
do $$ begin
  create policy "Customers can upload to own org"
    on storage.objects for insert
    to authenticated
    with check (
      bucket_id = 'documents'
      and (storage.foldername(name))[1] in (
        select id::text from public.organizations where owner_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

-- Customers: read their own org documents
do $$ begin
  create policy "Customers can read own org documents"
    on storage.objects for select
    to authenticated
    using (
      bucket_id = 'documents'
      and (storage.foldername(name))[1] in (
        select id::text from public.organizations where owner_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

-- Customers: delete their own org documents
do $$ begin
  create policy "Customers can delete own org documents"
    on storage.objects for delete
    to authenticated
    using (
      bucket_id = 'documents'
      and (storage.foldername(name))[1] in (
        select id::text from public.organizations where owner_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

-- Admins: full access to all documents
do $$ begin
  create policy "Admins can access all documents"
    on storage.objects for all
    to authenticated
    using (
      bucket_id = 'documents'
      and exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      )
    );
exception when duplicate_object then null; end $$;
