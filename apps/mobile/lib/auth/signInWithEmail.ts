/**
 * Autenticação por email + código OTP.
 *
 * Fluxo:
 *   1. Usuário digita email → `sendOtpCode(email)`.
 *   2. Supabase manda um email com código de 6 dígitos (template padrão).
 *   3. Usuário digita o código → `verifyOtpCode(email, code)`.
 *   4. Em sucesso, o `onAuthStateChange` do AuthProvider atualiza o app e redireciona.
 *
 * Vantagens vs OAuth:
 *   - Não depende de deep link / browser callback (funciona no Expo Go sem fricção).
 *   - Sem custos extras (Supabase free tier inclui ~3 emails/hora).
 *   - Mesmo backend de auth (usa auth.users igual ao OAuth).
 */
import { supabase } from '@/lib/supabase';

export async function sendOtpCode(email: string): Promise<{ error?: string }> {
  const normalized = email.trim().toLowerCase();

  if (!isValidEmail(normalized)) {
    return { error: 'Informe um email válido.' };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: {
      shouldCreateUser: true, // cria usuário no primeiro acesso (auto-signup)
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function verifyOtpCode(email: string, code: string): Promise<{ error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCode = code.trim();

  if (!/^\d{6}$/.test(normalizedCode)) {
    return { error: 'O código deve ter 6 dígitos.' };
  }

  const { error } = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token: normalizedCode,
    type: 'email',
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
