/**
 * Cliente Supabase configurado para React Native + Expo.
 *
 * - Storage: AsyncStorage (única opção que persiste entre reloads no RN).
 * - autoRefreshToken: refresh do JWT em background.
 * - persistSession: mantém o usuário logado entre aberturas do app.
 * - detectSessionInUrl: false porque RN não usa URL como SPA web.
 *
 * As envs `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` são
 * embarcadas no bundle do app pelo Expo (prefixo EXPO_PUBLIC_*). A anon key
 * é projetada para ser pública — a segurança vem das RLS policies do banco.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import type { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY são obrigatórias. ' +
      'Copie .env.example para .env.local e preencha com os valores do seu projeto Supabase.',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type SupabaseClient = typeof supabase;

// Atalhos para Row/Insert/Update de cada tabela, mantém imports curtos no app.
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
