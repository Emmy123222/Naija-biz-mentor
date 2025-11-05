/*
  # Initialize database schema
  
  1. New Tables
    - `profiles` - User profile information
    - `invoices` - Invoice records
    - `invoice_items` - Line items for invoices
  
  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
*/

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamp with time zone default now()
);

-- Invoices
create table if not exists public.invoices (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  customer_name text not null,
  customer_phone text,
  customer_address text,
  currency text check (currency in ('NGN','USD','GHS')) not null default 'NGN',
  date date not null,
  subtotal numeric not null default 0,
  created_at timestamp with time zone default now()
);

create table if not exists public.invoice_items (
  id bigint generated always as identity primary key,
  invoice_id bigint references public.invoices(id) on delete cascade,
  description text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

-- RLS Policies
create policy "profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "profiles are insertable by owner" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles are updatable by owner" on public.profiles for update using (auth.uid() = id);

create policy "invoices are viewable by owner" on public.invoices for select using (auth.uid() = user_id);
create policy "invoices are manageable by owner" on public.invoices for all using (auth.uid() = user_id);

create policy "items are viewable by owner" on public.invoice_items for select using (
  exists(select 1 from public.invoices i where i.id = invoice_items.invoice_id and i.user_id = auth.uid())
);
create policy "items are manageable by owner" on public.invoice_items for all using (
  exists(select 1 from public.invoices i where i.id = invoice_items.invoice_id and i.user_id = auth.uid())
);
