/**
 * Controle segmentado (picker visual horizontal).
 * Uso: escolher tipo de conta, tipo de categoria, etc.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/tamagui.config';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

export type SegmentedProps<T extends string> = {
  value: T;
  onChange: (next: T) => void;
  options: SegmentedOption<T>[];
};

export function Segmented<T extends string>({ value, onChange, options }: SegmentedProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.item,
              active && styles.itemActive,
              pressed && !active && { opacity: 0.7 },
            ]}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={[styles.label, active && styles.labelActive]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: palette.warmGray50,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  item: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActive: {
    backgroundColor: palette.moss500,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: palette.warmGray500,
  },
  labelActive: {
    color: palette.cream,
    fontWeight: '600',
  },
});
