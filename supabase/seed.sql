-- =====================================================================
-- app-financeiro — dados iniciais
--
-- Roda automaticamente após `supabase db reset` no ambiente local.
-- Para popular em produção (cloud), rode manualmente uma vez no SQL Editor.
--
-- Categorias globais (user_id IS NULL): visíveis a todos os usuários,
-- editáveis somente por admin (via service_role).
-- =====================================================================

-- Limpa categorias globais antes (idempotência em ambiente local)
delete from public.categories where user_id is null;

-- ---------- Despesas ----------
insert into public.categories (user_id, name, type, icon, color) values
  (null, 'Alimentação',  'expense', 'utensils',       '#B65530'),
  (null, 'Mercado',      'expense', 'shopping-cart',  '#5F8348'),
  (null, 'Delivery',     'expense', 'pizza',          '#D26F47'),
  (null, 'Transporte',   'expense', 'car',            '#82A268'),
  (null, 'Moradia',      'expense', 'home',           '#6A311C'),
  (null, 'Saúde',        'expense', 'heart-pulse',    '#A8442C'),
  (null, 'Lazer',        'expense', 'gamepad-2',      '#C9A227'),
  (null, 'Educação',     'expense', 'graduation-cap', '#4B6939'),
  (null, 'Vestuário',    'expense', 'shirt',          '#DE9170'),
  (null, 'Assinaturas',  'expense', 'repeat',         '#739E72'),
  (null, 'Impostos',     'expense', 'receipt',        '#403B30'),
  (null, 'Serviços',     'expense', 'wrench',         '#7D7665'),
  (null, 'Beleza',       'expense', 'sparkles',       '#E9B69E'),
  (null, 'Pets',         'expense', 'paw-print',      '#8F4225'),
  (null, 'Presentes',    'expense', 'gift',           '#C6D7B8'),
  (null, 'Investimentos','expense', 'trending-up',    '#3A512D'),
  (null, 'Outros',       'expense', 'circle-ellipsis','#A39B89');

-- ---------- Receitas ----------
insert into public.categories (user_id, name, type, icon, color) values
  (null, 'Salário',         'income', 'wallet',        '#5F8348'),
  (null, 'Freelance',       'income', 'briefcase',     '#82A268'),
  (null, 'Rendimentos',     'income', 'piggy-bank',    '#739E72'),
  (null, 'Reembolsos',      'income', 'rotate-ccw',    '#A4BD8F'),
  (null, 'Outros (entrada)','income', 'circle-plus',   '#C6D7B8');
