-- =====================================================================
-- app-financeiro — schema inicial
-- Baseado na seção 6 do briefing (docs/briefing.md).
--
-- Inclui:
--   * Extensions (pgcrypto para gen_random_uuid, citext, btree_gist)
--   * Tabelas: users_profile, accounts, categories, transactions,
--              categorization_rules, recurring_transactions,
--              budgets, goals, investments, investment_transactions,
--              notifications
--   * Triggers: auto-create profile on auth.users insert,
--              updated_at em todas as tabelas relevantes
--   * Indexes nas chaves estrangeiras e colunas de busca frequente
--   * Row Level Security em todas as tabelas (cada usuário só vê o
--     que é seu; categorias globais são legíveis por todos)
-- =====================================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ---------- Função helper: updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- =====================================================================
-- users_profile  (perfil estendido do usuário)
-- =====================================================================
create table public.users_profile (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  preferences  jsonb        not null default '{}'::jsonb, -- tema, dashboard layout, notif prefs
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

create trigger users_profile_set_updated_at
  before update on public.users_profile
  for each row execute function public.set_updated_at();

-- Trigger: ao criar usuário em auth.users, cria automaticamente o profile.
-- Mantém display_name e avatar a partir do raw_user_meta_data se disponível.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users_profile (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- accounts  (contas: corrente, poupança, cartão, investimento, cash)
-- =====================================================================
create type public.account_type as enum (
  'checking',     -- conta corrente
  'savings',      -- poupança
  'credit_card',  -- cartão de crédito
  'investment',   -- carteira de investimentos
  'cash'          -- dinheiro / carteira física
);

create table public.accounts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users_profile(id) on delete cascade,
  name            text not null,
  type            public.account_type not null,
  bank            text,                       -- 'itau', 'nubank', 'santander', ...
  initial_balance numeric(18,2) not null default 0,
  credit_limit    numeric(18,2),              -- somente para credit_card
  closing_day     int check (closing_day between 1 and 31),
  due_day         int check (due_day between 1 and 31),
  color           text,
  icon            text,
  archived        boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index accounts_user_id_idx on public.accounts(user_id);
create index accounts_user_archived_idx on public.accounts(user_id, archived);

create trigger accounts_set_updated_at
  before update on public.accounts
  for each row execute function public.set_updated_at();

-- =====================================================================
-- categories  (categorias com hierarquia opcional)
-- user_id IS NULL  ->  categoria global (seed)
-- =====================================================================
create type public.category_kind as enum ('expense', 'income');

create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.users_profile(id) on delete cascade,
  parent_id  uuid references public.categories(id) on delete set null,
  name       text not null,
  type       public.category_kind not null,
  icon       text,
  color      text,
  archived   boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_user_id_idx on public.categories(user_id);
create index categories_parent_id_idx on public.categories(parent_id);
create unique index categories_user_name_unique
  on public.categories(coalesce(user_id, '00000000-0000-0000-0000-000000000000'::uuid), name, type)
  where archived = false;

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- =====================================================================
-- recurring_transactions  (templates de transações recorrentes)
-- =====================================================================
create type public.recurrence_frequency as enum (
  'weekly', 'biweekly', 'monthly', 'yearly', 'custom'
);

create table public.recurring_transactions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users_profile(id) on delete cascade,
  account_id      uuid not null references public.accounts(id) on delete cascade,
  category_id     uuid references public.categories(id) on delete set null,
  amount          numeric(18,2) not null,
  description     text,
  frequency       public.recurrence_frequency not null,
  start_date      date not null,
  end_date        date,
  next_occurrence date,
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index recurring_user_idx on public.recurring_transactions(user_id);
create index recurring_next_idx on public.recurring_transactions(next_occurrence) where active = true;

create trigger recurring_set_updated_at
  before update on public.recurring_transactions
  for each row execute function public.set_updated_at();

-- =====================================================================
-- transactions  (movimentações)
-- amount: negativo = saída, positivo = entrada
-- =====================================================================
create type public.transaction_source as enum (
  'manual', 'ofx_import', 'csv_import', 'pluggy'
);

create table public.transactions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.users_profile(id) on delete cascade,
  account_id            uuid not null references public.accounts(id) on delete cascade,
  category_id           uuid references public.categories(id) on delete set null,
  amount                numeric(18,2) not null,
  date                  date not null,
  description           text,
  notes                 text,
  merchant              text,
  cnpj                  text,
  source                public.transaction_source not null default 'manual',
  external_id           text,
  recurring_id          uuid references public.recurring_transactions(id) on delete set null,
  parent_transaction_id uuid references public.transactions(id) on delete cascade,
  is_split              boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  -- dedupe na importação: mesmo external_id por usuário só pode existir uma vez
  constraint transactions_user_external_unique unique (user_id, external_id)
);

create index transactions_user_date_idx on public.transactions(user_id, date desc);
create index transactions_account_idx on public.transactions(account_id);
create index transactions_category_idx on public.transactions(category_id);
create index transactions_parent_idx on public.transactions(parent_transaction_id) where parent_transaction_id is not null;

create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- =====================================================================
-- categorization_rules  (regras personalizadas do usuário)
-- =====================================================================
create table public.categorization_rules (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users_profile(id) on delete cascade,
  pattern     text not null,   -- ILIKE pattern (ex: 'IFOOD%')
  category_id uuid not null references public.categories(id) on delete cascade,
  priority    int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index categorization_rules_user_idx on public.categorization_rules(user_id, priority desc);

create trigger categorization_rules_set_updated_at
  before update on public.categorization_rules
  for each row execute function public.set_updated_at();

-- =====================================================================
-- budgets  (orçamentos por categoria ou globais)
-- =====================================================================
create type public.budget_period as enum ('monthly', 'yearly');

create table public.budgets (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users_profile(id) on delete cascade,
  category_id      uuid references public.categories(id) on delete cascade, -- null = orçamento global
  amount           numeric(18,2) not null check (amount > 0),
  period           public.budget_period not null default 'monthly',
  alert_thresholds int[] not null default '{80, 100}',
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index budgets_user_idx on public.budgets(user_id);
create index budgets_category_idx on public.budgets(category_id);

create trigger budgets_set_updated_at
  before update on public.budgets
  for each row execute function public.set_updated_at();

-- =====================================================================
-- goals  (metas de economia ou redução)
-- =====================================================================
create type public.goal_kind   as enum ('savings', 'reduction');
create type public.goal_status as enum ('active', 'achieved', 'failed', 'archived');

create table public.goals (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users_profile(id) on delete cascade,
  type               public.goal_kind not null,
  name               text not null,
  target_amount      numeric(18,2),
  target_percentage  numeric(5,2),  -- ex: 20.00 = 20%
  category_id        uuid references public.categories(id) on delete set null,
  deadline           date,
  linked_account_id  uuid references public.accounts(id) on delete set null,
  status             public.goal_status not null default 'active',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  check (
    (type = 'savings'   and target_amount     is not null) or
    (type = 'reduction' and target_percentage is not null and category_id is not null)
  )
);

create index goals_user_status_idx on public.goals(user_id, status);

create trigger goals_set_updated_at
  before update on public.goals
  for each row execute function public.set_updated_at();

-- =====================================================================
-- investments  (ativos da carteira)
-- =====================================================================
create type public.investment_kind as enum (
  'stock', 'fii', 'treasury', 'cdb', 'fund', 'crypto', 'other'
);

create table public.investments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users_profile(id) on delete cascade,
  account_id        uuid not null references public.accounts(id) on delete cascade,
  ticker            text,
  type              public.investment_kind not null,
  name              text not null,
  quantity          numeric(20,8),
  avg_price         numeric(18,4),
  current_price     numeric(18,4),
  last_price_update timestamptz,
  archived          boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index investments_user_idx on public.investments(user_id);
create index investments_ticker_idx on public.investments(ticker) where ticker is not null;

create trigger investments_set_updated_at
  before update on public.investments
  for each row execute function public.set_updated_at();

-- =====================================================================
-- investment_transactions  (aportes, resgates, dividendos)
-- =====================================================================
create type public.investment_tx_kind as enum ('buy', 'sell', 'dividend');

create table public.investment_transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users_profile(id) on delete cascade,
  investment_id uuid not null references public.investments(id) on delete cascade,
  type          public.investment_tx_kind not null,
  quantity      numeric(20,8),
  price         numeric(18,4),
  amount        numeric(18,2) not null,
  date          date not null,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index investment_tx_user_date_idx on public.investment_transactions(user_id, date desc);
create index investment_tx_investment_idx on public.investment_transactions(investment_id);

create trigger investment_tx_set_updated_at
  before update on public.investment_transactions
  for each row execute function public.set_updated_at();

-- =====================================================================
-- notifications
-- =====================================================================
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users_profile(id) on delete cascade,
  type       text not null,         -- 'budget_alert', 'import_reminder', 'monthly_summary', ...
  title      text not null,
  body       text,
  data       jsonb not null default '{}'::jsonb,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_unread_idx
  on public.notifications(user_id, created_at desc) where read = false;

-- =====================================================================
-- Row Level Security
-- =====================================================================

-- users_profile
alter table public.users_profile enable row level security;
create policy "Profile is viewable by owner"
  on public.users_profile for select using (auth.uid() = id);
create policy "Profile is updatable by owner"
  on public.users_profile for update using (auth.uid() = id);
-- INSERT é feito pelo trigger on_auth_user_created (security definer); não precisa de policy.
-- DELETE cascateia via auth.users delete.

-- accounts
alter table public.accounts enable row level security;
create policy "Owners can read accounts"   on public.accounts for select using (auth.uid() = user_id);
create policy "Owners can insert accounts" on public.accounts for insert with check (auth.uid() = user_id);
create policy "Owners can update accounts" on public.accounts for update using (auth.uid() = user_id);
create policy "Owners can delete accounts" on public.accounts for delete using (auth.uid() = user_id);

-- categories  (globais legíveis por qualquer usuário autenticado)
alter table public.categories enable row level security;
create policy "Anyone authed can read global or own categories"
  on public.categories for select
  using (user_id is null or auth.uid() = user_id);
create policy "Owners can insert own categories"
  on public.categories for insert with check (auth.uid() = user_id);
create policy "Owners can update own categories"
  on public.categories for update using (auth.uid() = user_id);
create policy "Owners can delete own categories"
  on public.categories for delete using (auth.uid() = user_id);

-- transactions
alter table public.transactions enable row level security;
create policy "Owners can read transactions"   on public.transactions for select using (auth.uid() = user_id);
create policy "Owners can insert transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Owners can update transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Owners can delete transactions" on public.transactions for delete using (auth.uid() = user_id);

-- categorization_rules
alter table public.categorization_rules enable row level security;
create policy "Owners can read rules"   on public.categorization_rules for select using (auth.uid() = user_id);
create policy "Owners can insert rules" on public.categorization_rules for insert with check (auth.uid() = user_id);
create policy "Owners can update rules" on public.categorization_rules for update using (auth.uid() = user_id);
create policy "Owners can delete rules" on public.categorization_rules for delete using (auth.uid() = user_id);

-- recurring_transactions
alter table public.recurring_transactions enable row level security;
create policy "Owners can read recurring"   on public.recurring_transactions for select using (auth.uid() = user_id);
create policy "Owners can insert recurring" on public.recurring_transactions for insert with check (auth.uid() = user_id);
create policy "Owners can update recurring" on public.recurring_transactions for update using (auth.uid() = user_id);
create policy "Owners can delete recurring" on public.recurring_transactions for delete using (auth.uid() = user_id);

-- budgets
alter table public.budgets enable row level security;
create policy "Owners can read budgets"   on public.budgets for select using (auth.uid() = user_id);
create policy "Owners can insert budgets" on public.budgets for insert with check (auth.uid() = user_id);
create policy "Owners can update budgets" on public.budgets for update using (auth.uid() = user_id);
create policy "Owners can delete budgets" on public.budgets for delete using (auth.uid() = user_id);

-- goals
alter table public.goals enable row level security;
create policy "Owners can read goals"   on public.goals for select using (auth.uid() = user_id);
create policy "Owners can insert goals" on public.goals for insert with check (auth.uid() = user_id);
create policy "Owners can update goals" on public.goals for update using (auth.uid() = user_id);
create policy "Owners can delete goals" on public.goals for delete using (auth.uid() = user_id);

-- investments
alter table public.investments enable row level security;
create policy "Owners can read investments"   on public.investments for select using (auth.uid() = user_id);
create policy "Owners can insert investments" on public.investments for insert with check (auth.uid() = user_id);
create policy "Owners can update investments" on public.investments for update using (auth.uid() = user_id);
create policy "Owners can delete investments" on public.investments for delete using (auth.uid() = user_id);

-- investment_transactions
alter table public.investment_transactions enable row level security;
create policy "Owners can read inv tx"   on public.investment_transactions for select using (auth.uid() = user_id);
create policy "Owners can insert inv tx" on public.investment_transactions for insert with check (auth.uid() = user_id);
create policy "Owners can update inv tx" on public.investment_transactions for update using (auth.uid() = user_id);
create policy "Owners can delete inv tx" on public.investment_transactions for delete using (auth.uid() = user_id);

-- notifications
alter table public.notifications enable row level security;
create policy "Owners can read notifications"   on public.notifications for select using (auth.uid() = user_id);
create policy "Owners can update notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Owners can delete notifications" on public.notifications for delete using (auth.uid() = user_id);
-- INSERT em notifications é feito por Edge Functions / triggers internos com service_role.
