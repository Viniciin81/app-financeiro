/**
 * Validators Zod para a entidade `categories`.
 *
 * Notas:
 * - Categorias globais (user_id NULL) não podem ser editadas pelo usuário.
 *   O CRUD aqui só lida com categorias do próprio usuário.
 * - `parent_id` para subcategorias é opcional (não implementamos UI ainda).
 */
import { z } from 'zod';

export const categoryKindSchema = z.enum(['expense', 'income']);
export type CategoryKind = z.infer<typeof categoryKindSchema>;

export const categoryKindLabels: Record<CategoryKind, string> = {
  expense: 'Despesa',
  income: 'Receita',
};

export const createCategorySchema = z.object({
  name: z
    .string({ error: 'Informe um nome.' })
    .trim()
    .min(1, 'Nome não pode ser vazio.')
    .max(60, 'Nome muito longo (máx 60 caracteres).'),
  type: categoryKindSchema,
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial().extend({
  archived: z.boolean().optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
