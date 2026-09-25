import { useWindowDimensions } from 'react-native';

/**
 * Responsive breakpoints shared by the Expo app + web build.
 * Phone: handsets. Tablet: large tablets / small laptops.
 * Laptop/desktop: web build on a wide browser window.
 */
export const breakpoints = {
  tablet: 600,
  laptop: 1024,
  desktop: 1440,
} as const;

export type Breakpoint = 'phone' | 'tablet' | 'laptop' | 'desktop';

export function getBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.laptop) return 'laptop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'phone';
}

/** Current breakpoint derived from the window width (updates on resize/rotation). */
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  return getBreakpoint(width);
}

/** True on tablet and above — use for two-column layouts. */
export function useIsTabletUp(): boolean {
  return useBreakpoint() !== 'phone';
}

/** True on laptop/desktop widths — use for sidebar nav + multi-column pages. */
export function useIsLargeScreen(): boolean {
  const bp = useBreakpoint();
  return bp === 'laptop' || bp === 'desktop';
}

/**
 * Readable content width per breakpoint. The `Screen` wrapper uses this so
 * phones stay narrow while tablets/laptops use the extra space instead of a
 * thin centered phone column.
 */
export function contentMaxWidthFor(bp: Breakpoint, wide = false): number {
  if (wide) {
    switch (bp) {
      case 'desktop':
        return 1280;
      case 'laptop':
        return 1120;
      case 'tablet':
        return 760;
      default:
        return 560;
    }
  }
  switch (bp) {
    case 'desktop':
      return 1120;
    case 'laptop':
      return 960;
    case 'tablet':
      return 720;
    default:
      return 560;
  }
}

/** Content width for the current window. Pass `wide` for dashboards/lists. */
export function useContentMaxWidth(wide = false): number {
  const bp = useBreakpoint();
  return contentMaxWidthFor(bp, wide);
}

/**
 * Pick a grid column count for the current breakpoint.
 * Falls back to sensible auto-expansion when overrides are omitted.
 */
export function useGridColumns(base: number, tabletColumns?: number, desktopColumns?: number): number {
  const bp = useBreakpoint();
  if (bp === 'laptop' || bp === 'desktop') return desktopColumns ?? Math.min(base + 4, 8);
  if (bp === 'tablet') return tabletColumns ?? Math.min(base + 2, 6);
  return base;
}
