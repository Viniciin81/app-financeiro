/**
 * Query keys factory. Centraliza as chaves de cache do TanStack Query.
 *
 * Convenção: cada entidade é um namespace com `all`, `lists()`, `list(filters)`,
 * `details()` e `detail(id)`. Permite invalidação granular (`queryClient.invalidateQueries({ queryKey: qk.accounts.lists() })`).
 *
 * Ref: https://tkdodo.eu/blog/effective-react-query-keys
 */
export const qk = {
  accounts: {
    all: ['accounts'] as const,
    lists: () => [...qk.accounts.all, 'list'] as const,
    list: (filters?: { archived?: boolean }) => [...qk.accounts.lists(), filters ?? {}] as const,
    details: () => [...qk.accounts.all, 'detail'] as const,
    detail: (id: string) => [...qk.accounts.details(), id] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => [...qk.categories.all, 'list'] as const,
    list: (filters?: { type?: 'expense' | 'income'; archived?: boolean }) =>
      [...qk.categories.lists(), filters ?? {}] as const,
    detail: (id: string) => [...qk.categories.all, 'detail', id] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...qk.transactions.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...qk.transactions.lists(), filters ?? {}] as const,
    detail: (id: string) => [...qk.transactions.all, 'detail', id] as const,
  },
} as const;
