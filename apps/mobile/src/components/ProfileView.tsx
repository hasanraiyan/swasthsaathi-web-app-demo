import { useClerk, useUser } from '@clerk/expo';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Divider, Header, Icon, ListItem, Row, Screen, Text, colors, radius, spacing } from '../design-system';
import { languages, useI18n } from '../state/i18n';
import { roleLabel, useRole } from '../state/role';

/** Profile screen shared by every role; each role can add its own section on top. */
export function ProfileView({ children, subtitle }: { children?: ReactNode; subtitle?: string }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { role } = useRole();
  const { lang } = useI18n();

  const name = user?.fullName || user?.username || 'SwasthSaathi user';
  const contact = user?.primaryEmailAddress?.emailAddress ?? user?.primaryPhoneNumber?.phoneNumber ?? '';

  const onSignOut = async () => {
    await signOut();
    router.replace('/onboarding');
  };

  return (
    <Screen>
      <Header title="My Profile" showBack={false} centered />
      <Row gap="lg">
        <Avatar name={name} imageUrl={user?.hasImage ? user.imageUrl : null} size={72} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="h2" numberOfLines={1}>
            {name}
          </Text>
          <Text variant="small" color="textSecondary" numberOfLines={1}>
            {contact}
          </Text>
          <Text variant="smallMedium" color="primary">
            {subtitle ?? (role ? roleLabel[role] : '')}
          </Text>
        </View>
      </Row>

      {children && <View style={{ marginTop: spacing.xl }}>{children}</View>}

      <View style={styles.menu}>
        <ListItem
          icon="language-outline"
          label="Language"
          onPress={() => router.push('/language')}
          right={
            <Row gap="xs">
              <Text variant="small" color="textSecondary">
                {languages.find((l) => l.code === lang)?.native}
              </Text>
              <Icon name="chevron-forward" size={18} color={colors.textMuted} />
            </Row>
          }
        />
        <ListItem icon="notifications-outline" label="Notifications" onPress={() => router.push('/notifications')} />
        <ListItem icon="swap-horizontal-outline" label="Switch role" onPress={() => router.push('/role')} />
        <ListItem icon="shield-checkmark-outline" label="Privacy & consent" onPress={() => router.push('/privacy')} />
        <ListItem icon="headset-outline" label="Help & Support" onPress={() => router.push('/emergency')} />
      </View>
      <Divider />
      <View style={styles.menu}>
        <ListItem icon="log-out-outline" label="Logout" destructive onPress={onSignOut} />
      </View>

      <Row gap="lg" style={styles.quote}>
        <Icon name="leaf" size={30} color={colors.primaryMuted} />
        <Text variant="bodyMedium" style={{ flex: 1 }}>
          Strengthening public health, one visit at a time.
        </Text>
      </Row>
    </Screen>
  );
}

const styles = StyleSheet.create({
  menu: { paddingVertical: spacing.sm },
  quote: { marginTop: spacing.lg, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.primaryTint },
});
