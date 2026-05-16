import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { palette } from '@/tamagui.config';
import { signInWithGoogle } from '@/lib/auth/signInWithGoogle';

// TODO(design-system): migrar tela para componentes Tamagui (YStack, Button) quando
// resolvermos o type augmentation do TamaguiCustomConfig (strict TS + v4 config).

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) {
      Alert.alert('Não foi possível entrar', error);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Bem-vindo</ThemedText>
        <ThemedText style={styles.subtitle}>
          Controle suas finanças com simplicidade.
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={handleGoogle}
          disabled={loading}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && { opacity: 0.85 },
            loading && { opacity: 0.6 },
          ]}>
          {loading ? (
            <ActivityIndicator color={palette.cream} />
          ) : (
            <ThemedText style={styles.primaryButtonText}>Entrar com Google</ThemedText>
          )}
        </Pressable>
        {/* TODO: Botão "Entrar com Apple" — habilitar quando houver Apple Developer ativo. */}
      </View>

      <ThemedText style={styles.disclaimer}>
        Ao continuar você concorda com nossos Termos e Política de Privacidade.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
  },
  header: { gap: 8 },
  subtitle: { opacity: 0.7 },
  actions: { gap: 12 },
  primaryButton: {
    backgroundColor: palette.moss500,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButtonText: {
    color: palette.cream,
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    opacity: 0.6,
    fontSize: 12,
    textAlign: 'center',
  },
});
