import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  iconRight?: ComponentProps<typeof Ionicons>['name'];
  iconLeft?: ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

const variantStyles: Record<Variant, { bg: string; bgPressed: string; fg: string; border?: string }> = {
  primary: { bg: colors.primary, bgPressed: colors.primaryPressed, fg: colors.textOnPrimary },
  secondary: { bg: colors.primarySoft, bgPressed: colors.primaryOutline, fg: colors.primary },
  outline: { bg: colors.surface, bgPressed: colors.primaryTint, fg: colors.primary, border: colors.primaryOutline },
  ghost: { bg: 'transparent', bgPressed: colors.primaryTint, fg: colors.primary },
};

const sizeStyles: Record<Size, { height: number; px: number; font: number; icon: number }> = {
  sm: { height: 36, px: spacing.lg, font: 14, icon: 16 },
  md: { height: 48, px: spacing.xl, font: 15, icon: 18 },
  lg: { height: 58, px: spacing.xxl, font: 17, icon: 20 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading,
  disabled,
  fullWidth,
  style,
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: s.height,
          paddingHorizontal: s.px,
          backgroundColor: pressed ? v.bgPressed : v.bg,
          borderColor: v.border ?? 'transparent',
          opacity: isDisabled ? 0.55 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.row}>
          {iconLeft && <Ionicons name={iconLeft} size={s.icon} color={v.fg} />}
          <Text style={[typography.button, { fontSize: s.font, color: v.fg }]}>{label}</Text>
          {iconRight && <Ionicons name={iconRight} size={s.icon} color={v.fg} />}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
