import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TransactionsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Transações</ThemedText>
      <ThemedText style={styles.subtitle}>
        Lista de movimentações, filtros, importação OFX/CSV. (Fase 2 e 3)
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, paddingTop: 64 },
  subtitle: { opacity: 0.7 },
});
