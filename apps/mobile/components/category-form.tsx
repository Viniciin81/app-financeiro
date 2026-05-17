/**
 * Formulário compartilhado entre criar e editar categoria do usuário.
 * Usa pickers visuais pra ícone e cor (em vez de inputs texto).
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ColorPicker, colorOptions } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Segmented } from '@/components/ui/segmented';
import { TextField } from '@/components/ui/text-field';
import {
  createCategorySchema,
  type CategoryKind,
  type CreateCategoryInput,
} from '@/lib/validators/category';
import { palette } from '@/tamagui.config';

export type CategoryFormProps = {
  initialValues?: Partial<CreateCategoryInput>;
  submitLabel: string;
  onSubmit: (values: CreateCategoryInput) => Promise<void> | void;
  loading?: boolean;
  secondaryAction?: { label: string; onPress: () => void; variant?: 'danger' | 'secondary' };
  /** Quando true, bloqueia edição de tipo. */
  lockType?: boolean;
};

const kindOptions: { value: CategoryKind; label: string }[] = [
  { value: 'expense', label: 'Despesa' },
  { value: 'income', label: 'Receita' },
];

export function CategoryForm({
  initialValues,
  submitLabel,
  onSubmit,
  loading = false,
  secondaryAction,
  lockType = false,
}: CategoryFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createCategorySchema) as any,
    defaultValues: {
      name: initialValues?.name ?? '',
      type: initialValues?.type ?? 'expense',
      icon: initialValues?.icon ?? null,
      color: initialValues?.color ?? colorOptions[0]?.value ?? null,
      parent_id: initialValues?.parent_id ?? null,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets>
        <View style={styles.fields}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                label="Nome"
                placeholder="Ex.: Cinema, Café da manhã, Pix família"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.name?.message}
                autoCapitalize="sentences"
              />
            )}
          />

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Tipo</Text>
                <Segmented<CategoryKind>
                  value={field.value}
                  onChange={lockType ? () => undefined : field.onChange}
                  options={kindOptions}
                />
                {lockType ? (
                  <Text style={styles.fieldHelper}>
                    Tipo não pode ser alterado depois da criação.
                  </Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Ícone</Text>
                <IconPicker value={field.value} onChange={field.onChange} />
              </View>
            )}
          />

          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Cor</Text>
                <ColorPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </View>
            )}
          />
        </View>

        <View style={styles.actions}>
          <Button
            label={submitLabel}
            onPress={handleSubmit(onSubmit)}
            loading={loading || isSubmitting}
          />
          {secondaryAction ? (
            <Button
              label={secondaryAction.label}
              variant={secondaryAction.variant ?? 'secondary'}
              onPress={secondaryAction.onPress}
            />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, gap: 24, paddingBottom: 40 },
  fields: { gap: 20 },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: palette.warmGray500 },
  fieldHelper: { fontSize: 12, color: palette.warmGray400 },
  actions: { gap: 12 },
});
