import { Tabs, router, usePathname, useSegments } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsLargeScreen } from '../design-system';
import { Icon, Text, colors, fonts, layout, spacing } from '../design-system';

type IconName = ComponentProps<typeof Icon>['name'];

export interface TabDef {
  name: string;
  title: string;
  icon: IconName;
  iconActive: IconName;
}

/**
 * Bottom tab bar on phones/tablets; left sidebar rail on laptop/desktop
 * widths (web + large tablets in landscape). The expo-router `Tabs` navigator
 * still owns routing — on large screens its bottom bar is hidden and the
 * sidebar drives navigation to the same routes.
 */
export function RoleTabs({ tabs }: { tabs: TabDef[] }) {
  const insets = useSafeAreaInsets();
  const isLarge = useIsLargeScreen();

  return (
    <View style={styles.root}>
      {isLarge && <Sidebar tabs={tabs} />}
      <View style={styles.content}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
            tabBarStyle: isLarge
              ? { display: 'none' }
              : {
                  backgroundColor: colors.surface,
                  borderTopColor: colors.border,
                  height: layout.tabBarHeight + insets.bottom,
                  paddingTop: spacing.sm,
                  paddingBottom: insets.bottom + spacing.sm,
                },
            sceneStyle: { backgroundColor: colors.background },
          }}
        >
          {tabs.map((t) => (
            <Tabs.Screen
              key={t.name}
              name={t.name}
              options={{
                title: t.title,
                tabBarIcon: ({ focused, color, size }) => <Icon name={focused ? t.iconActive : t.icon} size={size - 2} color={color} />,
              }}
            />
          ))}
        </Tabs>
      </View>
    </View>
  );
}

function Sidebar({ tabs }: { tabs: TabDef[] }) {
  const segments = useSegments();
  const pathname = usePathname();
  const group = segments[0] ?? '(tabs)';

  const targetFor = (name: string) => (name === 'index' ? `/${group}` : `/${group}/${name}`);
  const isActive = (name: string) => {
    const target = targetFor(name);
    if (name === 'index') return pathname === target || pathname === `${target}/`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.brand}>
        <View style={styles.brandMark}>
          <Icon name="heart" size={20} color={colors.textOnPrimary} />
        </View>
        <View>
          <Text variant="title">SwasthSaathi</Text>
          <Text variant="caption" color="textSecondary">
            Health companion
          </Text>
        </View>
      </View>
      <View style={styles.nav}>
        {tabs.map((t) => {
          const active = isActive(t.name);
          return (
            <Pressable
              key={t.name}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => router.navigate(targetFor(t.name) as never)}
              style={[styles.navItem, active && styles.navItemActive]}
            >
              <Icon name={active ? t.iconActive : t.icon} size={20} color={active ? colors.primary : colors.textSecondary} />
              <Text variant="bodyMedium" style={{ color: active ? colors.text : colors.textSecondary }}>
                {t.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: colors.background },
  content: { flex: 1 },
  sidebar: {
    width: layout.sidebarWidth,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    gap: spacing.xl,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.sm },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: { gap: spacing.xs },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
  },
  navItemActive: { backgroundColor: colors.primaryTint },
});
