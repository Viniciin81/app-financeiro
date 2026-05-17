#!/usr/bin/env node
/**
 * Regenera os types do Supabase em `apps/mobile/types/database.ts`.
 *
 * Por que script Node em vez de pipe shell?
 *   - `supabase gen types ... > file.ts` no PowerShell joga stderr no arquivo
 *     também (NativeCommandError), corrompendo o resultado.
 *   - Aqui usamos `execSync` com `encoding: 'utf-8'` que captura SÓ stdout.
 *
 * Requer:
 *   - `SUPABASE_ACCESS_TOKEN` no ambiente (gere em https://supabase.com/dashboard/account/tokens).
 *
 * Uso:
 *   pnpm gen:types
 */
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const PROJECT_ID = 'hkrqzmciviehajmxiyev';
const OUTPUT = 'apps/mobile/types/database.ts';

if (!process.env.SUPABASE_ACCESS_TOKEN) {
  console.error(
    '[gen-types] SUPABASE_ACCESS_TOKEN não definido.\n' +
      'Gere um token em https://supabase.com/dashboard/account/tokens e exporte:\n' +
      '  PowerShell: $env:SUPABASE_ACCESS_TOKEN="sbp_..."\n' +
      '  bash:       export SUPABASE_ACCESS_TOKEN="sbp_..."',
  );
  process.exit(1);
}

console.log(`[gen-types] Gerando types do projeto ${PROJECT_ID}...`);

const types = execSync(
  `pnpm exec supabase gen types typescript --project-id ${PROJECT_ID} --schema public`,
  { encoding: 'utf-8', stdio: ['inherit', 'pipe', 'inherit'] },
);

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, types, 'utf-8');

const lineCount = types.split('\n').length;
console.log(`[gen-types] ${lineCount} linhas escritas em ${OUTPUT}`);
