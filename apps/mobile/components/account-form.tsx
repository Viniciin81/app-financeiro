/**
 * Formulário compartilhado entre criar e editar conta.
 * Recebe valores iniciais + callback `onSubmit`.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { TextField } from '@/components/ui/text-field';
import {
  accountTypeLabels,
  createAccountSchema,
  validateAccountBusinessRules,
  type AccountType,
  type CreateAccountInput,
} from '@/lib/validators/account';
import { palette } from '@/tamagui.config';

export type AccountFormProps = {
  initialValues?: Partial<CreateAccountInput>;
  submitLabel: string;
  onSubmit: (values: CreateAccountInput) => Promise<void> | void;
  loading?: boolean;
  secondaryAction?: { label: string; onPress: () => void; variant?: 'danger' | 'secondary' };
};

const accountTypeOptions: { value: AccountType; label: string }[] = [
  { value: 'checking', label: 'Corrente' },
  { value: 'savings', label: 'Poupança' },
  { value: 'credit_card', label: 'Cartão' },
  { value: 'investment', label: 'Invest' },
  { value: 'cash', label: 'Carteira' },
];

export function AccountForm({
  initialValues,
  submitLabel,
  onSubmit,
  loading = false,
  secondaryAction,
}: AccountFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createAccountSchema) as any,
    defaultValues: {
      name: initialValues?.name ?? '',
      type: initialValues?.type ?? 'checking',
      bank: initialValues?.bank ?? null,
      initial_balance: initialValues?.initial_balance ?? 0,
      credit_limit: initialValues?.credit_limit ?? null,
      closing_day: initialValues?.closing_day ?? null,
      due_day: initialValues?.due_day ?? null,
      color: initialValues?.color ?? null,
      icon: initialValues?.icon ?? null,
    },
  });

  const type = watch('type');
  const isCreditCard = type === 'credit_card';

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
              placeholder={`Ex.: Nubank, Itaú, ${accountTypeLabels[type]}`}
              value={field.value}
              onChangeText={field.onChange}
              error={errors.name?.message}
              autoCapitalize="words"
              returnKeyType="next"
            />
          )}
        />

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Tipo</Text>
              <Segmented<AccountType>
                value={field.value}
                onChange={field.onChange}
                options={accountTypeOptions}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="bank"
          render={({ field }) => (
            <TextField
              label="Banco (opcional)"
              placeholder="Nubank, Itaú, Inter..."
              value={field.value ?? ''}
              onChangeText={(t) => field.onChange(t || null)}
              error={errors.bank?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="initial_balance"
          render={({ field }) => (
            <TextField
              label="Saldo inicial"
              placeholder="0,00"
              value={
                field.value !== undefined && field.value !== null ? String(field.value) : ''
              }
              onChangeText={(t) => field.onChange(t.replace(',', '.'))}
              error={errors.initial_balance?.message}
              keyboardType="decimal-pad"
              helperText="Saldo atual do extrato. Negativo para cartões com fatura aberta."
            />
          )}
        />

        {isCreditCard ? (
          <>
            <Controller
              control={control}
              name="credit_limit"
              render={({ field }) => (
                <TextField
                  label="Limite do cartão"
                  placeholder="2500,00"
                  value={
                    field.value !== undefined && field.value !== null ? String(field.value) : ''
                  }
                  onChangeText={(t) => field.onChange(t ? Number(t.replace(',', '.')) : null)}
                  error={errors.credit_limit?.message}
                  keyboardType="decimal-pad"
                />
              )}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Controller
                  control={control}
                  name="closing_day"
                  render={({ field }) => (
                    <TextField
                      label="Fechamento"
                      placeholder="Dia"
                      value={field.value ? String(field.value) : ''}
                      onChangeText={(t) => field.onChange(t ? Number(t) : null)}
                      error={errors.closing_day?.message}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  )}
                />
              </View>
              <View style={styles.col}>
                <Controller
                  control={control}
                  name="due_day"
                  render={({ field }) => (
                    <TextField
                      label="Vencimento"
                      placeholder="Dia"
                      value={field.value ? String(field.value) : ''}
                      onChangeText={(t) => field.onChange(t ? Number(t) : null)}
                      error={errors.due_day?.message}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  )}
                />
              </View>
            </View>
          </>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button
          label={submitLabel}
          onPress={handleSubmit((values) => {
            const businessErrors = validateAccountBusinessRules(values);
            if (businessErrors.length > 0) {
              for (const err of businessErrors) {
                setError(err.path, { type: 'validate', message: err.message });
              }
              return;
            }
            return onSubmit(values);
          })}
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
  fields: { gap: 16 },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: palette.warmGray500 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  actions: { gap: 12 },
});
