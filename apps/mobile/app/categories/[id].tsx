import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';

import { CategoryForm } from '@/components/category-form';
import { ThemedView } from '@/components/themed-view';
import {
  isGlobalCategory,
  useCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/lib/queries/categories';
import { palette } from '@/tamagui.config';

export default function EditCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: category, isLoading, error } = useCategory(id);
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator color={palette.moss500} />
      </ThemedView>
    );
  }

  if (error || !category) {
    return (
      <ThemedView style={styles.centered}>
        <Text style={styles.error}>Categoria não encontrada.</Text>
      </ThemedView>
    );
  }

  if (isGlobalCategory(category)) {
    return (
      <ThemedView style={styles.centered}>
        <Text style={styles.error}>Categorias padrão não podem ser editadas.</Text>
      </ThemedView>
    );
  }

  function handleDelete() {
    if (!id) return;
    Alert.alert(
      'Apagar categoria',
      'Transações ligadas a esta categoria ficam sem categoria (mas não são apagadas). Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory.mutateAsync(id);
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
      <CategoryForm
        initialValues={{
          name: category.name,
          type: category.type,
          icon: category.icon,
          color: category.color,
          parent_id: category.parent_id,
        }}
        submitLabel="Salvar alterações"
        loading={updateCategory.isPending}
        lockType
        onSubmit={async (values) => {
          try {
            await updateCategory.mutateAsync({ id, patch: values });
            router.back();
          } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro desconhecido.');
          }
        }}
        secondaryAction={{
          label: 'Apagar categoria',
          onPress: handleDelete,
          variant: 'danger',
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  error: { color: palette.brick, fontSize: 16, textAlign: 'center' },
});
