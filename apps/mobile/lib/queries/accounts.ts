/**
 * Hooks TanStack Query para a entidade `accounts`.
 *
 * Padrão:
 * - Queries (read): `useAccounts`, `useAccount`.
 * - Mutations: `useCreateAccount`, `useUpdateAccount`, `useArchiveAccount`, `useDeleteAccount`.
 * - Após cada mutation, invalidamos `qk.accounts.all` para refrescar listas/detalhes.
 *
 * O RLS do Postgres garante que cada usuário só vê suas próprias contas, então
 * não filtramos `user_id` no client — confiamos no RLS.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase, type Tables, type TablesUpdate } from '@/lib/supabase';
import type { CreateAccountInput, UpdateAccountInput } from '@/lib/validators/account';

import { qk } from './keys';

export type Account = Tables<'accounts'>;

// ---------- Queries ----------

export function useAccounts(options: { archived?: boolean } = {}) {
  return useQuery({
    queryKey: qk.accounts.list(options),
    queryFn: async (): Promise<Account[]> => {
      let q = supabase.from('accounts').select('*').order('name');
      if (options.archived !== undefined) {
        q = q.eq('archived', options.archived);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAccount(id: string | undefined) {
  return useQuery({
    queryKey: id ? qk.accounts.detail(id) : ['accounts', 'detail', 'disabled'],
    queryFn: async (): Promise<Account | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('accounts')
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
  if (error || !data.user) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }
  return data.user.id;
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAccountInput): Promise<Account> => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('accounts')
        .insert({ ...input, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.accounts.all });
    },
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: UpdateAccountInput;
    }): Promise<Account> => {
      const dbPatch = patch as TablesUpdate<'accounts'>;
      const { data, error } = await supabase
        .from('accounts')
        .update(dbPatch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: qk.accounts.all });
      qc.setQueryData(qk.accounts.detail(updated.id), updated);
    },
  });
}

/** Soft delete: marca a conta como arquivada. Não destrói transações ligadas. */
export function useArchiveAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('accounts')
        .update({ archived: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.accounts.all });
    },
  });
}

/**
 * Hard delete. Atenção: cascateia para transações da conta.
 * Use só em fluxo de "deletar conta" explícito.
 */
export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.from('accounts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.accounts.all });
    },
  });
}
