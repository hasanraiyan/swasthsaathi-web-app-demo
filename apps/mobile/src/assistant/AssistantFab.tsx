import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout, shadows, spacing } from '../design-system';
import { useAssistantStrings } from './strings';

/**
 * Floating button above the patient tab bar. Tap opens the assistant in chat;
 * long-press opens it straight into a voice call.
 */
export function AssistantFab() {
  const s = useAssistantStrings();
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={s('open')}
      accessibilityHint="Long press to start a voice call"
      onPress={() => router.push('/assistant')}
      onLongPress={() => router.push({ pathname: '/assistant', params: { mode: 'voice' } })}
      style={({ pressed }) => [
        styles.fab,
        shadows.lg,
        { bottom: layout.tabBarHeight + insets.bottom + spacing.lg },
        pressed && { backgroundColor: colors.primaryPressed, transform: [{ scale: 0.96 }] },
      ]}
    >
      <Ionicons name="chatbubble-ellipses" size={26} color={colors.textOnPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
