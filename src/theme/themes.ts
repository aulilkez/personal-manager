import { colorTokens } from './tokens';

type ColorPalette = (typeof colorTokens)[keyof typeof colorTokens];

function createTheme(palette: ColorPalette) {
  return {
    ...palette,
    text: palette.foreground,
    backgroundElement: palette.surface,
    backgroundSelected: palette.surfaceHover,
    textSecondary: palette.mutedForeground,
  };
}

export const themes = {
  light: createTheme(colorTokens.light),
  dark: createTheme(colorTokens.dark),
} as const;

export type ThemeColor = keyof typeof themes.light & keyof typeof themes.dark;
