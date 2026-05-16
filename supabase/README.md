# Supabase

Banco de dados e auth do app-financeiro.

## Estrutura

```
supabase/
├── migrations/         Migrations SQL (versionadas, aplicadas em ordem)
├── functions/          Edge Functions (Deno/TypeScript)
├── seed.sql            Dados iniciais (categorias padrão)
└── config.toml         Config do Supabase CLI (criado ao rodar `supabase init`)
```

## Fluxo de desenvolvimento

### Setup inicial (uma vez)

1. Criar projeto em https://supabase.com (region São Paulo)
2. Anotar URL + anon key em `apps/mobile/.env.local`
3. Instalar Supabase CLI:
   ```powershell
   npm install -g supabase
   # ou via scoop: scoop install supabase
   ```
4. Login e link com o projeto cloud:
   ```powershell
   supabase login
   supabase link --project-ref <ref-do-projeto>
   ```

### Aplicar migrations em produção (cloud)

```powershell
supabase db push
```

### Rodar local (Docker)

```powershell
supabase start         # sobe Postgres, Auth, Storage locais (precisa Docker)
supabase db reset      # aplica todas migrations + seed do zero
supabase stop          # para os containers
```

## Convenção de migrations

Formato do nome: `YYYYMMDDHHMMSS_descricao_curta.sql`
Exemplo: `20260516120000_initial_schema.sql`

Cada migration é **idempotente quando possível** e roda em transação. Nunca editar uma migration já aplicada em prod — sempre criar uma nova.

## Row Level Security

Todas as tabelas com `user_id` têm policies restringindo acesso ao próprio usuário.
Categorias globais (`user_id IS NULL`) são `SELECT` para qualquer usuário autenticado.
