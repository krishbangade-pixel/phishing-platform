-- =======================================================
-- MIGRATION: 001_create_scan_tables.sql
-- DESCRIPTION: Creates public.scans table with RLS policies and indexes
-- =======================================================

-- 1. Create table for storing phishing scan results
create table if not exists public.scans (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null references auth.users(id) on delete cascade,

    scan_type text not null
        check (scan_type in ('url', 'email', 'message')),

    target text not null,

    normalized_target text,

    risk_score integer not null default 0
        check (risk_score >= 0 and risk_score <= 100),

    risk_level text not null
        check (risk_level in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),

    status text not null
        check (status in ('safe', 'suspicious', 'malicious', 'unknown')),

    findings jsonb not null default '[]'::jsonb,

    recommendation text,

    api_results jsonb not null default '{}'::jsonb,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now()
);

-- 2. Indexes for fast history queries
create index if not exists idx_scans_user_id_created_at 
    on public.scans(user_id, created_at desc);

create index if not exists idx_scans_scan_type 
    on public.scans(user_id, scan_type);

create index if not exists idx_scans_risk_level 
    on public.scans(user_id, risk_level);

-- 3. Row Level Security (RLS)
alter table public.scans enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Users can view their own scans" on public.scans;
drop policy if exists "Users can insert their own scans" on public.scans;
drop policy if exists "Users can delete their own scans" on public.scans;

-- Policy: Authenticated users can view only their own scans
create policy "Users can view their own scans"
on public.scans
for select
to authenticated
using (auth.uid() = user_id);

-- Policy: Authenticated users can insert scans under their user ID
create policy "Users can insert their own scans"
on public.scans
for insert
to authenticated
with check (auth.uid() = user_id);

-- Policy: Authenticated users can delete only their own scans
create policy "Users can delete their own scans"
on public.scans
for delete
to authenticated
using (auth.uid() = user_id);
