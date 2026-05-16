import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BudgetsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Orçamentos</ThemedText>
      <ThemedText style={styles.subtitle}>
        Limites por categoria, progresso e metas. (Fase 5)
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, paddingTop: 64 },
  subtitle: { opacity: 0.7 },
});
