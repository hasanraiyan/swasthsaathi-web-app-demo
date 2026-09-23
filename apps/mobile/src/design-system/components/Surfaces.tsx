import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '../tokens';
import { Text } from './Text';

type IconName = ComponentProps<typeof Ionicons>['name'];

/* ---------- Card ---------- */

export interface CardProps extends ViewProps {
  padding?: keyof typeof spacing;
  tone?: 'surface' | 'tint';
  onPress?: () => void;
}

export function Card({ padding = 'lg', tone = 'surface', onPress, style, children, ...rest }: CardProps) {
  const base: StyleProp<ViewStyle> = [
    styles.card,
    { padding: spacing[padding], backgroundColor: tone === 'tint' ? colors.primarySoft : colors.surface },
    tone === 'surface' && shadows.sm,
    style,
  ];
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.85 }]} {...rest}>
        {children}
      </Pressable>
    );
  }
  return (
    <View style={base} {...rest}>
      {children}
    </View>
  );
}

/* ---------- Chip ---------- */

export interface ChipProps {
  label: string;
  icon?: IconName;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, icon, selected, onPress, style }: ChipProps) {
  const fg = selected ? colors.primary : colors.textSecondary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primarySoft : colors.surface,
          borderColor: selected ? colors.primaryOutline : colors.border,
        },
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={15} color={fg} />}
      <Text variant="smallMedium" style={{ color: fg }}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- SlotPill (time / date selection) ---------- */

export interface SlotPillProps {
  label: string;
  sublabel?: string;
  selected?: boolean;
  /** Look of an unselected pill: filled gray (default) or white with a border. */
  idleTone?: 'muted' | 'outline';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SlotPill({ label, sublabel, selected, idleTone = 'muted', onPress, style }: SlotPillProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.slot, style, selected ? styles.slotSelected : idleTone === 'outline' ? styles.slotOutline : styles.slotIdle]}
    >
      {sublabel && (
        <Text variant="small" style={{ color: selected ? colors.primarySoft : colors.textMuted }}>
          {sublabel}
        </Text>
      )}
      <Text
        variant={sublabel ? 'h3' : 'smallMedium'}
        style={{ color: selected ? colors.textOnPrimary : colors.text }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- IconTile (specialty / feature tiles) ---------- */

export interface IconTileProps {
  icon: IconName;
  label: string;
  tint?: string;
  background?: string;
  onPress?: () => void;
}

export function IconTile({ icon, label, tint = colors.primary, background = colors.primarySoft, onPress }: IconTileProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.tile}>
      <View style={[styles.tileIcon, { backgroundColor: background }]}>
        <Ionicons name={icon} size={24} color={tint} />
      </View>
      <Text variant="caption" color="textSecondary" align="center" numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- Badge ---------- */

export function Badge({
  label,
  tone = 'success',
  dot,
}: {
  label: string;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  dot?: boolean;
}) {
  const map = {
    success: [colors.successSoft, colors.primary],
    warning: [colors.warningSoft, colors.warning],
    danger: [colors.dangerSoft, colors.danger],
    info: [colors.infoSoft, colors.info],
    neutral: [colors.surfaceMuted, colors.textSecondary],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {dot && <View style={[styles.badgeDot, { backgroundColor: fg }]} />}
      <Text variant="caption" style={{ color: fg }}>
        {label}
      </Text>
    </View>
  );
}

/* ---------- SectionHeader ---------- */

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="h3">{title}</Text>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text variant="smallMedium" color="primary">
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/* ---------- IconButton ---------- */

export function IconButton({
  icon,
  onPress,
  label,
  bordered = false,
}: {
  icon: IconName;
  onPress?: () => void;
  label: string;
  bordered?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconButton,
        bordered && styles.iconButtonBordered,
        pressed && { backgroundColor: colors.primaryTint },
      ]}
    >
      <Ionicons name={icon} size={22} color={colors.text} />
    </Pressable>
  );
}

/* ---------- Divider / Spacer ---------- */

export const Divider = () => <View style={styles.divider} />;
export const Spacer = ({ size = 'lg' }: { size?: keyof typeof spacing }) => <View style={{ height: spacing[size] }} />;

export function Row({ children, gap = 'sm', style }: { children: ReactNode; gap?: keyof typeof spacing; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: spacing[gap] }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  slot: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  slotIdle: { backgroundColor: colors.surfaceMuted, borderColor: colors.surfaceMuted },
  slotOutline: { backgroundColor: colors.surface, borderColor: colors.border },
  slotSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  tile: { width: 68, alignItems: 'center', gap: spacing.sm },
  tileIcon: { width: 56, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  iconButton: { width: 42, height: 42, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  iconButtonBordered: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  divider: { height: 1, backgroundColor: colors.border },
});
