import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/lib/auth/AuthProvider';
import { palette } from '@/tamagui.config';

export default function AccountsLayout() {
  const { session, loading } = useAuth();

  if (!loading && !session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.cream },
        headerTitleStyle: { color: palette.warmGray700 },
        headerTintColor: palette.moss500,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ title: 'Minhas Contas' }} />
      <Stack.Screen
        name="new"
        options={{ title: 'Nova conta', presentation: 'modal' }}
      />
      <Stack.Screen name="[id]" options={{ title: 'Editar conta' }} />
    </Stack>
  );
}
