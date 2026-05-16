import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function InvestmentsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Investimentos</ThemedText>
      <ThemedText style={styles.subtitle}>
        Carteira, rentabilidade e cotações BRAPI. (Fase 8)
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, paddingTop: 64 },
  subtitle: { opacity: 0.7 },
});
