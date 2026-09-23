import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, colors, radius, spacing } from '../../design-system';
import { useAssistantStrings } from '../strings';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Blank-conversation state with health starter prompts (port of chat-empty-state.tsx). */
export function EmptyState({ onPrompt, onVoice }: { onPrompt: (text: string) => void; onVoice: () => void }) {
  const s = useAssistantStrings();
  const prompts: { icon: IconName; text: string }[] = [
    { icon: 'thermometer-outline', text: s('promptSymptoms') },
    { icon: 'happy-outline', text: s('promptChild') },
    { icon: 'calendar-outline', text: s('promptBook') },
    { icon: 'shield-checkmark-outline', text: s('promptScheme') },
  ];

  return (
    <View style={styles.root}>
      <View style={styles.badge}>
        <Ionicons name="medkit" size={30} color={colors.primary} />
      </View>
      <Text variant="h2" align="center">
        {s('emptyTitle')}
      </Text>
      <Text variant="small" color="textSecondary" align="center" style={{ maxWidth: 320 }}>
        {s('emptyBody')}
      </Text>

      <Pressable
        onPress={onVoice}
        accessibilityRole="button"
        accessibilityLabel={s('startVoice')}
        style={({ pressed }) => [styles.voice, pressed && { backgroundColor: colors.primaryPressed }]}
      >
        <Ionicons name="mic" size={18} color={colors.textOnPrimary} />
        <Text variant="bodyMedium" style={{ color: colors.textOnPrimary }}>
          {s('startVoice')}
        </Text>
      </Pressable>

      <View style={styles.prompts}>
        {prompts.map((p) => (
          <Pressable
            key={p.text}
            onPress={() => onPrompt(p.text)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.prompt, pressed && { backgroundColor: colors.primaryTint }]}
          >
            <Ionicons name={p.icon} size={16} color={colors.primary} />
            <Text variant="small" style={{ flex: 1 }}>
              {p.text}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text variant="caption" color="textMuted" align="center">
        {s('disclaimer')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  voice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginVertical: spacing.sm,
  },
  prompts: { alignSelf: 'stretch', gap: spacing.sm },
  prompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
