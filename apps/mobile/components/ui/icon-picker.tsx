/**
 * Picker visual de ícones (grid).
 *
 * Conjunto curado de ~30 ícones do Lucide cobrindo as categorias mais comuns
 * de finanças pessoais. Cada item é identificado por uma string que vai pro
 * banco — é o mesmo nome usado em `@tamagui/lucide-icons` em snake-case.
 */
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  Briefcase,
  Camera,
  Car,
  CircleEllipsis,
  CirclePlus,
  Coffee,
  CreditCard,
  Dumbbell,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Music,
  PawPrint,
  PiggyBank,
  Pizza,
  Plane,
  Receipt,
  Repeat,
  RotateCcw,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Utensils,
  Wallet,
  Wrench,
} from '@tamagui/lucide-icons';

import { palette } from '@/tamagui.config';

// Os ícones do @tamagui/lucide-icons aceitam `size: number` e `color: string`.
// Não usamos o tipo exato (não exportado) — tipamos manualmente.
type IconComponent = (props: { size?: number; color?: string }) => React.JSX.Element;

export type IconOption = {
  /** Identificador salvo no banco. */
  id: string;
  /** Label legível pra acessibilidade. */
  label: string;
  /** Componente Tamagui Lucide. */
  Component: IconComponent;
};

export const iconOptions: IconOption[] = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'utensils', label: 'Comer fora', Component: Utensils as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'shopping-cart', label: 'Mercado', Component: ShoppingCart as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'pizza', label: 'Delivery', Component: Pizza as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'coffee', label: 'Café', Component: Coffee as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'car', label: 'Transporte', Component: Car as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'plane', label: 'Viagem', Component: Plane as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'home', label: 'Casa', Component: Home as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'heart-pulse', label: 'Saúde', Component: HeartPulse as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'stethoscope', label: 'Médico', Component: Stethoscope as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'dumbbell', label: 'Esporte', Component: Dumbbell as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'gamepad-2', label: 'Lazer', Component: Gamepad2 as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'music', label: 'Música', Component: Music as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'camera', label: 'Fotos', Component: Camera as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'graduation-cap', label: 'Educação', Component: GraduationCap as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'shirt', label: 'Roupas', Component: Shirt as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'shopping-bag', label: 'Compras', Component: ShoppingBag as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'sparkles', label: 'Beleza', Component: Sparkles as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'paw-print', label: 'Pet', Component: PawPrint as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'gift', label: 'Presentes', Component: Gift as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'repeat', label: 'Recorrência', Component: Repeat as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'receipt', label: 'Impostos', Component: Receipt as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'wrench', label: 'Serviços', Component: Wrench as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'credit-card', label: 'Cartão', Component: CreditCard as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'wallet', label: 'Carteira', Component: Wallet as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'piggy-bank', label: 'Poupança', Component: PiggyBank as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'briefcase', label: 'Trabalho', Component: Briefcase as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'trending-up', label: 'Investimento', Component: TrendingUp as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'rotate-ccw', label: 'Reembolso', Component: RotateCcw as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'circle-plus', label: 'Entrada extra', Component: CirclePlus as any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id: 'circle-ellipsis', label: 'Outros', Component: CircleEllipsis as any },
];

export function getIconComponent(id: string | null | undefined): IconComponent | null {
  if (!id) return null;
  return iconOptions.find((o) => o.id === id)?.Component ?? null;
}

export function IconPicker({
  value,
  onChange,
  tint = palette.moss500,
}: {
  value: string | null | undefined;
  onChange: (id: string) => void;
  tint?: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}>
      <View style={styles.grid}>
        {iconOptions.map((opt) => {
          const Icon = opt.Component;
          const active = opt.id === value;
          return (
            <Pressable
              key={opt.id}
              accessibilityLabel={opt.label}
              onPress={() => onChange(opt.id)}
              style={({ pressed }) => [
                styles.cell,
                active && [styles.cellActive, { borderColor: tint }],
                pressed && !active && { opacity: 0.7 },
              ]}>
              <Icon size={22} color={active ? tint : palette.warmGray500} />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const CELL_SIZE = 44;
const styles = StyleSheet.create({
  scroll: { paddingVertical: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    maxWidth: (CELL_SIZE + 8) * 6,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: palette.warmGray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellActive: {
    backgroundColor: palette.cream,
  },
});
