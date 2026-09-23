import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, colors, fonts, layout, spacing } from '../design-system';

type IconName = ComponentProps<typeof Icon>['name'];

export interface TabDef {
  name: string;
  title: string;
  icon: IconName;
  iconActive: IconName;
}

/** Bottom tab bar used by every role. Height includes the device's bottom inset (gesture bar / 3-button nav). */
export function RoleTabs({ tabs }: { tabs: TabDef[] }) {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarStyle: {
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
  );
}
