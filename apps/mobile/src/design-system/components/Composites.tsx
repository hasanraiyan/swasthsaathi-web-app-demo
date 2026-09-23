import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Image, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../tokens';
import { Text } from './Text';

type IconName = ComponentProps<typeof Ionicons>['name'];

/* ---------- SegmentedControl (Upcoming / Past / Cancelled) ---------- */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segmented} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text variant="smallMedium" style={{ color: active ? colors.textOnPrimary : colors.textSecondary }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- UnderlineTabs (Overview / Reviews / ...) ---------- */

export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.underlineRow} accessibilityRole="tablist">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <Pressable
            key={t.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(t.value)}
            style={[styles.underlineTab, active && styles.underlineTabActive]}
          >
            <Text variant={active ? 'title' : 'bodyMedium'} color={active ? 'text' : 'textMuted'}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Tag (static pill) ---------- */

export function Tag({ label, tone = 'tint' }: { label: string; tone?: 'tint' | 'muted' }) {
  return (
    <View style={[styles.tag, { backgroundColor: tone === 'tint' ? colors.primaryTint : colors.surfaceMuted }]}>
      <Text variant="small" color={tone === 'tint' ? 'primary' : 'textSecondary'}>
        {label}
      </Text>
    </View>
  );
}

export function TagList({ items, tone }: { items: string[]; tone?: 'tint' | 'muted' }) {
  return (
    <View style={styles.tagList}>
      {items.map((i) => (
        <Tag key={i} label={i} tone={tone} />
      ))}
    </View>
  );
}

/* ---------- StatTile ---------- */

export function StatTile({
  value,
  label,
  icon,
  iconColor = colors.primary,
  onPress,
}: {
  value: string | number;
  label: string;
  icon?: IconName;
  iconColor?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.stat}>
      {icon && <Ionicons name={icon} size={24} color={iconColor} />}
      {icon ? (
        <>
          <Text variant="caption" color="textSecondary" align="center" numberOfLines={1}>
            {label}
          </Text>
          <Text variant="h3" align="center">
            {value}
          </Text>
        </>
      ) : (
        <>
          <Text variant="h2" align="center">
            {value}
          </Text>
          <Text variant="caption" color="textSecondary" align="center">
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

/* ---------- ListItem (menu rows) ---------- */

export function ListItem({
  icon,
  label,
  onPress,
  right,
  destructive,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  right?: ReactNode;
  destructive?: boolean;
}) {
  const fg = destructive ? colors.danger : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.listItem, pressed && { backgroundColor: colors.primaryTint }]}
    >
      <Ionicons name={icon} size={21} color={fg} />
      <Text variant="bodyMedium" style={{ flex: 1, color: fg }}>
        {label}
      </Text>
      {right ?? (!destructive && <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />)}
    </Pressable>
  );
}

/* ---------- Avatar (image or initials) ---------- */

export function Avatar({ name, imageUrl, size = 72 }: { name: string; imageUrl?: string | null; size?: number }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
  const shape = { width: size, height: size, borderRadius: size / 2 };
  if (imageUrl) return <Image source={{ uri: imageUrl }} style={shape} />;
  return (
    <View style={[shape, { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: size * 0.34, color: colors.primary }}>{initials}</Text>
    </View>
  );
}

/* ---------- ActionTile (Add to Calendar / Directions / Share) ---------- */

export function ActionTile({ icon, label, onPress }: { icon: IconName; label: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.actionTile, pressed && { backgroundColor: colors.primaryTint }]}
    >
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text variant="caption" color="textSecondary" align="center">
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- InfoRow (icon + title + subtitle) ---------- */

export function InfoRow({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color={colors.text} style={{ marginTop: 1 }} />
      <View style={{ flex: 1 }}>
        <Text variant="bodyMedium">{title}</Text>
        {subtitle && (
          <Text variant="small" color="textSecondary">
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}

/* ---------- RadioOption ---------- */

export function RadioOption({
  label,
  sublabel,
  icon,
  selected,
  onPress,
  variant = 'row',
  style,
}: {
  label: string;
  sublabel?: string;
  icon?: IconName;
  selected: boolean;
  onPress: () => void;
  variant?: 'row' | 'card';
  style?: StyleProp<ViewStyle>;
}) {
  const radio = (
    <View style={[styles.radio, selected && styles.radioOn]}>{selected && <View style={styles.radioDot} />}</View>
  );
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        variant === 'card' ? styles.radioCard : styles.radioRow,
        selected && { backgroundColor: colors.primaryTint, borderColor: colors.primaryOutline },
        style,
      ]}
    >
      {variant === 'row' && radio}
      {icon && <Ionicons name={icon} size={22} color={selected ? colors.primary : colors.textSecondary} />}
      <View style={{ flex: 1 }}>
        <Text variant="smallMedium">{label}</Text>
        {sublabel && (
          <Text variant="caption" color="textMuted">
            {sublabel}
          </Text>
        )}
      </View>
      {variant === 'card' && radio}
    </Pressable>
  );
}

/* ---------- DashedButton ---------- */

export function DashedButton({ label, icon = 'add', onPress }: { label: string; icon?: IconName; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.dashed, pressed && { backgroundColor: colors.primaryTint }]}
    >
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text variant="bodyMedium" color="primary">
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- SmallAction (Reschedule / Cancel / Directions) ---------- */

export function SmallAction({
  icon,
  label,
  onPress,
  tone = 'default',
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  tone?: 'default' | 'danger';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.smallAction, pressed && { backgroundColor: colors.primaryTint }]}
    >
      <Ionicons name={icon} size={15} color={tone === 'danger' ? colors.danger : colors.text} />
      <Text variant="caption" style={{ fontSize: 12 }} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  segmented: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  segment: { flex: 1, height: 38, borderRadius: radius.sm + 2, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: colors.primary },
  underlineRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.xl },
  underlineTab: { paddingVertical: spacing.md, borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1 },
  underlineTabActive: { borderBottomColor: colors.primary },
  tag: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: radius.pill },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xs },
  actionTile: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  radioCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    minHeight: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dashed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: colors.primaryOutline,
    backgroundColor: colors.surface,
  },
  smallAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 36,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
