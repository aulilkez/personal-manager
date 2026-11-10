export const colorTokens = {
  light: {
    background: '#FAFAFA',
    foreground: '#18181B',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceHover: '#F4F4F5',
    border: '#E4E4E7',
    muted: '#F4F4F5',
    mutedForeground: '#71717A',
    subtleForeground: '#A1A1AA',
    primary: '#18181B',
    primaryForeground: '#FAFAFA',
    success: '#059669',
    danger: '#DC2626',
    warning: '#D97706',
    info: '#2563EB',
    accentViolet: '#7C3AED',
    violetSurface: '#F3E8FF',
    blueSurface: '#DBEAFE',
    greenSurface: '#D1FAE5',
    amberSurface: '#FEF3C7',
  },
  dark: {
    background: '#09090B',
    foreground: '#FAFAFA',
    surface: '#18181B',
    surfaceElevated: '#202024',
    surfaceHover: '#27272A',
    border: '#3F3F46',
    muted: '#27272A',
    mutedForeground: '#A1A1AA',
    subtleForeground: '#71717A',
    primary: '#FAFAFA',
    primaryForeground: '#09090B',
    success: '#34D399',
    danger: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
    accentViolet: '#A78BFA',
    violetSurface: '#21182D',
    blueSurface: '#162331',
    greenSurface: '#15271F',
    amberSurface: '#2A2112',
  },
} as const;

export const spacing = {
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  eight: 32,
  ten: 40,
} as const;

export const radii = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  full: 9999,
} as const;

export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '700' },
  heading1: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  heading2: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  heading3: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  caption: { fontSize: 11, lineHeight: 16, fontWeight: '400' },
} as const;

export const motion = {
  fast: 140,
  standard: 200,
} as const;
