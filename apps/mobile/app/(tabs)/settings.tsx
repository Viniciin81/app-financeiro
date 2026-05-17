import { Link } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAccounts } from '@/lib/queries/accounts';
import { supabase } from '@/lib/supabase';
import { palette } from '@/tamagui.config';

type SettingsItem = {
  label: string;
  description?: string;
  href?: string;
  rightText?: string;
  onPress?: () => void;
  destructive?: boolean;
};

export default function SettingsScreen() {
  const { user } = useAuth();
  const { data: accounts } = useAccounts({ archived: false });

  async function handleSignOut() {
    Alert.alert('Sair', 'Tem certeza que quer encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          supabase.auth.signOut();
        },
      },
    ]);
  }

  const sections: { title: string; items: SettingsItem[] }[] = [
    {
      title: 'Dados financeiros',
      items: [
        {
          label: 'Minhas contas',
          description: 'Corrente, poupança, cartões, investimentos',
          href: '/accounts',
          rightText: accounts ? String(accounts.length) : undefined,
        },
        {
          label: 'Categorias',
          description: 'Em breve',
          rightText: '—',
        },
      ],
    },
    {
      title: 'Conta',
      items: [
        {
          label: 'Email',
          description: user?.email ?? '—',
        },
        {
          label: 'Sair',
          onPress: handleSignOut,
          destructive: true,
        },
      ],
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Ajustes</ThemedText>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
            <View style={styles.card}>
              {section.items.map((item, index) => (
                <SettingsRow
                  key={item.label}
                  item={item}
                  isLast={index === section.items.length - 1}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

function SettingsRow({ item, isLast }: { item: SettingsItem; isLast: boolean }) {
  const content = (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.rowMain}>
        <Text style={[styles.rowLabel, item.destructive && { color: palette.brick }]}>
          {item.label}
        </Text>
        {item.description ? <Text style={styles.rowDesc}>{item.description}</Text> : null}
      </View>
      {item.rightText !== undefined ? (
        <Text style={styles.rowRight}>{item.rightText}</Text>
      ) : item.href || item.onPress ? (
        <Text style={styles.rowChevron}>›</Text>
      ) : null}
    </View>
  );

  if (item.href) {
    return (
      <Link href={item.href as never} asChild>
        <Pressable style={({ pressed }) => [pressed && { opacity: 0.7 }]}>{content}</Pressable>
      </Link>
    );
  }

  if (item.onPress) {
    return (
      <Pressable
        onPress={item.onPress}
        style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, gap: 24, paddingTop: 64, paddingBottom: 40 },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.warmGray400,
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: palette.warmGray50,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.warmGray100,
  },
  rowMain: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 16, fontWeight: '500', color: palette.warmGray700 },
  rowDesc: { fontSize: 13, color: palette.warmGray400 },
  rowRight: { fontSize: 14, color: palette.warmGray400 },
  rowChevron: { fontSize: 22, color: palette.warmGray300 },
});
