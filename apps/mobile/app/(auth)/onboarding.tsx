import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function OnboardingScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Vamos começar</ThemedText>
      <ThemedText style={styles.subtitle}>
        Tutorial em construção. (Fase 10 do roadmap)
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  subtitle: { opacity: 0.7, textAlign: 'center' },
});
