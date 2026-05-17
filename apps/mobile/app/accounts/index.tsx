import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { ThemedView } from '@/components/themed-view';
import { useAccounts, type Account } from '@/lib/queries/accounts';
import { accountTypeLabels } from '@/lib/validators/account';
import { palette } from '@/tamagui.config';

type Filter = 'active' | 'archived';

export default function AccountsListScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('active');

  const archived = filter === 'archived';
  const { data: accounts, isLoading, isFetching, refetch, error } = useAccounts({ archived });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'active', label: 'Ativas' },
            { value: 'archived', label: 'Arquivadas' },
          ]}
        />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={palette.moss500} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{(error as Error).message}</Text>
          <Button label="Tentar novamente" variant="ghost" onPress={() => refetch()} />
        </View>
      ) : !accounts || accounts.length === 0 ? (
        <EmptyState archived={archived} onCreate={() => router.push('/accounts/new')} />
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <AccountRow account={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />
          }
        />
      )}

      {!isLoading && accounts && accounts.length > 0 ? (
        <View style={styles.fab}>
          <Button label="+ Nova conta" onPress={() => router.push('/accounts/new')} />
        </View>
      ) : null}
    </ThemedView>
  );
}

function AccountRow({ account }: { account: Account }) {
  return (
    <Link href={{ pathname: '/accounts/[id]', params: { id: account.id } }} asChild>
      <Pressable
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
        accessibilityRole="button">
        <View style={styles.rowMain}>
          <Text style={styles.rowName}>{account.name}</Text>
          <Text style={styles.rowSubtitle}>
            {accountTypeLabels[account.type]}
            {account.bank ? ` · ${account.bank}` : ''}
          </Text>
        </View>
        <Text style={styles.rowChevron}>›</Text>
      </Pressable>
    </Link>
  );
}

function EmptyState({ archived, onCreate }: { archived: boolean; onCreate: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>
        {archived ? 'Nenhuma conta arquivada.' : 'Você ainda não tem contas.'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {archived
          ? 'Contas arquivadas aparecem aqui pra consulta.'
          : 'Adicione sua primeira conta corrente, cartão ou poupança.'}
      </Text>
      {!archived ? (
        <View style={{ marginTop: 16 }}>
          <Button label="Criar primeira conta" onPress={onCreate} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  errorText: { color: palette.brick, textAlign: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 120 },
  separator: { height: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.warmGray50,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  rowMain: { flex: 1, gap: 2 },
  rowName: { fontSize: 16, fontWeight: '600', color: palette.warmGray700 },
  rowSubtitle: { fontSize: 13, color: palette.warmGray400 },
  rowChevron: { fontSize: 24, color: palette.warmGray300 },
  fab: { position: 'absolute', left: 16, right: 16, bottom: 24 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: palette.warmGray700, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: palette.warmGray400, textAlign: 'center' },
});
