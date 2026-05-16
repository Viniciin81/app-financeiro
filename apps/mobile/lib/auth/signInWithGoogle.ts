/**
 * Fluxo de login OAuth Google via Supabase.
 *
 * Estratégia:
 *   1. `supabase.auth.signInWithOAuth` retorna a URL de autorização do Google
 *      (com `redirectTo` apontando para o deep link do app).
 *   2. Abrimos essa URL no navegador in-app (`expo-web-browser`).
 *   3. Após o usuário autenticar, o Supabase redireciona para `redirectTo`
 *      com `?code=...` na query.
 *   4. Trocamos o `code` por uma sessão via `exchangeCodeForSession`.
 *   5. O `onAuthStateChange` do AuthProvider detecta e atualiza a UI.
 *
 * Requisitos antes de funcionar:
 *   - Supabase Dashboard → Authentication → Providers → Google: habilitado
 *     com Client ID/Secret do Google Cloud Console.
 *   - Supabase Dashboard → Authentication → URL Configuration → Redirect URLs:
 *     adicionar `appfinanceiro://auth/callback` e (para Expo Go) `exp://*`.
 *   - Google Cloud Console → OAuth Client (Web):
 *     authorized redirect URI = `https://<projeto>.supabase.co/auth/v1/callback`.
 */
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_PATH = '/auth/callback';

export async function signInWithGoogle(): Promise<{ error?: string }> {
  const redirectTo = Linking.createURL(REDIRECT_PATH);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data?.url) {
    return { error: error?.message ?? 'Não foi possível iniciar o login com Google.' };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== 'success' || !result.url) {
    return { error: result.type === 'cancel' ? 'Login cancelado.' : 'Falha no fluxo de OAuth.' };
  }

  const { params, errorCode } = extractParamsFromUrl(result.url);

  if (errorCode) {
    return { error: errorCode };
  }

  if (params.code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(params.code);
    if (exchangeError) {
      return { error: exchangeError.message };
    }
    return {};
  }

  // Alguns fluxos (implicit grant legacy) trazem access_token direto no hash
  if (params.access_token && params.refresh_token) {
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
    if (setSessionError) {
      return { error: setSessionError.message };
    }
    return {};
  }

  return { error: 'Resposta de OAuth não reconhecida.' };
}

function extractParamsFromUrl(url: string): {
  params: Record<string, string>;
  errorCode?: string;
} {
  const parsed = Linking.parse(url);
  const params: Record<string, string> = {};

  for (const [key, value] of Object.entries(parsed.queryParams ?? {})) {
    if (typeof value === 'string') params[key] = value;
  }

  // PKCE fragment fallback (#access_token=...&refresh_token=...)
  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    const fragment = url.slice(hashIndex + 1);
    for (const pair of fragment.split('&')) {
      const [k, v] = pair.split('=');
      if (k && v) params[k] = decodeURIComponent(v);
    }
  }

  return {
    params,
    errorCode: params.error_description ?? params.error,
  };
}
