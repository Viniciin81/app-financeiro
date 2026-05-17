/**
 * Campo de texto com label e mensagem de erro.
 *
 * Integra-se naturalmente com React Hook Form via `Controller`:
 *
 *   <Controller
 *     name="name"
 *     control={control}
 *     render={({ field, fieldState }) => (
 *       <TextField label="Nome" value={field.value} onChangeText={field.onChange}
 *         error={fieldState.error?.message} />
 *     )}
 *   />
 */
import { forwardRef } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { palette } from '@/tamagui.config';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, helperText, style, ...rest },
  ref,
) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={palette.warmGray400}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.warmGray500,
  },
  input: {
    backgroundColor: palette.warmGray50,
    borderWidth: 1,
    borderColor: palette.warmGray100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.warmGray700,
    minHeight: 52,
  },
  inputError: {
    borderColor: palette.brick,
  },
  error: {
    fontSize: 12,
    color: palette.brick,
  },
  helper: {
    fontSize: 12,
    color: palette.warmGray400,
  },
});
