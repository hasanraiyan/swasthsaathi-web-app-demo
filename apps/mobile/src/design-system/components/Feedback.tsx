import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';
import { Badge } from './Surfaces';
import { Text } from './Text';

type IconName = ComponentProps<typeof Ionicons>['name'];
type Tone = 'info' | 'success' | 'warning' | 'danger';

const toneColors: Record<Tone, { bg: string; fg: string; icon: IconName }> = {
  info: { bg: colors.infoSoft, fg: colors.info, icon: 'information-circle' },
  success: { bg: colors.successSoft, fg: colors.primary, icon: 'checkmark-circle' },
  warning: { bg: colors.warningSoft, fg: '#B7791F', icon: 'warning' },
  danger: { bg: colors.dangerSoft, fg: colors.danger, icon: 'alert-circle' },
};

/* ---------- Banner (inline alert) ---------- */

export function Banner({
  tone = 'info',
  title,
  body,
  icon,
  action,
  onAction,
  style,
}: {
  tone?: Tone;
  title: string;
  body?: string;
  icon?: IconName;
  action?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const t = toneColors[tone];
  return (
    <View style={[styles.banner, { backgroundColor: t.bg }, style]} accessibilityRole="alert">
      <Ionicons name={icon ?? t.icon} size={22} color={t.fg} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="title" style={{ color: t.fg }}>
          {title}
        </Text>
        {body && (
          <Text variant="small" color="textSecondary">
            {body}
          </Text>
        )}
      </View>
      {action && (
        <Pressable onPress={onAction} hitSlop={8} style={[styles.bannerAction, { borderColor: t.fg }]}>
          <Text variant="smallMedium" style={{ color: t.fg }}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/* ---------- RiskBadge ---------- */

export function RiskBadge({ risk }: { risk: 'high' | 'medium' | 'low' }) {
  const map = { high: ['High risk', 'danger'], medium: ['Medium risk', 'warning'], low: ['Low risk', 'success'] } as const;
  const [label, tone] = map[risk];
  return <Badge label={label} tone={tone} dot />;
}

export function UrgencyBadge({ level }: { level: 'emergency' | 'urgent' | 'routine' }) {
  const map = { emergency: ['Emergency', 'danger'], urgent: ['Urgent', 'warning'], routine: ['Routine', 'info'] } as const;
  const [label, tone] = map[level];
  return <Badge label={label} tone={tone} dot />;
}

/* ---------- ProgressBar ---------- */

export function ProgressBar({ value, tone = 'success', height = 8 }: { value: number; tone?: Tone; height?: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={[styles.track, { height, borderRadius: height / 2 }]}
    >
      <View style={{ width: `${pct}%`, height, borderRadius: height / 2, backgroundColor: toneColors[tone].fg }} />
    </View>
  );
}

/* ---------- Stepper (vertical status timeline) ---------- */

export function Stepper({
  steps,
  currentIndex,
}: {
  steps: { label: string; meta?: string; note?: string }[];
  currentIndex: number;
}) {
  return (
    <View>
      {steps.map((s, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        const last = i === steps.length - 1;
        return (
          <View key={s.label} style={styles.step}>
            <View style={{ alignItems: 'center' }}>
              <View
                style={[
                  styles.stepDot,
                  done && { backgroundColor: colors.primary, borderColor: colors.primary },
                  current && { borderColor: colors.primary, borderWidth: 3 },
                ]}
              >
                {done && <Ionicons name="checkmark" size={12} color={colors.textOnPrimary} />}
              </View>
              {!last && <View style={[styles.stepLine, done && { backgroundColor: colors.primary }]} />}
            </View>
            <View style={{ flex: 1, paddingBottom: last ? 0 : spacing.lg }}>
              <Text variant={current ? 'title' : 'bodyMedium'} color={done || current ? 'text' : 'textMuted'}>
                {s.label}
              </Text>
              {s.meta && (
                <Text variant="small" color="textMuted">
                  {s.meta}
                </Text>
              )}
              {s.note && (
                <Text variant="small" color="textSecondary">
                  {s.note}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/* ---------- QuickAction (service grid tile) ---------- */

export function QuickAction({
  icon,
  label,
  tint = colors.primary,
  background = colors.primarySoft,
  onPress,
  badge,
}: {
  icon: IconName;
  label: string;
  tint?: string;
  background?: string;
  onPress?: () => void;
  badge?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.quick, pressed && { backgroundColor: colors.primaryTint }]}
    >
      <View style={[styles.quickIcon, { backgroundColor: background }]}>
        <Ionicons name={icon} size={24} color={tint} />
        {badge && (
          <View style={styles.quickBadge}>
            <Text variant="caption" style={{ color: colors.textOnPrimary, fontSize: 10 }}>
              {badge}
            </Text>
          </View>
        )}
      </View>
      <Text variant="caption" align="center" numberOfLines={2} style={{ color: colors.text }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Grid({ children, columns = 4 }: { children: ReactNode; columns?: number }) {
  return <View style={styles.grid}>{wrapGrid(children, columns)}</View>;
}

function wrapGrid(children: ReactNode, columns: number) {
  const items = Array.isArray(children) ? children.flat() : [children];
  return items.filter(Boolean).map((c, i) => (
    <View key={i} style={{ width: `${100 / columns}%`, padding: spacing.xs }}>
      {c}
    </View>
  ));
}

/* ---------- Field (labelled text input) ---------- */

export function Field({ label, hint, error, ...input }: TextInputProps & { label: string; hint?: string; error?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: spacing.xs }}>
      <Text variant="smallMedium">{label}</Text>
      <TextInput
        placeholderTextColor={colors.textDisabled}
        {...input}
        onFocus={(e) => {
          setFocused(true);
          input.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          input.onBlur?.(e);
        }}
        style={[
          typography.body,
          styles.field,
          focused && { borderColor: colors.primary },
          !!error && { borderColor: colors.danger },
          input.multiline && { minHeight: 88, textAlignVertical: 'top', paddingTop: spacing.md },
          input.style,
        ]}
      />
      {(error || hint) && (
        <Text variant="caption" style={{ color: error ? colors.danger : colors.textMuted }}>
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}

/* ---------- OptionChips (single-select, wrapping) ---------- */

export function OptionChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.chips} accessibilityRole="radiogroup">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            onPress={() => onChange(o.value)}
            style={[styles.optChip, active && styles.optChipActive]}
          >
            <Text variant="smallMedium" style={{ color: active ? colors.textOnPrimary : colors.text }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- KpiCard (headline number with trend) ---------- */

export function KpiCard({
  label,
  value,
  unit,
  delta,
  goodWhen = 'up',
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  goodWhen?: 'up' | 'down';
  icon?: IconName;
}) {
  const good = delta === undefined ? undefined : goodWhen === 'up' ? delta >= 0 : delta <= 0;
  return (
    <View style={styles.kpi}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        {icon && <Ionicons name={icon} size={16} color={colors.textSecondary} />}
        <Text variant="caption" color="textSecondary" numberOfLines={1} style={{ flex: 1 }}>
          {label}
        </Text>
      </View>
      <Text variant="h1">
        {value}
        {unit && (
          <Text variant="small" color="textSecondary">
            {' '}
            {unit}
          </Text>
        )}
      </Text>
      {delta !== undefined && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Ionicons name={delta >= 0 ? 'arrow-up' : 'arrow-down'} size={12} color={good ? colors.primary : colors.danger} />
          <Text variant="caption" style={{ color: good ? colors.primary : colors.danger }}>
            {Math.abs(delta)}
            {typeof value === 'string' && value.endsWith('%') ? ' pts' : ''} vs last week
          </Text>
        </View>
      )}
    </View>
  );
}

/* ---------- BarChart (single series, tap a bar for its value) ---------- */

export function BarChart({
  data,
  height = 140,
  highlightLast = true,
  formatValue = (v: number) => String(v),
}: {
  data: { label: string; value: number }[];
  height?: number;
  highlightLast?: boolean;
  formatValue?: (v: number) => string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  const shown = active ?? (highlightLast ? data.length - 1 : null);

  return (
    <View>
      <View style={[styles.chart, { height }]}>
        {[0.5, 1].map((f) => (
          <View key={f} style={[styles.gridLine, { bottom: height * f - 1 }]} />
        ))}
        {data.map((d, i) => {
          const h = Math.max(4, (d.value / max) * (height - 22));
          const isShown = i === shown;
          return (
            <Pressable
              key={d.label}
              accessibilityRole="button"
              accessibilityLabel={`${d.label}: ${formatValue(d.value)}`}
              onPress={() => setActive(i === active ? null : i)}
              style={styles.barSlot}
            >
              {isShown && (
                <Text variant="caption" style={{ marginBottom: 4 }}>
                  {formatValue(d.value)}
                </Text>
              )}
              <View
                style={[
                  styles.bar,
                  { height: h, backgroundColor: isShown ? colors.primary : colors.primaryOutline },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.axis}>
        {data.map((d) => (
          <Text key={d.label} variant="caption" color="textMuted" align="center" style={{ flex: 1 }}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

/* ---------- StatusRow (status is icon + label, never colour alone) ---------- */

export function StatusRow({ label, status }: { label: string; status: 'working' | 'low' | 'down' }) {
  const map = {
    working: { icon: 'checkmark-circle' as IconName, color: colors.primary, text: 'Working' },
    low: { icon: 'warning' as IconName, color: '#B7791F', text: 'Running low' },
    down: { icon: 'close-circle' as IconName, color: colors.danger, text: 'Not working' },
  }[status];
  return (
    <View style={styles.statusRow}>
      <Text variant="bodyMedium" style={{ flex: 1 }}>
        {label}
      </Text>
      <Ionicons name={map.icon} size={16} color={map.color} />
      <Text variant="small" style={{ color: map.color }}>
        {map.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.md },
  bannerAction: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  track: { backgroundColor: colors.surfaceMuted, overflow: 'hidden', width: '100%' },
  step: { flexDirection: 'row', gap: spacing.md },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 2 },
  quick: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderRadius: radius.md },
  quickIcon: { width: 54, height: 54, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  quickBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs },
  field: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  optChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  kpi: {
    flex: 1,
    minWidth: 140,
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, position: 'relative' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colors.border },
  barSlot: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%', paddingHorizontal: 3 },
  bar: { width: '100%', maxWidth: 28, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  axis: { flexDirection: 'row', gap: 2, marginTop: spacing.xs },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm },
});
