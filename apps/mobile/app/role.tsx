import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, CareHeroIllustration, Icon, RadioOption, Screen, Spacer, Text, colors, spacing } from '../src/design-system';
import { roleHome, roleLabel, useRole, type Role } from '../src/state/role';

const roles: { role: Role; icon: 'person-outline' | 'people-outline' | 'medkit-outline' | 'business-outline'; sub: string }[] = [
  { role: 'patient', icon: 'person-outline', sub: 'Book visits, talk to a doctor, keep your records' },
  { role: 'worker', icon: 'people-outline', sub: 'Register patients, triage, follow-ups, referrals' },
  { role: 'doctor', icon: 'medkit-outline', sub: 'Teleconsult queue, e-prescriptions, referrals' },
  { role: 'admin', icon: 'business-outline', sub: 'OPD, stock, diagnostics and quality dashboards' },
];

export default function RoleSelect() {
  const { role, setRole } = useRole();
  const [picked, setPicked] = useState<Role>(role ?? 'patient');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await setRole(picked);
      router.replace(roleHome[picked]);
    } catch {
      setError('Could not save your role. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen footer={<Button label="Continue" iconRight="arrow-forward" size="lg" fullWidth loading={saving} onPress={save} />}>
      <View style={{ alignItems: 'center', paddingTop: spacing.xl }}>
        <CareHeroIllustration size={120} />
        <Text variant="h1" align="center">
          How will you use SwasthSaathi?
        </Text>
        <Text color="textSecondary" align="center">
          You can switch later from your profile.
        </Text>
      </View>
      <Spacer size="xl" />
      <View style={{ gap: spacing.sm }}>
        {roles.map((r) => (
          <RadioOption
            key={r.role}
            icon={r.icon}
            label={roleLabel[r.role]}
            sublabel={r.sub}
            selected={picked === r.role}
            onPress={() => setPicked(r.role)}
          />
        ))}
      </View>
      {error && (
        <View style={{ flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md }}>
          <Icon name="alert-circle-outline" size={16} color={colors.danger} />
          <Text variant="small" style={{ color: colors.danger }}>
            {error}
          </Text>
        </View>
      )}
    </Screen>
  );
}
