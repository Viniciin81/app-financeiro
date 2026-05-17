/**
 * Picker visual de cores (grid de swatches circulares).
 *
 * Paleta curada com cores quentes/sálvia do briefing + tons complementares.
 * Cada cor tem um label legível (acessibilidade) e um valor hex que vai pro banco.
 */
import { Pressable, StyleSheet, View } from 'react-native';

import { palette } from '@/tamagui.config';

export type ColorOption = {
  label: string;
  value: string; // hex
};

// Cores escolhidas pra contrastar bem com a UI clara e escura.
export const colorOptions: ColorOption[] = [
  // Verdes
  { label: 'Verde-musgo', value: palette.moss500 },
  { label: 'Verde-sálvia', value: palette.sage },
  { label: 'Verde-folha', value: palette.moss300 },
  { label: 'Oliva', value: palette.moss700 },
  // Vermelhos / Laranjas
  { label: 'Terracota', value: palette.terra500 },
  { label: 'Coral', value: palette.terra300 },
  { label: 'Tijolo', value: palette.brick },
  { label: 'Ferrugem', value: palette.terra700 },
  // Amarelos
  { label: 'Mostarda', value: palette.mustard },
  { label: 'Areia', value: '#D4B868' },
  // Azuis / Roxos (cores complementares fora da palette principal)
  { label: 'Azul-petróleo', value: '#3D6F7A' },
  { label: 'Azul-acinzentado', value: '#728A99' },
  { label: 'Ameixa', value: '#7D5A7D' },
  { label: 'Lavanda', value: '#A99BB8' },
  // Neutros
  { label: 'Cinza-quente', value: palette.warmGray400 },
  { label: 'Preto-fumaça', value: palette.smokeBlack },
];

export function ColorPicker({
  value,
  onChange,
}: {
  value: string | null | undefined;
  onChange: (hex: string) => void;
}) {
  return (
    <View style={styles.grid}>
      {colorOptions.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityLabel={opt.label}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.cell,
              pressed && !active && { opacity: 0.7 },
            ]}>
            <View style={[styles.swatch, { backgroundColor: opt.value }]} />
            {active ? <View style={styles.ring} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const CELL_SIZE = 36;
const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: CELL_SIZE - 8,
    height: CELL_SIZE - 8,
    borderRadius: (CELL_SIZE - 8) / 2,
  },
  ring: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    borderWidth: 2,
    borderColor: palette.warmGray700,
  },
});
