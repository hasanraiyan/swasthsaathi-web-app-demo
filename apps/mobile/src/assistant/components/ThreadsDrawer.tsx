import Ionicons from '@expo/vector-icons/Ionicons';
import type { PersonaThread } from '@personaai/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Pressable,
  SectionList,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, colors, radius, spacing } from '../../design-system';
import { useAssistantStrings } from '../strings';

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function when(iso: string) {
  const d = new Date(iso);
  if (isToday(iso)) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

/**
 * Left slide-in sidebar — the phone version of the example's thread sidebar
 * (persona-chat-view.tsx): new chat, every conversation grouped by day, delete,
 * and the Memory entry at the bottom.
 */
export function ThreadsDrawer({
  visible,
  onClose,
  threads,
  loading,
  activeThreadId,
  onSelect,
  onNew,
  onDelete,
  onOpenMemory,
}: {
  visible: boolean;
  onClose: () => void;
  threads: PersonaThread[];
  loading: boolean;
  activeThreadId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onOpenMemory: () => void;
}) {
  const s = useAssistantStrings();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(340, width * 0.84);

  // Stay mounted through the close animation.
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) setMounted(true);
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
  }, [progress, visible]);

  const sections = useMemo(() => {
    const sorted = [...threads].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const today = sorted.filter((t) => isToday(t.updatedAt));
    const earlier = sorted.filter((t) => !isToday(t.updatedAt));
    return [
      { title: s('today'), data: today },
      { title: s('earlier'), data: earlier },
    ].filter((sec) => sec.data.length > 0);
  }, [threads, s]);

  const run = (fn: () => void) => () => {
    fn();
    onClose();
  };

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: progress }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={s('close')} />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          {
            width: panelWidth,
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-panelWidth, 0] }) }],
          },
        ]}
      >
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="medkit" size={16} color={colors.primary} />
          </View>
          <Text variant="h3" style={{ flex: 1 }}>
            {s('title')}
          </Text>
          <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel={s('close')}>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Pressable
          onPress={run(onNew)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.newChat, pressed && { backgroundColor: colors.primaryPressed }]}
        >
          <Ionicons name="add" size={20} color={colors.textOnPrimary} />
          <Text variant="bodyMedium" style={{ color: colors.textOnPrimary }}>
            {s('newChat')}
          </Text>
        </Pressable>

        {loading && threads.length === 0 ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(t) => t._id}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: spacing.lg }}
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={
              <Text variant="small" color="textMuted" align="center" style={{ padding: spacing.xxl }}>
                {s('noThreads')}
              </Text>
            }
            renderSectionHeader={({ section }) => (
              <Text variant="caption" color="textMuted" style={styles.section}>
                {section.title.toUpperCase()}
              </Text>
            )}
            renderItem={({ item }) => {
              const active = item._id === activeThreadId;
              return (
                <Pressable
                  onPress={run(() => onSelect(item._id))}
                  style={({ pressed }) => [
                    styles.item,
                    active && styles.itemActive,
                    pressed && !active && { backgroundColor: colors.surfaceMuted },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <View style={{ flex: 1 }}>
                    <Text variant={active ? 'title' : 'body'} numberOfLines={1} color={active ? 'primary' : 'text'}>
                      {item.title || s('untitled')}
                    </Text>
                    <Text variant="caption" color="textMuted">
                      {when(item.updatedAt)}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => onDelete(item._id)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={s('delete')}
                    style={styles.trash}
                  >
                    <Ionicons name="trash-outline" size={17} color={colors.textMuted} />
                  </Pressable>
                </Pressable>
              );
            }}
          />
        )}

        <Pressable
          onPress={run(onOpenMemory)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.memory, pressed && { backgroundColor: colors.primaryTint }]}
        >
          <View style={[styles.logo, { backgroundColor: colors.accentSoft }]}>
            <Ionicons name="bulb-outline" size={16} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="title">{s('memory')}</Text>
            <Text variant="caption" color="textMuted">
              {s('memoryHint')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { backgroundColor: 'rgba(15, 61, 50, 0.3)' },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    borderTopRightRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xs, marginBottom: spacing.lg },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  section: { paddingHorizontal: spacing.sm, paddingTop: spacing.md, paddingBottom: spacing.xs, letterSpacing: 0.6 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  itemActive: { backgroundColor: colors.primaryTint },
  trash: { padding: spacing.sm },
  memory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderRadius: radius.md,
  },
});
