import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { CategoryForm } from '@/components/category-form';
import { ThemedView } from '@/components/themed-view';
import { useCreateCategory } from '@/lib/queries/categories';

export default function NewCategoryScreen() {
  const router = useRouter();
  const createCategory = useCreateCategory();

  return (
    <ThemedView style={{ flex: 1 }}>
      <CategoryForm
        submitLabel="Criar categoria"
        loading={createCategory.isPending}
        onSubmit={async (values) => {
          try {
            await createCategory.mutateAsync(values);
            router.back();
          } catch (err) {
            Alert.alert(
              'Não foi possível criar a categoria',
              err instanceof Error ? err.message : 'Erro desconhecido.',
            );
          }
        }}
      />
    </ThemedView>
  );
}
