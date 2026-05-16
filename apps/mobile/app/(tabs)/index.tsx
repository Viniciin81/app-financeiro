import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function DashboardScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Dashboard</ThemedText>
        <ThemedText style={styles.subtitle}>
          Saldo total, gastos do mês, gráficos e alertas vão aqui. (Fase 4)
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, gap: 12, paddingTop: 64 },
  subtitle: { opacity: 0.7 },
});
