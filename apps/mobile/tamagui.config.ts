/**
 * Tamagui config para o app-financeiro.
 *
 * Paleta baseada na seção 5 do briefing (a refinar durante a Fase 10):
 * - Primária: verde-musgo
 * - Secundária: terracota / coral suave
 * - Neutros: off-white, cinza-quente, preto-fumaça
 * - Semânticas: verde-sálvia (positivo), vermelho-tijolo (negativo), amarelo-mostarda (alerta)
 *
 * No Tamagui v4 as cores ficam nos `themes` (não em `tokens.color`), então definimos
 * a paleta como constantes locais e aplicamos nos temas light/dark.
 */
import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

// --- Paleta bruta ---
export const palette = {
  // Verde-musgo (primária)
  moss50: '#F4F7F1',
  moss100: '#E2EBDB',
  moss200: '#C6D7B8',
  moss300: '#A4BD8F',
  moss400: '#82A268',
  moss500: '#5F8348',
  moss600: '#4B6939',
  moss700: '#3A512D',
  moss800: '#2A3A21',
  moss900: '#1B2516',

  // Terracota (secundária)
  terra50: '#FBF1ED',
  terra100: '#F4D9CC',
  terra200: '#E9B69E',
  terra300: '#DE9170',
  terra400: '#D26F47',
  terra500: '#B65530',
  terra600: '#8F4225',
  terra700: '#6A311C',
  terra800: '#472113',
  terra900: '#2A130B',

  // Neutros quentes
  cream: '#FAF7F2',
  warmGray50: '#F2EFE9',
  warmGray100: '#E3DED3',
  warmGray200: '#C8C1B2',
  warmGray300: '#A39B89',
  warmGray400: '#7D7665',
  warmGray500: '#5C5648',
  warmGray600: '#403B30',
  warmGray700: '#2A261D',
  warmGray800: '#1A1812',
  smokeBlack: '#0F0E0A',

  // Semânticas
  sage: '#739E72',
  brick: '#A8442C',
  mustard: '#C9A227',
} as const;

const lightTheme = {
  ...defaultConfig.themes.light,
  background: palette.cream,
  backgroundHover: palette.warmGray50,
  backgroundPress: palette.warmGray100,
  backgroundFocus: palette.warmGray50,
  color: palette.warmGray700,
  colorHover: palette.smokeBlack,
  colorPress: palette.smokeBlack,
  colorFocus: palette.smokeBlack,
  borderColor: palette.warmGray100,
  borderColorHover: palette.warmGray200,
  // semânticas custom (acessíveis via $primary, $negative, etc.)
  primary: palette.moss500,
  primaryFg: palette.cream,
  secondary: palette.terra500,
  secondaryFg: palette.cream,
  positive: palette.sage,
  negative: palette.brick,
  warning: palette.mustard,
  muted: palette.warmGray400,
};

const darkTheme = {
  ...defaultConfig.themes.dark,
  background: palette.smokeBlack,
  backgroundHover: palette.warmGray800,
  backgroundPress: palette.warmGray700,
  backgroundFocus: palette.warmGray800,
  color: palette.warmGray100,
  colorHover: palette.cream,
  colorPress: palette.cream,
  colorFocus: palette.cream,
  borderColor: palette.warmGray700,
  borderColorHover: palette.warmGray600,
  primary: palette.moss300,
  primaryFg: palette.smokeBlack,
  secondary: palette.terra300,
  secondaryFg: palette.smokeBlack,
  positive: palette.sage,
  negative: palette.brick,
  warning: palette.mustard,
  muted: palette.warmGray400,
};

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: lightTheme,
    dark: darkTheme,
  },
});

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default tamaguiConfig;
