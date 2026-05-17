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
  type LucideIcon,
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
} from 'lucide-react-native';

import { palette } from '@/tamagui.config';

type IconComponent = LucideIcon;

export type IconOption = {
  /** Identificador salvo no banco. */
  id: string;
  /** Label legível pra acessibilidade. */
  label: string;
  /** Componente Tamagui Lucide. */
  Component: IconComponent;
};

export const iconOptions: IconOption[] = [
  { id: 'utensils', label: 'Comer fora', Component: Utensils },
  { id: 'shopping-cart', label: 'Mercado', Component: ShoppingCart },
  { id: 'pizza', label: 'Delivery', Component: Pizza },
  { id: 'coffee', label: 'Café', Component: Coffee },
  { id: 'car', label: 'Transporte', Component: Car },
  { id: 'plane', label: 'Viagem', Component: Plane },
  { id: 'home', label: 'Casa', Component: Home },
  { id: 'heart-pulse', label: 'Saúde', Component: HeartPulse },
  { id: 'stethoscope', label: 'Médico', Component: Stethoscope },
  { id: 'dumbbell', label: 'Esporte', Component: Dumbbell },
  { id: 'gamepad-2', label: 'Lazer', Component: Gamepad2 },
  { id: 'music', label: 'Música', Component: Music },
  { id: 'camera', label: 'Fotos', Component: Camera },
  { id: 'graduation-cap', label: 'Educação', Component: GraduationCap },
  { id: 'shirt', label: 'Roupas', Component: Shirt },
  { id: 'shopping-bag', label: 'Compras', Component: ShoppingBag },
  { id: 'sparkles', label: 'Beleza', Component: Sparkles },
  { id: 'paw-print', label: 'Pet', Component: PawPrint },
  { id: 'gift', label: 'Presentes', Component: Gift },
  { id: 'repeat', label: 'Recorrência', Component: Repeat },
  { id: 'receipt', label: 'Impostos', Component: Receipt },
  { id: 'wrench', label: 'Serviços', Component: Wrench },
  { id: 'credit-card', label: 'Cartão', Component: CreditCard },
  { id: 'wallet', label: 'Carteira', Component: Wallet },
  { id: 'piggy-bank', label: 'Poupança', Component: PiggyBank },
  { id: 'briefcase', label: 'Trabalho', Component: Briefcase },
  { id: 'trending-up', label: 'Investimento', Component: TrendingUp },
  { id: 'rotate-ccw', label: 'Reembolso', Component: RotateCcw },
  { id: 'circle-plus', label: 'Entrada extra', Component: CirclePlus },
  { id: 'circle-ellipsis', label: 'Outros', Component: CircleEllipsis },
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
