import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Ajustes</ThemedText>
      <ThemedText style={styles.subtitle}>
        Perfil, tema, notificações, categorias, export, deletar conta.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, paddingTop: 64 },
  subtitle: { opacity: 0.7 },
});
