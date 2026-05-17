/**
 * Hooks TanStack Query para `categories`.
 *
 * Categorias globais (user_id IS NULL) são visíveis pra todos via RLS (SELECT
 * com user_id IS NULL OR auth.uid() = user_id). Tratamos elas como read-only
 * no client — apenas categorias do próprio usuário podem ser editadas.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase, type Tables, type TablesUpdate } from '@/lib/supabase';
import type {
  CategoryKind,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/lib/validators/category';

import { qk } from './keys';

export type Category = Tables<'categories'>;

export function isGlobalCategory(category: Category): boolean {
  return category.user_id === null;
}

// ---------- Queries ----------

export function useCategories(options: { type?: CategoryKind; archived?: boolean } = {}) {
  return useQuery({
    queryKey: qk.categories.list(options),
    queryFn: async (): Promise<Category[]> => {
      let q = supabase.from('categories').select('*').order('name');
      if (options.type) q = q.eq('type', options.type);
      if (options.archived !== undefined) q = q.eq('archived', options.archived);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: id ? qk.categories.detail(id) : ['categories', 'detail', 'disabled'],
    queryFn: async (): Promise<Category | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

// ---------- Mutations ----------

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Sessão expirada. Faça login novamente.');
  return data.user.id;
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCategoryInput): Promise<Category> => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('categories')
        .insert({ ...input, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.categories.all });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: UpdateCategoryInput;
    }): Promise<Category> => {
      const dbPatch = patch as TablesUpdate<'categories'>;
      const { data, error } = await supabase
        .from('categories')
        .update(dbPatch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: qk.categories.all });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.categories.all });
    },
  });
}
