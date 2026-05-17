/**
 * Fluxo de login OAuth Google via Supabase.
 *
 * Estratégia: browser comum + listener de deep link
 * (em vez de openAuthSessionAsync que falha no Expo Go com schemes `exp://`).
 *
 * Fluxo:
 *   1. supabase.auth.signInWithOAuth retorna a URL de autorização (skipBrowserRedirect=true).
 *   2. Registramos um listener `Linking.addEventListener('url', ...)` antes de abrir o browser.
 *   3. Abrimos a URL no browser comum (SFSafariViewController/Chrome Custom Tabs).
 *   4. Usuário autentica → Google redireciona pro Supabase → Supabase redireciona pro
 *      deep link `exp://.../auth/callback?code=…`.
 *   5. O iOS reconhece o scheme (`exp://` pertence ao Expo Go) e abre o app.
 *   6. O listener recebe a URL, extraímos o `code` e fazemos exchange por sessão.
 *   7. Fechamos o browser manualmente com `WebBrowser.dismissBrowser`.
 */
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_PATH = '/auth/callback';
const CALLBACK_TIMEOUT_MS = 120_000; // 2 minutos pro usuário completar o OAuth

export async function signInWithGoogle(): Promise<{ error?: string }> {
  const redirectTo = Linking.createURL(REDIRECT_PATH);

  // 1. Pega a URL de autorização do Supabase (sem redirect automático).
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

  // 2. Promise que aguarda o deep link de callback chegar via Linking.
  const callbackPromise = new Promise<string | null>((resolve) => {
    const timeoutId = setTimeout(() => {
      subscription.remove();
      resolve(null);
    }, CALLBACK_TIMEOUT_MS);

    const subscription = Linking.addEventListener('url', ({ url }) => {
      if (url.includes(REDIRECT_PATH)) {
        clearTimeout(timeoutId);
        subscription.remove();
        resolve(url);
      }
    });
  });

  // 3. Abre o SFSafariViewController (browser in-app). Pra o redirect final
  //    `exp://...` ser interceptado, dependemos do listener Linking abaixo
  //    (o iOS dispara o evento de deep link no app que abriu a view).
  await WebBrowser.openBrowserAsync(data.url);

  // 4. Aguarda o callback via deep link.
  const callbackUrl = await callbackPromise;

  // 5. Fecha o SFSafariViewController explicitamente (caso ainda esteja aberto).
  WebBrowser.dismissBrowser();

  if (!callbackUrl) {
    return { error: 'Tempo esgotado ou login cancelado.' };
  }

  // 6. Parse params.
  const { params, errorCode } = extractParamsFromUrl(callbackUrl);

  if (errorCode) {
    return { error: errorCode };
  }

  // 7a. PKCE flow (padrão do Supabase v2): troca code por sessão.
  if (params.code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(params.code);
    if (exchangeError) {
      return { error: exchangeError.message };
    }
    return {};
  }

  // 7b. Implicit grant (fallback legacy).
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
