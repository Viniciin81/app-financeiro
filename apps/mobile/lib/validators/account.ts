/**
 * Validators Zod para a entidade `accounts`.
 *
 * - `createAccountSchema`: campos obrigatórios + cross-field validation
 *   (cartão exige closing_day + due_day).
 * - `updateAccountSchema`: todos opcionais (PATCH parcial), sem cross-field
 *   pra simplificar parcial — o backend ainda valida.
 *
 * Compatível com Zod v4 (a API mudou: `error` em vez de `required_error`,
 * sem `.innerType()`).
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

// Schema base (sem cross-field). Usado pra montar create + update.
const accountBaseSchema = z.object({
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

export const createAccountSchema = accountBaseSchema.superRefine((data, ctx) => {
  if (data.type === 'credit_card') {
    if (!data.closing_day) {
      ctx.addIssue({
        code: 'custom',
        message: 'Dia de fechamento é obrigatório para cartão.',
        path: ['closing_day'],
      });
    }
    if (!data.due_day) {
      ctx.addIssue({
        code: 'custom',
        message: 'Dia de vencimento é obrigatório para cartão.',
        path: ['due_day'],
      });
    }
  }
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const updateAccountSchema = accountBaseSchema.partial().extend({
  archived: z.boolean().optional(),
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
