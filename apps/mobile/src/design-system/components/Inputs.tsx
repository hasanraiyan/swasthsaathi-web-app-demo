import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';
import { Text } from './Text';

export function SearchBar({ placeholder = 'Search', ...rest }: TextInputProps) {
  return (
    <View style={styles.search}>
      <Ionicons name="search-outline" size={20} color={colors.textMuted} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[typography.small, styles.searchInput]}
        {...rest}
      />
    </View>
  );
}

export function TextArea(props: TextInputProps) {
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor={colors.textDisabled}
      {...props}
      style={[typography.body, styles.textArea, props.style]}
    />
  );
}

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={styles.checkRow}
      hitSlop={6}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color={colors.textOnPrimary} />}
      </View>
      <Text variant="small" color="textSecondary">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 50,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.text, height: '100%', outlineStyle: 'none' } as never,
  textArea: {
    minHeight: 96,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  box: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
});
