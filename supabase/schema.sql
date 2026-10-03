-- PocketWise database schema
-- Run this file once in the Supabase SQL Editor.

-- ========================================
-- Extensions
-- ========================================

create extension if not exists pgcrypto;

-- ========================================
-- Tables
-- ========================================

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null default '',
    created_at timestamptz not null default now()
);

create table if not exists public.transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    type text not null check (type in ('income', 'expense')),
    amount numeric(14, 2) not null check (amount > 0),
    category text not null,
    description text not null,
    date date not null,
    created_at timestamptz not null default now()
);

create table if not exists public.budgets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    month date not null,
    amount numeric(14, 2) not null check (amount > 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, month)
);

create table if not exists public.savings_goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    target_amount numeric(14, 2) not null check (target_amount > 0),
    current_amount numeric(14, 2) not null default 0
        check (current_amount >= 0 and current_amount <= target_amount),
    target_date date not null,
    description text not null default '',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ========================================
-- Row Level Security
-- ========================================

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.savings_goals enable row level security;

-- ========================================
-- Profile policies
-- ========================================

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- ========================================
-- Transaction policies
-- ========================================

create policy "transactions_select_own"
on public.transactions
for select
using (auth.uid() = user_id);

create policy "transactions_insert_own"
on public.transactions
for insert
with check (auth.uid() = user_id);

create policy "transactions_update_own"
on public.transactions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "transactions_delete_own"
on public.transactions
for delete
using (auth.uid() = user_id);

-- ========================================
-- Budget policies
-- ========================================

create policy "budgets_select_own"
on public.budgets
for select
using (auth.uid() = user_id);

create policy "budgets_insert_own"
on public.budgets
for insert
with check (auth.uid() = user_id);

create policy "budgets_update_own"
on public.budgets
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "budgets_delete_own"
on public.budgets
for delete
using (auth.uid() = user_id);

-- ========================================
-- Savings goal policies
-- ========================================

create policy "goals_select_own"
on public.savings_goals
for select
using (auth.uid() = user_id);

create policy "goals_insert_own"
on public.savings_goals
for insert
with check (auth.uid() = user_id);

create policy "goals_update_own"
on public.savings_goals
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "goals_delete_own"
on public.savings_goals
for delete
using (auth.uid() = user_id);

-- ========================================
-- Profile creation trigger
-- ========================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, full_name)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', '')
    )
    on conflict (id) do nothing;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- ========================================
-- Indexes
-- ========================================

create index if not exists transactions_user_date_idx
on public.transactions (user_id, date desc);

create index if not exists budgets_user_month_idx
on public.budgets (user_id, month desc);

create index if not exists goals_user_idx
on public.savings_goals (user_id);
