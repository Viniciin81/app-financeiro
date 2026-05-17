/**
 * Instância global do TanStack Query client.
 *
 * Defaults pensados para um app financeiro mobile:
 * - `staleTime` médio (1 min): dados não mudam o tempo todo, evita refetch agressivo.
 * - `gcTime` longo (10 min): mantém cache pra navegação rápida entre telas.
 * - `retry: 1`: falhou uma vez, tenta mais uma; mais que isso é UX ruim em mobile.
 * - `refetchOnWindowFocus: false`: irrelevante em mobile (não há "window focus").
 * - `refetchOnReconnect: true`: ao voltar da tela bloqueada / 4G→Wi-Fi, atualiza.
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
