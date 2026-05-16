# 📋 Briefing Técnico: App de Controle Financeiro

> Documento de especificação completa do projeto. Deve ser a fonte da verdade para o desenvolvimento no Claude Code.

---

## 1. Visão Geral

Aplicativo mobile (iOS + Android) de controle financeiro pessoal com categorização automática de transações, dashboards analíticos, metas/orçamentos e gestão de investimentos. Inspirado no Pierre AI, com arquitetura preparada para evoluir de uso pessoal/beta para um SaaS multi-tenant.

**Objetivo de curto prazo:** Beta funcional para uso próprio e teste com amigos.
**Objetivo de médio prazo:** Refinar produto e definir modelo de monetização (SaaS, freemium, etc.).
**Sem prazo definido — foco em qualidade.**

---

## 2. Stack Técnica

### Frontend (Mobile)
- **Framework:** React Native + Expo (managed workflow)
- **Linguagem:** TypeScript
- **Estilização:** NativeWind (Tailwind para RN) ou Tamagui
- **Navegação:** Expo Router (file-based routing)
- **Estado global:** Zustand (leve) + TanStack Query (server state)
- **Formulários:** React Hook Form + Zod (validação)
- **Gráficos:** Victory Native ou React Native Skia + D3
- **Animações:** React Native Reanimated 3 + Moti
- **Ícones:** Lucide React Native

### Backend
- **Plataforma:** Supabase
  - PostgreSQL (banco principal)
  - Auth (OAuth Google + Apple nativo)
  - Row Level Security (isolamento multi-tenant)
  - Storage (arquivos OFX/CSV importados)
  - Edge Functions (lógica server-side em Deno/TypeScript)
  - Realtime (atualizações em tempo real, opcional)
- **Notificações push:** Expo Notifications

### APIs externas
- **Cotações de investimentos:** BRAPI (gratuita, B3 + criptos)
- **Pluggy (futuro):** Open Finance via agregador licenciado (interface abstrata pronta no código)
- **LLM (futuro):** OpenAI/Anthropic para chat conversacional

### DevOps & Distribuição
- **Build/Deploy:** Expo EAS Build + EAS Submit
- **Distribuição beta:**
  - iOS: TestFlight
  - Android: Google Play Internal Testing ou APK direto
- **Versionamento:** Git + GitHub
- **CI/CD:** GitHub Actions + EAS

---

## 3. Arquitetura

### Multi-tenant desde o início
- Todos os dados isolados por `user_id`
- Row Level Security no Supabase garante que cada usuário só vê os próprios dados
- Estrutura preparada para futuros recursos compartilhados (família/casal)

### Importação de extratos (estratégia híbrida)
- **Fase beta (atual):** Importação manual de arquivos OFX/CSV
  - Parser robusto para formato OFX (padrão dos bancos brasileiros)
  - Parsers específicos para CSV de: **Itaú, Nubank, Santander**
  - Parser genérico para CSV de outros bancos
- **Fase futura:** Integração com Pluggy (Open Finance)
  - Código já estruturado com interface `BankConnector` abstrata
  - Permite plugar Pluggy sem refatorar o resto do app

### Categorização automática (sem necessidade de correção manual)
Estratégia em camadas, executada em ordem:

1. **Base de regras pré-treinada:** Mapeamento de estabelecimentos comuns no Brasil
   - Ex: `IFOOD*`, `RAPPI*` → Alimentação/Delivery
   - Ex: `UBER*`, `99*`, `CABIFY*` → Transporte
   - Ex: `NETFLIX`, `SPOTIFY`, `DISNEY+` → Assinaturas
   - Lista inicial com ~500-1000 entradas, expansível
2. **Enriquecimento por CNPJ:** Quando disponível no OFX, consulta API pública da Receita Federal (BrasilAPI) para obter ramo de atividade
3. **Aprendizado por usuário:** Se o usuário corrigir uma categoria, o app cria uma regra personalizada e nunca mais erra para aquele estabelecimento
4. **Fallback (futuro):** LLM categoriza casos ambíguos

---

## 4. Funcionalidades Detalhadas

### 4.1 Autenticação
- **Login:** OAuth com Google e Apple (nativo via Supabase Auth)
- **Sem cadastro tradicional** (sem email/senha) — reduz fricção
- **Logout** + opção de deletar conta

### 4.2 Contas e Tipos de Movimentação
- **Tipos de conta:**
  - Conta corrente
  - Conta poupança
  - Cartão de crédito (rastreado separadamente)
  - Carteira de investimentos
  - Dinheiro (cash)
- **Tipos de transação:**
  - Despesa (saída)
  - Receita (entrada)
  - Transferência entre contas
  - Aporte/resgate de investimento

### 4.3 Categorias
- **Categorias padrão pré-cadastradas** (~15-20 principais):
  - Alimentação, Transporte, Moradia, Saúde, Lazer, Educação, Vestuário, Mercado, Delivery, Assinaturas, Impostos, Serviços, Beleza, Pets, Presentes, Investimentos, Salário, Outros
- **Subcategorias** opcionais (ex: Alimentação > Restaurante, Mercado, Delivery)
- **Categorias customizadas:** usuário pode criar/editar/arquivar
- Cada categoria tem: nome, ícone, cor, tipo (despesa/receita)

### 4.4 Transações
- **Importação automática** via OFX/CSV (lembrete semanal pra fazer upload)
- **Adição manual:** caso dinheiro/PIX esquecido
- **Edição:** valor, data, categoria, conta, descrição
- **Exclusão:** com confirmação
- **Divisão (split):** uma transação em várias categorias
  - Ex: compra de R$ 300 no mercado → R$ 200 Mercado + R$ 100 Higiene
- **Recorrência:** marcar transações como recorrentes
  - Cria automaticamente cópias futuras (Netflix mensal, aluguel, etc.)
  - Configurável: semanal, quinzenal, mensal, anual, personalizado
- **Notas/comentários** em transações
- **Detecção de duplicatas** ao importar

### 4.5 Dashboard (tela principal)
**Customizável (arrastar/reorganizar cards)**, com os seguintes blocos disponíveis:

- **Saldo total** (soma de todas as contas)
- **Gastos do mês atual** vs orçamento total
- **Gráfico de gastos por categoria** (donut/pie)
- **Comparação com mês anterior** (% maior/menor por categoria)
- **Tendências** (gráfico de linha dos últimos 6 meses)
- **Previsão de fim de mês** (baseado no ritmo atual de gastos)
- **Alertas ativos de orçamento** (categorias que passaram de 80%)
- **Gastos atípicos** (anomalias detectadas)
- **Próximas contas a vencer** (recorrentes nos próximos 7 dias)
- **Maiores gastos do mês** (top 5)
- **Análises detalhadas:**
  - Gasto por dia da semana
  - Gasto por estabelecimento
  - Evolução de patrimônio líquido
  - Cash flow (entradas vs saídas)

### 4.6 Orçamentos
- **Orçamento mensal fixo por categoria** (ex: R$ 800 em Alimentação)
- **Orçamento global** (limite total de gastos no mês)
- **Alertas configuráveis:** quando atingir 50%, 80%, 100%, 120%
- **Visualização:** barra de progresso por categoria + cor (verde/amarelo/vermelho)
- **Renovação automática** mensal
- **Histórico:** ver orçamentos de meses passados e taxa de sucesso

### 4.7 Metas
- **Metas de economia:** "Guardar R$ 5.000 para viagem até dez/2026"
  - Valor alvo + data limite
  - Progresso atual (vinculado a conta poupança/investimento)
  - Cálculo de quanto precisa guardar por mês
- **Metas de redução:** "Gastar 20% menos em delivery nos próximos 3 meses"
  - Categoria + percentual + período
  - Acompanhamento mês a mês

### 4.8 Cartão de Crédito (rastreado separadamente)
- Cadastro do cartão: bandeira, banco, limite, dia de fechamento, dia de vencimento
- Faturas mensais separadas (fechadas e em aberto)
- Compras parceladas: ver parcelas futuras e total comprometido
- Importação de fatura via OFX/CSV
- Cálculo de melhor data de compra (para próxima fatura)

### 4.9 Investimentos
- **Cadastro de ativos:**
  - Ações (B3) e FIIs
  - Tesouro Direto
  - CDB/LCI/LCA (manual)
  - Fundos (manual)
  - Criptomoedas
- **Aporte/resgate:** registra movimentações
- **Cotações automáticas:** via BRAPI (atualização periódica)
- **Acompanhamento:**
  - Valor atual de cada ativo
  - Rentabilidade (R$ e %)
  - Comparação com CDI/IPCA (benchmarks)
  - Composição da carteira (gráfico)
  - Evolução do patrimônio

### 4.10 Notificações
- **Push notifications** via Expo Notifications:
  - Alertas de orçamento atingido
  - Lembrete semanal para importar extratos
  - Resumo mensal automático (dia 1 do mês)
  - Avisos de gastos atípicos (3x acima do normal)
  - Lembretes de contas recorrentes próximas do vencimento
- **Configurável por tipo** (usuário pode desativar individualmente)

### 4.11 Configurações
- **Perfil:** nome, foto, email (do Google/Apple)
- **Tema:** claro / escuro / automático (segue o sistema)
- **Notificações:** ativar/desativar por tipo
- **Categorias:** gerenciar (adicionar, editar, arquivar)
- **Contas:** gerenciar
- **Backup automático:** os dados já ficam no Supabase, mas oferece exportação manual em JSON
- **Sobre:** versão, termos, política de privacidade
- **Deletar conta** (LGPD)

### 4.12 Onboarding (primeiro acesso)
- Tutorial guiado em 4-5 telas:
  1. Boas-vindas + proposta de valor
  2. Cadastrar primeira conta (corrente ou cartão)
  3. Importar primeiro extrato (ou pular)
  4. Conhecer categorias padrão
  5. Definir primeiro orçamento (opcional)
- Possível pular a qualquer momento
- Acessível depois em Configurações > Tutorial

---

## 5. Identidade Visual

### Vibe geral
- **Acolhedor e amigável** (referência: Pierre AI, Olivia)
- Tipografia moderna mas com personalidade (não corporativa fria)
- Cores quentes e suaves, mas com bom contraste
- Microcopy humano: "Você economizou R$ 240 esse mês 🎉" em vez de "Economia mensal: 240,00"

### Modos
- **Claro:** background creme/off-white, textos em cinza-escuro
- **Escuro:** background quase-preto profundo, textos em branco-suave
- **Automático:** segue o sistema operacional

### Paleta sugerida (a refinar)
- **Primária:** verde-musgo ou âmbar (acolhedor, não óbvio como verde-dinheiro)
- **Secundária:** terracota / coral suave (toque de calor)
- **Neutros:** off-white, cinza-quente, preto-fumaça
- **Semânticas:** verde-sálvia (positivo), vermelho-tijolo (negativo), amarelo-mostarda (alerta)

### Tipografia sugerida (a refinar)
- **Display:** Fraunces, Söhne, ou similar (caráter editorial)
- **Body:** Inter, Geist, ou similar (legibilidade)

---

## 6. Estrutura do Banco de Dados (Supabase/PostgreSQL)

### Tabelas principais

```sql
-- Usuários (gerenciada pelo Supabase Auth, mas com perfil estendido)
users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users,
  display_name text,
  avatar_url text,
  preferences jsonb, -- tema, notificações, dashboard layout
  created_at timestamptz DEFAULT now()
)

-- Contas (corrente, poupança, cartão, investimento, cash)
accounts (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profile,
  name text NOT NULL,
  type text NOT NULL, -- 'checking', 'savings', 'credit_card', 'investment', 'cash'
  bank text, -- 'itau', 'nubank', 'santander', etc.
  initial_balance numeric DEFAULT 0,
  credit_limit numeric, -- só para cartão
  closing_day int, -- só para cartão
  due_day int, -- só para cartão
  color text,
  icon text,
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
)

-- Categorias
categories (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profile, -- null = categoria global padrão
  name text NOT NULL,
  parent_id uuid REFERENCES categories, -- subcategorias
  type text NOT NULL, -- 'expense', 'income'
  icon text,
  color text,
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
)

-- Transações
transactions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profile,
  account_id uuid REFERENCES accounts,
  category_id uuid REFERENCES categories,
  amount numeric NOT NULL, -- negativo = saída, positivo = entrada
  date date NOT NULL,
  description text,
  notes text,
  merchant text, -- estabelecimento limpo
  cnpj text,
  source text, -- 'manual', 'ofx_import', 'csv_import', 'pluggy'
  external_id text, -- pra dedupe na importação
  recurring_id uuid REFERENCES recurring_transactions,
  parent_transaction_id uuid REFERENCES transactions, -- pra splits
  is_split boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, external_id) -- evita duplicatas
)

-- Regras de categorização do usuário (aprendizado)
categorization_rules (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profile,
  pattern text NOT NULL, -- ex: 'IFOOD%'
  category_id uuid REFERENCES categories,
  priority int DEFAULT 0,
  created_at timestamptz DEFAULT now()
)

-- Transações recorrentes
recurring_transactions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profile,
  account_id uuid REFERENCES accounts,
  category_id uuid REFERENCES categories,
  amount numeric NOT NULL,
  description text,
  frequency text NOT NULL, -- 'weekly', 'biweekly', 'monthly', 'yearly', 'custom'
  start_date date NOT NULL,
  end_date date,
  next_occurrence date,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
)

-- Orçamentos
budgets (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profile,
  category_id uuid REFERENCES categories, -- null = orçamento global
  amount numeric NOT NULL,
  period text DEFAULT 'monthly', -- 'monthly', 'yearly'
  alert_thresholds int[] DEFAULT '{80, 100}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
)

-- Metas
goals (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profile,
  type text NOT NULL, -- 'savings', 'reduction'
  name text NOT NULL,
  target_amount numeric,
  target_percentage numeric,
  category_id uuid REFERENCES categories,
  deadline date,
  linked_account_id uuid REFERENCES accounts,
  status text DEFAULT 'active', -- 'active', 'achieved', 'failed', 'archived'
  created_at timestamptz DEFAULT now()
)

-- Investimentos
investments (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profile,
  account_id uuid REFERENCES accounts,
  ticker text, -- ex: 'PETR4', 'HGLG11', 'BTC'
  type text NOT NULL, -- 'stock', 'fii', 'treasury', 'cdb', 'fund', 'crypto'
  name text NOT NULL,
  quantity numeric,
  avg_price numeric,
  current_price numeric, -- atualizado via BRAPI
  last_price_update timestamptz,
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
)

investment_transactions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profile,
  investment_id uuid REFERENCES investments,
  type text NOT NULL, -- 'buy', 'sell', 'dividend'
  quantity numeric,
  price numeric,
  amount numeric NOT NULL,
  date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
)

-- Notificações
notifications (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users_profile,
  type text NOT NULL, -- 'budget_alert', 'import_reminder', etc.
  title text NOT NULL,
  body text,
  read boolean DEFAULT false,
  data jsonb,
  created_at timestamptz DEFAULT now()
)
```

### Row Level Security
- Todas as tabelas com `user_id` terão policies que limitam `SELECT/INSERT/UPDATE/DELETE` apenas ao próprio usuário
- Categorias globais (user_id = null) são `SELECT` para todos, mas só admin pode modificar

---

## 7. Estrutura de Pastas do Projeto

```
app-financeiro/
├── apps/
│   └── mobile/                          # App React Native (Expo)
│       ├── app/                          # Expo Router (rotas)
│       │   ├── (auth)/                   # Telas não-autenticadas
│       │   │   ├── login.tsx
│       │   │   └── onboarding.tsx
│       │   ├── (tabs)/                   # Tabs principais
│       │   │   ├── index.tsx             # Dashboard
│       │   │   ├── transactions.tsx
│       │   │   ├── budgets.tsx
│       │   │   ├── investments.tsx
│       │   │   └── settings.tsx
│       │   ├── transaction/[id].tsx
│       │   ├── account/[id].tsx
│       │   ├── import.tsx
│       │   ├── chat.tsx                  # Chat IA (futuro)
│       │   └── _layout.tsx
│       ├── components/
│       │   ├── ui/                       # Componentes base (Button, Input, Card...)
│       │   ├── transactions/
│       │   ├── dashboard/
│       │   ├── charts/
│       │   └── onboarding/
│       ├── lib/
│       │   ├── supabase.ts
│       │   ├── importers/                # Parsers OFX/CSV
│       │   │   ├── ofx.ts
│       │   │   ├── csv-itau.ts
│       │   │   ├── csv-nubank.ts
│       │   │   ├── csv-santander.ts
│       │   │   └── csv-generic.ts
│       │   ├── categorization/
│       │   │   ├── rules.ts              # Regras pré-treinadas
│       │   │   ├── engine.ts             # Motor de categorização
│       │   │   └── merchants.ts          # Base de estabelecimentos
│       │   ├── bank-connector/           # Interface abstrata
│       │   │   ├── index.ts
│       │   │   ├── manual.ts             # Implementação manual (OFX/CSV)
│       │   │   └── pluggy.ts             # Implementação futura
│       │   ├── brapi.ts                  # API de cotações
│       │   └── utils/
│       ├── stores/                       # Zustand stores
│       ├── hooks/                        # Custom hooks (TanStack Query)
│       ├── types/                        # TypeScript types
│       ├── constants/
│       │   ├── colors.ts
│       │   ├── default-categories.ts
│       │   └── theme.ts
│       ├── assets/
│       ├── app.json
│       ├── eas.json
│       ├── package.json
│       └── tsconfig.json
├── packages/                             # Código compartilhado (futuro web app)
│   ├── shared-types/
│   └── shared-utils/
├── supabase/
│   ├── migrations/                       # SQL migrations
│   ├── functions/                        # Edge Functions
│   └── seed.sql                          # Categorias padrão, estabelecimentos
├── docs/
│   ├── briefing.md                       # Este documento
│   ├── api.md
│   └── deployment.md
├── .github/
│   └── workflows/
├── package.json
├── pnpm-workspace.yaml                   # Monorepo
└── README.md
```

---

## 8. Roadmap Sugerido de Desenvolvimento

### Fase 1: Fundação (Semanas 1-2)
- [ ] Setup do monorepo + Expo + TypeScript
- [ ] Setup do Supabase + schema inicial + RLS
- [ ] Autenticação Google + Apple
- [ ] Design system base (cores, tipografia, componentes UI)
- [ ] Navegação principal (tabs)

### Fase 2: Core de Transações (Semanas 3-4)
- [ ] CRUD de contas
- [ ] CRUD de categorias (com padrões pré-cadastradas)
- [ ] CRUD de transações (criar/editar/excluir manual)
- [ ] Listagem de transações com filtros
- [ ] Split de transações
- [ ] Notas em transações

### Fase 3: Importação (Semanas 5-6)
- [ ] Parser OFX
- [ ] Parser CSV específico: Itaú, Nubank, Santander, genérico
- [ ] Detecção de duplicatas
- [ ] Tela de revisão pré-importação
- [ ] Sistema de regras de categorização (base pré-treinada)
- [ ] Aprendizado: criar regras a partir de correções do usuário

### Fase 4: Dashboard & Análises (Semanas 7-8)
- [ ] Dashboard principal com cards básicos
- [ ] Gráficos: pizza por categoria, linha de tendência
- [ ] Comparação mês a mês
- [ ] Previsão de fim de mês
- [ ] Customização de dashboard (drag & drop)
- [ ] Tela de análises detalhadas

### Fase 5: Orçamentos & Metas (Semanas 9-10)
- [ ] CRUD de orçamentos por categoria
- [ ] Cálculo de progresso e alertas
- [ ] Metas de economia (com vinculação a conta)
- [ ] Metas de redução

### Fase 6: Cartão de Crédito (Semana 11)
- [ ] Conta tipo cartão de crédito
- [ ] Fechamento e vencimento de fatura
- [ ] Compras parceladas
- [ ] Importação de fatura

### Fase 7: Recorrências (Semana 12)
- [ ] CRUD de transações recorrentes
- [ ] Geração automática de próximas ocorrências
- [ ] Detecção automática de recorrências em transações importadas

### Fase 8: Investimentos (Semanas 13-14)
- [ ] Integração com BRAPI
- [ ] CRUD de investimentos
- [ ] Aporte/resgate
- [ ] Rentabilidade e benchmarks
- [ ] Composição da carteira

### Fase 9: Notificações (Semana 15)
- [ ] Setup Expo Notifications
- [ ] Edge Function de envio de notificações
- [ ] Cronjobs para resumos mensais, lembretes semanais
- [ ] Detecção de gastos atípicos

### Fase 10: Onboarding & Polimento (Semana 16)
- [ ] Tutorial guiado
- [ ] Modo claro/escuro
- [ ] Configurações
- [ ] Export de dados
- [ ] Deletar conta (LGPD)
- [ ] Polimento de UX, animações

### Fase 11: Beta (Semanas 17+)
- [ ] Build com EAS
- [ ] TestFlight (iOS)
- [ ] Google Play Internal Testing
- [ ] Convite para amigos
- [ ] Coleta de feedback (canal de suporte: WhatsApp/Discord?)
- [ ] Iteração

### Fase 12: Futuro (pós-beta)
- [ ] Integração Pluggy (Open Finance)
- [ ] Chat com IA (LLM)
- [ ] Compartilhamento (família/casal)
- [ ] Web app (mesma codebase via React Native Web ou Next.js)
- [ ] Modelo de monetização

---

## 9. Considerações de Segurança

- **Dados sensíveis** (transações financeiras) sempre criptografados em trânsito (HTTPS) e em repouso (Supabase já faz)
- **Row Level Security** rigoroso no Postgres
- **Tokens OAuth** nunca expostos no cliente — apenas tokens de sessão do Supabase
- **Arquivos OFX/CSV** importados são processados e descartados (não armazenados a menos que o usuário queira)
- **LGPD:** botão de export de todos os dados + botão de deletar conta com remoção real (cascade)
- **Sem senhas** (OAuth only) reduz vetor de ataque
- **Sem dados de cartão** armazenados (números, CVV, etc.)

---

## 10. Custos Estimados (Beta)

| Item | Custo mensal |
|------|--------------|
| Supabase (Free tier) | R$ 0 |
| Expo (Free) | R$ 0 |
| BRAPI (Free) | R$ 0 |
| BrasilAPI (Free) | R$ 0 |
| Apple Developer (anual) | ~R$ 50/mês (US$ 99/ano) |
| Google Play Developer (única) | ~R$ 130 uma vez |
| Domínio (opcional) | ~R$ 4/mês |
| **TOTAL** | **~R$ 55/mês** |

Custos só sobem quando: ultrapassar free tier do Supabase (~500 usuários ativos), adicionar IA (LLM), adicionar Pluggy.

---

## 11. Como Levar para o Claude Code

1. Salvar este documento como `docs/briefing.md` no repositório
2. Iniciar Claude Code no diretório do projeto
3. Pedir: *"Leia o briefing em docs/briefing.md e me ajude a iniciar a Fase 1 do roadmap"*
4. Claude Code vai:
   - Criar a estrutura de pastas
   - Configurar Expo + TypeScript + dependências
   - Configurar Supabase
   - Implementar progressivamente cada fase

### Prompt sugerido para abrir o projeto no Claude Code:

```
Olá! Vou desenvolver um app de controle financeiro mobile com você.
A especificação completa está em docs/briefing.md — leia esse arquivo primeiro.

Vamos começar pela Fase 1 do roadmap (Fundação):
1. Setup do monorepo com pnpm workspaces
2. App mobile com Expo + TypeScript + Expo Router
3. Setup do Supabase local + schema inicial
4. Autenticação OAuth Google/Apple
5. Design system base

Por favor, me explique cada passo conforme avança e me peça confirmação
antes de instalar dependências grandes ou tomar decisões arquiteturais
importantes. Trabalho colaborativo.
```

---

## 12. Decisões Pendentes (a definir depois)

- [ ] Nome do app
- [ ] Logo / identidade visual final
- [ ] Modelo de monetização (após beta)
- [ ] Domínio
- [ ] Política de privacidade e termos de uso (consultar advogado antes do beta público)
- [ ] Canal de suporte/feedback durante o beta

---

*Documento gerado em colaboração com Claude. Última atualização: 16 de maio de 2026.*
