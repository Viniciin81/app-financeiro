import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { isGlobalCategory, useCategories, type Category } from '@/lib/queries/categories';
import type { CategoryKind } from '@/lib/validators/category';
import { palette } from '@/tamagui.config';

export default function CategoriesListScreen() {
  const router = useRouter();
  const [kind, setKind] = useState<CategoryKind>('expense');

  const { data: categories, isLoading, isFetching, refetch, error } = useCategories({
    type: kind,
    archived: false,
  });

  const sections = useMemo(() => {
    const global = (categories ?? []).filter(isGlobalCategory);
    const own = (categories ?? []).filter((c) => !isGlobalCategory(c));
    return { global, own };
  }, [categories]);

  // Lista única: próprias primeiro (com cabeçalho), depois globais (com cabeçalho).
  const flat = useMemo(() => {
    const items: ListItem[] = [];
    if (sections.own.length > 0) {
      items.push({ type: 'header', title: 'Suas categorias' });
      items.push(...sections.own.map((c): ListItem => ({ type: 'item', category: c })));
    }
    items.push({ type: 'header', title: 'Categorias padrão' });
    items.push(...sections.global.map((c): ListItem => ({ type: 'item', category: c })));
    return items;
  }, [sections]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Segmented<CategoryKind>
          value={kind}
          onChange={setKind}
          options={[
            { value: 'expense', label: 'Despesas' },
            { value: 'income', label: 'Receitas' },
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
      ) : (
        <FlatList
          data={flat}
          keyExtractor={(item, idx) =>
            item.type === 'header' ? `h-${item.title}-${idx}` : item.category.id
          }
          contentContainerStyle={styles.list}
          renderItem={({ item }) =>
            item.type === 'header' ? (
              <Text style={styles.sectionHeader}>{item.title.toUpperCase()}</Text>
            ) : (
              <CategoryRow category={item.category} />
            )
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />
          }
        />
      )}

      <View style={styles.fab}>
        <Button label="+ Nova categoria" onPress={() => router.push('/categories/new')} />
      </View>
    </ThemedView>
  );
}

type ListItem =
  | { type: 'header'; title: string }
  | { type: 'item'; category: Category };

function CategoryRow({ category }: { category: Category }) {
  const isGlobal = isGlobalCategory(category);

  const content = (
    <View style={styles.row}>
      <View
        style={[
          styles.colorDot,
          { backgroundColor: category.color ?? palette.warmGray300 },
        ]}
      />
      <View style={styles.rowMain}>
        <Text style={styles.rowName}>{category.name}</Text>
        {isGlobal ? (
          <Text style={styles.rowSubtitle}>Categoria padrão</Text>
        ) : null}
      </View>
      {!isGlobal ? <Text style={styles.rowChevron}>›</Text> : null}
    </View>
  );

  if (isGlobal) {
    // Globais não são editáveis pelo usuário — só mostra.
    return content;
  }

  return (
    <Link
      href={{ pathname: '/categories/[id]', params: { id: category.id } }}
      asChild>
      <Pressable style={({ pressed }) => [pressed && { opacity: 0.7 }]}>{content}</Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  errorText: { color: palette.brick, textAlign: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 120 },
  separator: { height: 8 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.warmGray400,
    letterSpacing: 0.5,
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.warmGray50,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  rowMain: { flex: 1, gap: 2 },
  rowName: { fontSize: 16, fontWeight: '500', color: palette.warmGray700 },
  rowSubtitle: { fontSize: 12, color: palette.warmGray400 },
  rowChevron: { fontSize: 22, color: palette.warmGray300 },
  fab: { position: 'absolute', left: 16, right: 16, bottom: 24 },
});
