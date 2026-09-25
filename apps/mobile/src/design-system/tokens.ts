import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/**
 * SwasthSaathi design tokens.
 * Every color, size and radius used in the app comes from here.
 */

const palette = {
  green900: '#0F3D32',
  green800: '#134A3D',
  green700: '#17594A',
  green600: '#1F6B58',
  green500: '#2F8A6F',
  green400: '#5BAA8F',
  green200: '#BFE1D2',
  green100: '#DDF0E7',
  green50: '#EEF7F2',

  gray900: '#111827',
  gray700: '#374151',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray300: '#D1D5DB',
  gray200: '#E6ECE9',
  gray100: '#F1F5F3',
  white: '#FFFFFF',

  red500: '#E5534B',
  red50: '#FDECEC',
  amber500: '#F5A623',
  amber50: '#FEF4E2',
  blue500: '#3B82F6',
  blue50: '#EAF2FE',
  violet500: '#8B5CF6',
  violet50: '#F2EDFE',
} as const;

export const colors = {
  primary: palette.green700,
  primaryPressed: palette.green800,
  primaryMuted: palette.green500,
  primarySoft: palette.green100,
  primaryTint: palette.green50,
  primaryOutline: palette.green200,
  illustration: palette.green400,

  background: '#F7FAF8',
  surface: palette.white,
  surfaceMuted: palette.gray100,
  border: palette.gray200,
  borderStrong: palette.gray300,

  text: palette.gray900,
  textSecondary: palette.gray600,
  textMuted: palette.gray500,
  textDisabled: palette.gray400,
  textOnPrimary: palette.white,

  danger: palette.red500,
  dangerSoft: palette.red50,
  warning: palette.amber500,
  warningSoft: palette.amber50,
  info: palette.blue500,
  infoSoft: palette.blue50,
  accent: palette.violet500,
  accentSoft: palette.violet50,
  star: palette.amber500,
  success: palette.green500,
  successSoft: palette.green100,

  palette,
} as const;

/** 4pt spacing scale */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

export const typography = {
  display: { fontFamily: fonts.extrabold, fontSize: 40, lineHeight: 46, letterSpacing: -1 },
  h1: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 32, letterSpacing: -0.4 },
  h2: { fontFamily: fonts.bold, fontSize: 21, lineHeight: 28, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24 },
  title: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  smallMedium: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14 },
  button: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
export type ColorToken = Exclude<keyof typeof colors, 'palette'>;

const shadow = (elevation: number, opacity: number, radiusPx: number, y: number): ViewStyle =>
  Platform.select<ViewStyle>({
    web: { boxShadow: `0px ${y}px ${radiusPx}px rgba(16, 61, 50, ${opacity})` } as ViewStyle,
    default: {
      shadowColor: palette.green900,
      shadowOpacity: opacity,
      shadowRadius: radiusPx,
      shadowOffset: { width: 0, height: y },
      elevation,
    },
  })!;

export const shadows = {
  none: {} as ViewStyle,
  sm: shadow(1, 0.05, 6, 2),
  md: shadow(3, 0.08, 14, 4),
  lg: shadow(6, 0.12, 24, 8),
} as const;

export const layout = {
  screenPadding: spacing.xl,
  /** Narrow default kept for backwards-compat; prefer breakpoint-aware widths. */
  maxContentWidth: 560,
  /** Window-width breakpoints (see design-system/breakpoints.ts). */
  breakpoints: { tablet: 600, laptop: 1024, desktop: 1440 },
  /** Readable content widths per breakpoint. */
  contentWidths: { phone: 560, tablet: 720, laptop: 960, desktop: 1120 },
  /** Extra-wide width for dashboards / lists on laptop+. */
  wideContentWidths: { phone: 560, tablet: 760, laptop: 1120, desktop: 1280 },
  /** Left sidebar width used instead of bottom tabs on laptop+. */
  sidebarWidth: 248,
  tabBarHeight: 64,
} as const;

export const theme = { colors, spacing, radius, fonts, typography, shadows, layout };
export type Theme = typeof theme;
