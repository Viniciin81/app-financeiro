import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Bem-vindo</ThemedText>
        <ThemedText style={styles.subtitle}>
          Controle suas finanças com simplicidade.
        </ThemedText>
        {/* TODO: botões "Entrar com Google" / "Entrar com Apple" (etapa OAuth) */}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  content: { gap: 12 },
  subtitle: { opacity: 0.7 },
});
