import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/lib/auth/AuthProvider';

export default function AuthLayout() {
  const { session, loading } = useAuth();

  // Já logado → redireciona pra área autenticada.
  if (!loading && session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
