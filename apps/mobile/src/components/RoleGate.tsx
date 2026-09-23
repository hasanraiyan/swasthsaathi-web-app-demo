import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../design-system';
import { roleHome, useRole, type Role } from '../state/role';

/** Sends signed-out users to onboarding, users without a role to /role, and other roles to their own home. */
export function RoleGate({ role, children }: { role: Role; children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { role: current, isLoaded: userLoaded } = useRole();

  if (!isLoaded || (isSignedIn && !userLoaded)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }
  if (!isSignedIn) return <Redirect href="/onboarding" />;
  if (!current) return <Redirect href="/role" />;
  if (current !== role) return <Redirect href={roleHome[current]} />;
  return <>{children}</>;
}
