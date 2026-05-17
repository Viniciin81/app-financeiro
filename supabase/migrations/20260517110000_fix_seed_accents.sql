-- =====================================================================
-- Fix: re-insere categorias globais com acentos corretos.
--
-- Por que: o seed original foi colado no SQL Editor com o clipboard do
-- PowerShell convertendo UTF-8 -> UTF-16/Latin-1, resultando em mojibake
-- ("AlimentaÃ§Ã£o" em vez de "Alimentação"). Usamos E'\uXXXX' — Postgres
-- decodifica server-side a partir dos code points, sem depender do
-- encoding do transporte.
--
-- Atualiza também os ícones para o vocabulário do `IconPicker` do app.
-- =====================================================================

delete from public.categories where user_id is null;

-- ---------- Despesas (17) ----------
insert into public.categories (user_id, name, type, icon, color) values
  (null, E'Alimentação',  'expense', 'utensils',        '#B65530'),
  (null, 'Mercado',                 'expense', 'shopping-cart',   '#5F8348'),
  (null, 'Delivery',                'expense', 'pizza',           '#D26F47'),
  (null, 'Transporte',              'expense', 'car',             '#82A268'),
  (null, 'Moradia',                 'expense', 'home',            '#6A311C'),
  (null, E'Saúde',             'expense', 'heart-pulse',     '#A8442C'),
  (null, 'Lazer',                   'expense', 'gamepad-2',       '#C9A227'),
  (null, E'Educação',     'expense', 'graduation-cap',  '#4B6939'),
  (null, E'Vestuário',         'expense', 'shirt',           '#DE9170'),
  (null, 'Assinaturas',             'expense', 'repeat',          '#739E72'),
  (null, 'Impostos',                'expense', 'receipt',         '#403B30'),
  (null, E'Serviços',          'expense', 'wrench',          '#7D7665'),
  (null, 'Beleza',                  'expense', 'sparkles',        '#E9B69E'),
  (null, 'Pets',                    'expense', 'paw-print',       '#8F4225'),
  (null, 'Presentes',               'expense', 'gift',            '#C6D7B8'),
  (null, 'Investimentos',           'expense', 'trending-up',     '#3A512D'),
  (null, 'Outros',                  'expense', 'circle-ellipsis', '#A39B89');

-- ---------- Receitas (5) ----------
insert into public.categories (user_id, name, type, icon, color) values
  (null, E'Salário',           'income',  'wallet',          '#5F8348'),
  (null, 'Freelance',               'income',  'briefcase',       '#82A268'),
  (null, 'Rendimentos',             'income',  'piggy-bank',      '#739E72'),
  (null, 'Reembolsos',              'income',  'rotate-ccw',      '#A4BD8F'),
  (null, 'Outros (entrada)',        'income',  'circle-plus',     '#C6D7B8');
