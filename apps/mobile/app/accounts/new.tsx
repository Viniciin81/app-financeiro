import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { AccountForm } from '@/components/account-form';
import { ThemedView } from '@/components/themed-view';
import { useCreateAccount } from '@/lib/queries/accounts';

export default function NewAccountScreen() {
  const router = useRouter();
  const createAccount = useCreateAccount();

  return (
    <ThemedView style={{ flex: 1 }}>
      <AccountForm
        submitLabel="Criar conta"
        loading={createAccount.isPending}
        onSubmit={async (values) => {
          try {
            await createAccount.mutateAsync(values);
            router.back();
          } catch (err) {
            Alert.alert(
              'Não foi possível criar a conta',
              err instanceof Error ? err.message : 'Erro desconhecido.',
            );
          }
        }}
      />
    </ThemedView>
  );
}
