/**
 * Validators Zod para a entidade `accounts`.
 *
 * - `createAccountSchema`: shape básico. Validação cross-field (cartão exige
 *   closing_day + due_day) fica no handler do form pra não quebrar
 *   inferência do `zodResolver` em Zod v4.
 * - `updateAccountSchema`: tudo opcional (PATCH parcial).
 */
import { z } from 'zod';

export const accountTypeSchema = z.enum([
  'checking',
  'savings',
  'credit_card',
  'investment',
  'cash',
]);

export type AccountType = z.infer<typeof accountTypeSchema>;

export const accountTypeLabels: Record<AccountType, string> = {
  checking: 'Conta corrente',
  savings: 'Poupança',
  credit_card: 'Cartão de crédito',
  investment: 'Investimento',
  cash: 'Dinheiro',
};

const dayOfMonth = z.coerce.number().int().min(1).max(31);

export const createAccountSchema = z.object({
  name: z
    .string({ error: 'Informe um nome para a conta.' })
    .trim()
    .min(1, 'Nome não pode ser vazio.')
    .max(80, 'Nome muito longo (máx 80 caracteres).'),
  type: accountTypeSchema,
  bank: z.string().trim().max(40).nullable().optional(),
  initial_balance: z.coerce.number().finite().default(0),
  credit_limit: z.coerce.number().positive().nullable().optional(),
  closing_day: dayOfMonth.nullable().optional(),
  due_day: dayOfMonth.nullable().optional(),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const updateAccountSchema = createAccountSchema.partial().extend({
  archived: z.boolean().optional(),
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

/**
 * Validação cross-field para uso no submit handler.
 * Retorna lista de erros (vazia se OK) — formato compatível com `setError` do RHF.
 */
export function validateAccountBusinessRules(
  input: CreateAccountInput,
): Array<{ path: keyof CreateAccountInput; message: string }> {
  const errors: Array<{ path: keyof CreateAccountInput; message: string }> = [];

  if (input.type === 'credit_card') {
    if (!input.closing_day) {
      errors.push({ path: 'closing_day', message: 'Obrigatório para cartão.' });
    }
    if (!input.due_day) {
      errors.push({ path: 'due_day', message: 'Obrigatório para cartão.' });
    }
  }

  return errors;
}
