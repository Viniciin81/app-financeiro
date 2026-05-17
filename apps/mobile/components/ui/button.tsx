/**
 * Botão base do design system.
 *
 * Variantes: primary | secondary | ghost | danger.
 * Tamanhos: md (padrão) | sm.
 *
 * Usa palette do Tamagui (cores do briefing) sem depender dos componentes
 * Tamagui propriamente — TS strict ainda não está bem reconciliado com
 * o TamaguiCustomConfig (tech debt registrada).
 */
import type { PressableProps } from 'react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/tamagui.config';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'sm';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  style,
  ...rest
}: ButtonProps) {
  const palette_ = paletteFor(variant);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: palette_.bg, borderColor: palette_.border },
        state.pressed && !isDisabled && { opacity: 0.85 },
        isDisabled && { opacity: 0.5 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={palette_.fg} />
      ) : (
        <View style={styles.row}>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <Text style={[styles.label, { color: palette_.fg }, size === 'sm' && styles.labelSm]}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function paletteFor(variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
      return { bg: palette.moss500, fg: palette.cream, border: palette.moss500 };
    case 'secondary':
      return { bg: palette.warmGray50, fg: palette.warmGray700, border: palette.warmGray100 };
    case 'ghost':
      return { bg: 'transparent', fg: palette.moss500, border: 'transparent' };
    case 'danger':
      return { bg: palette.brick, fg: palette.cream, border: palette.brick };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: { paddingVertical: 14, paddingHorizontal: 20, minHeight: 52 },
  sm: { paddingVertical: 10, paddingHorizontal: 14, minHeight: 40 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: {},
  label: { fontSize: 16, fontWeight: '600' },
  labelSm: { fontSize: 14 },
});
