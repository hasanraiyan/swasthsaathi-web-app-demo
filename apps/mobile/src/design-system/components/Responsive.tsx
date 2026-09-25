import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useBreakpoint } from '../breakpoints';
import { spacing } from '../tokens';

/**
 * `Columns` stacks children vertically on phones and places them
 * side-by-side on tablet+ widths. Each child gets equal width by default;
 * pass `ratios` (e.g. [2, 1]) to weight columns.
 */
export function Columns({
  children,
  ratios,
  gap = 'lg',
  breakpoint = 'tablet',
  style,
}: {
  children: ReactNode;
  ratios?: number[];
  gap?: keyof typeof spacing;
  breakpoint?: 'tablet' | 'laptop';
  style?: StyleProp<ViewStyle>;
}) {
  const bp = useBreakpoint();
  const order = { phone: 0, tablet: 1, laptop: 2, desktop: 3 } as const;
  const sideBySide = order[bp] >= order[breakpoint];
  const items = (Array.isArray(children) ? children.flat() : [children]).filter(Boolean) as ReactNode[];
  const total = ratios?.reduce((s, r) => s + r, 0) ?? items.length;

  return (
    <View style={[sideBySide ? { flexDirection: 'row', alignItems: 'flex-start' } : { flexDirection: 'column' }, { gap: spacing[gap] }, style]}>
      {items.map((c, i) => (
        <View key={i} style={sideBySide ? { flex: ratios ? (ratios[i] ?? 1) / total : 1 } : undefined}>
          {c}
        </View>
      ))}
    </View>
  );
}

/**
 * `CardGrid` lays children in a wrapping grid that adapts to width:
 * 1 column on phones, 2 on tablets, 3 on laptop+. Each card keeps a
 * readable minimum width instead of stretching full-bleed.
 */
export function CardGrid({
  children,
  minItemWidth = 300,
  gap = 'md',
  style,
}: {
  children: ReactNode;
  minItemWidth?: number;
  gap?: keyof typeof spacing;
  style?: StyleProp<ViewStyle>;
}) {
  const items = (Array.isArray(children) ? children.flat() : [children]).filter(Boolean) as ReactNode[];
  const g = spacing[gap];
  return (
    <View style={[styles.grid, { gap: g }, style]}>
      {items.map((c, i) => (
        <View key={i} style={[styles.cell, { minWidth: minItemWidth }]}>
          {c}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { flex: 1, flexBasis: 300 },
});
