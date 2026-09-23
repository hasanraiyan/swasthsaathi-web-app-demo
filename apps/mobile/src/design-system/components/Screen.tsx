import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors, layout, spacing } from '../tokens';
import { IconButton } from './Surfaces';
import { Text } from './Text';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
}

/** Safe-area aware page wrapper. Content is capped at a readable width on web/tablets. */
export function Screen({ children, scroll = true, edges = ['top'], background = colors.background, contentStyle, footer }: ScreenProps) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, { flex: 1 }, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: background }]}>
      <View style={styles.column}>
        {body}
        {footer && <View style={styles.footer}>{footer}</View>}
      </View>
    </SafeAreaView>
  );
}

export function Header({
  title,
  right,
  onBack,
  centered,
  showBack = true,
}: {
  title?: string;
  right?: ReactNode;
  onBack?: () => void;
  centered?: boolean;
  showBack?: boolean;
}) {
  return (
    <View style={styles.header}>
      {showBack ? (
        <IconButton
          icon="arrow-back"
          label="Go back"
          onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
        />
      ) : (
        centered && <View style={styles.headerSlot} />
      )}
      <Text variant="h2" style={{ flex: 1, paddingLeft: showBack || centered ? 0 : spacing.sm }} align={centered ? 'center' : 'left'} numberOfLines={1}>
        {title}
      </Text>
      {right ?? (centered && <View style={styles.headerSlot} />)}
    </View>
  );
}

export { Ionicons as Icon };

const styles = StyleSheet.create({
  root: { flex: 1 },
  column: { flex: 1, width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
  content: { paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xxxl },
  footer: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.md, paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginHorizontal: -spacing.sm,
    minHeight: 64,
  },
  headerSlot: { width: 42 },
});
