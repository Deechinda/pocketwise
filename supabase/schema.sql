-- PocketWise database schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null default '',
    persona text not null default 'student',
    money_frequency text not null default 'irregular',
    focus_areas text[] not null default '{}',
    onboarding_complete boolean not null default false,
    created_at timestamptz not null default now()
);

create table if not exists public.transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    type text not null check (type in ('income','expense')),
    amount numeric(14,2) not null check (amount > 0),
    category text not null,
    description text not null,
    source text,
    date date not null,
    plan_id uuid,
    allocation_id uuid,
    created_at timestamptz not null default now()
);

create table if not exists public.budgets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    month date not null,
    amount numeric(14,2) not null check (amount > 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, month)
);

create table if not exists public.savings_goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    target_amount numeric(14,2) not null check (target_amount > 0),
    current_amount numeric(14,2) not null default 0 check (current_amount >= 0 and current_amount <= target_amount),
    target_date date not null,
    description text not null default '',
    contribution_mode text not null default 'manual' check (contribution_mode in ('manual','fixed','percentage')),
    contribution_value numeric(14,2) not null default 0 check (contribution_value >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.money_plans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null default 'Current plan',
    plan_type text not null default 'custom' check (plan_type in ('week','two_weeks','three_weeks','month','until_date','until_next_money','custom')),
    start_date date not null,
    end_date date not null,
    total_amount numeric(14,2) not null default 0 check (total_amount >= 0),
    status text not null default 'active' check (status in ('active','saved','completed')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (end_date >= start_date)
);

create table if not exists public.money_allocations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    plan_id uuid not null references public.money_plans(id) on delete cascade,
    name text not null,
    planned_amount numeric(14,2) not null default 0 check (planned_amount >= 0),
    protected boolean not null default false,
    created_at timestamptz not null default now()
);

create table if not exists public.money_tasks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    list_name text not null default 'My tasks',
    task_type text not null default 'custom' check (task_type in ('shopping','school','bills','household','personal','business','custom')),
    title text not null,
    amount numeric(14,2) not null default 0 check (amount >= 0),
    due_date date,
    priority text not null default 'normal' check (priority in ('low','normal','high')),
    status text not null default 'open' check (status in ('open','done')),
    notes text not null default '',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.transactions drop constraint if exists transactions_plan_id_fkey;
alter table public.transactions add constraint transactions_plan_id_fkey foreign key (plan_id) references public.money_plans(id) on delete set null;
alter table public.transactions drop constraint if exists transactions_allocation_id_fkey;
alter table public.transactions add constraint transactions_allocation_id_fkey foreign key (allocation_id) references public.money_allocations(id) on delete set null;

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.savings_goals enable row level security;
alter table public.money_plans enable row level security;
alter table public.money_allocations enable row level security;
alter table public.money_tasks enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid()=id);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert with check (auth.uid()=id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);

drop policy if exists transactions_select_own on public.transactions;
create policy transactions_select_own on public.transactions for select using (auth.uid()=user_id);
drop policy if exists transactions_insert_own on public.transactions;
create policy transactions_insert_own on public.transactions for insert with check (auth.uid()=user_id);
drop policy if exists transactions_update_own on public.transactions;
create policy transactions_update_own on public.transactions for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists transactions_delete_own on public.transactions;
create policy transactions_delete_own on public.transactions for delete using (auth.uid()=user_id);

drop policy if exists budgets_select_own on public.budgets;
create policy budgets_select_own on public.budgets for select using (auth.uid()=user_id);
drop policy if exists budgets_insert_own on public.budgets;
create policy budgets_insert_own on public.budgets for insert with check (auth.uid()=user_id);
drop policy if exists budgets_update_own on public.budgets;
create policy budgets_update_own on public.budgets for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists budgets_delete_own on public.budgets;
create policy budgets_delete_own on public.budgets for delete using (auth.uid()=user_id);

drop policy if exists goals_select_own on public.savings_goals;
create policy goals_select_own on public.savings_goals for select using (auth.uid()=user_id);
drop policy if exists goals_insert_own on public.savings_goals;
create policy goals_insert_own on public.savings_goals for insert with check (auth.uid()=user_id);
drop policy if exists goals_update_own on public.savings_goals;
create policy goals_update_own on public.savings_goals for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists goals_delete_own on public.savings_goals;
create policy goals_delete_own on public.savings_goals for delete using (auth.uid()=user_id);

drop policy if exists money_plans_select_own on public.money_plans;
create policy money_plans_select_own on public.money_plans for select using (auth.uid()=user_id);
drop policy if exists money_plans_insert_own on public.money_plans;
create policy money_plans_insert_own on public.money_plans for insert with check (auth.uid()=user_id);
drop policy if exists money_plans_update_own on public.money_plans;
create policy money_plans_update_own on public.money_plans for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists money_plans_delete_own on public.money_plans;
create policy money_plans_delete_own on public.money_plans for delete using (auth.uid()=user_id);

drop policy if exists money_allocations_select_own on public.money_allocations;
create policy money_allocations_select_own on public.money_allocations for select using (auth.uid()=user_id);
drop policy if exists money_allocations_insert_own on public.money_allocations;
create policy money_allocations_insert_own on public.money_allocations for insert with check (auth.uid()=user_id);
drop policy if exists money_allocations_update_own on public.money_allocations;
create policy money_allocations_update_own on public.money_allocations for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists money_allocations_delete_own on public.money_allocations;
create policy money_allocations_delete_own on public.money_allocations for delete using (auth.uid()=user_id);

drop policy if exists money_tasks_select_own on public.money_tasks;
create policy money_tasks_select_own on public.money_tasks for select using (auth.uid()=user_id);
drop policy if exists money_tasks_insert_own on public.money_tasks;
create policy money_tasks_insert_own on public.money_tasks for insert with check (auth.uid()=user_id);
drop policy if exists money_tasks_update_own on public.money_tasks;
create policy money_tasks_update_own on public.money_tasks for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists money_tasks_delete_own on public.money_tasks;
create policy money_tasks_delete_own on public.money_tasks for delete using (auth.uid()=user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
    insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name','')) on conflict(id) do nothing;
    return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create index if not exists transactions_user_date_idx on public.transactions(user_id,date desc);
create index if not exists transactions_plan_idx on public.transactions(plan_id);
create index if not exists budgets_user_month_idx on public.budgets(user_id,month desc);
create index if not exists goals_user_idx on public.savings_goals(user_id);
create index if not exists plans_user_status_idx on public.money_plans(user_id,status,end_date);
create index if not exists allocations_plan_idx on public.money_allocations(plan_id);
create index if not exists tasks_user_status_idx on public.money_tasks(user_id,status,due_date);
