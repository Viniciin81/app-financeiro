import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { AccountForm } from '@/components/account-form';
import { ThemedView } from '@/components/themed-view';
import {
  useAccount,
  useArchiveAccount,
  useDeleteAccount,
  useUpdateAccount,
} from '@/lib/queries/accounts';
import { palette } from '@/tamagui.config';

export default function EditAccountScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: account, isLoading, error } = useAccount(id);
  const updateAccount = useUpdateAccount();
  const archiveAccount = useArchiveAccount();
  const deleteAccount = useDeleteAccount();

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator color={palette.moss500} />
      </ThemedView>
    );
  }

  if (error || !account) {
    return (
      <ThemedView style={styles.centered}>
        <Text style={styles.error}>Conta não encontrada.</Text>
      </ThemedView>
    );
  }

  function handleArchive() {
    if (!id) return;
    Alert.alert(
      account?.archived ? 'Reativar conta' : 'Arquivar conta',
      account?.archived
        ? 'A conta voltará a aparecer em "Ativas".'
        : 'A conta fica oculta mas o histórico de transações é mantido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: account?.archived ? 'Reativar' : 'Arquivar',
          onPress: async () => {
            try {
              if (account?.archived) {
                await updateAccount.mutateAsync({ id, patch: { archived: false } });
              } else {
                await archiveAccount.mutateAsync(id);
              }
              router.back();
            } catch (err) {
              Alert.alert('Erro', err instanceof Error ? err.message : 'Erro desconhecido.');
            }
          },
        },
      ],
    );
  }

  function handleDelete() {
    if (!id) return;
    Alert.alert(
      'Apagar conta',
      'Atenção: isso apaga também TODAS as transações desta conta. Quer mesmo continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount.mutateAsync(id);
              router.back();
            } catch (err) {
              Alert.alert('Erro', err instanceof Error ? err.message : 'Erro desconhecido.');
            }
          },
        },
      ],
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <AccountForm
        initialValues={{
          name: account.name,
          type: account.type,
          bank: account.bank,
          initial_balance: account.initial_balance,
          credit_limit: account.credit_limit,
          closing_day: account.closing_day,
          due_day: account.due_day,
          color: account.color,
          icon: account.icon,
        }}
        submitLabel="Salvar alterações"
        loading={updateAccount.isPending}
        onSubmit={async (values) => {
          try {
            await updateAccount.mutateAsync({ id, patch: values });
            router.back();
          } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro desconhecido.');
          }
        }}
        secondaryAction={{
          label: account.archived ? 'Reativar conta' : 'Arquivar conta',
          onPress: handleArchive,
          variant: 'secondary',
        }}
      />
      <View style={styles.dangerZone}>
        <Text style={styles.dangerLabel}>Apagar permanentemente é destrutivo:</Text>
        <Text style={styles.dangerText}>
          remove a conta e TODAS as transações ligadas a ela. Prefira arquivar.
        </Text>
        <View style={{ marginTop: 8 }}>
          <Text
            onPress={handleDelete}
            style={styles.deleteLink}
            accessibilityRole="button">
            Apagar permanentemente
          </Text>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  error: { color: palette.brick, fontSize: 16 },
  dangerZone: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.warmGray100,
    borderRadius: 12,
    gap: 4,
  },
  dangerLabel: { fontSize: 13, fontWeight: '600', color: palette.warmGray500 },
  dangerText: { fontSize: 12, color: palette.warmGray400, lineHeight: 16 },
  deleteLink: { fontSize: 14, fontWeight: '600', color: palette.brick, paddingVertical: 4 },
});
