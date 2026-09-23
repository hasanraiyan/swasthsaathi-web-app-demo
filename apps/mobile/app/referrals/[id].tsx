import { router, useLocalSearchParams } from 'expo-router';
import { Linking, View } from 'react-native';
import { facilityLevelLabel, getFacility, patientsStore, referralStages, referralsStore, type ReferralStage } from '../../src/data/rural';
import {
  Avatar,
  Button,
  Card,
  Header,
  Icon,
  InfoRow,
  RiskBadge,
  Row,
  Screen,
  SectionHeader,
  Spacer,
  Stepper,
  Text,
  UrgencyBadge,
  colors,
  spacing,
} from '../../src/design-system';
import { useRole } from '../../src/state/role';

export default function ReferralDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const referral = referralsStore.use().find((r) => r.id === id);
  const patient = patientsStore.use().find((p) => p.id === referral?.patientId);
  const { role } = useRole();

  if (!referral) {
    return (
      <Screen>
        <Header title="Referral" />
        <Text color="textSecondary">Referral not found.</Text>
      </Screen>
    );
  }

  const from = getFacility(referral.from);
  const to = getFacility(referral.to);
  const idx = referralStages.findIndex((s) => s.key === referral.stage);
  const next = referralStages[idx + 1];
  const canAdvance = (role === 'doctor' || role === 'admin' || role === 'worker') && next;

  const advance = (stage: ReferralStage) =>
    referralsStore.set((all) =>
      all.map((r) =>
        r.id === referral.id
          ? {
              ...r,
              stage,
              updates: [...r.updates, { stage, at: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }],
            }
          : r,
      ),
    );

  return (
    <Screen
      footer={
        canAdvance ? (
          <Button label={`Mark: ${next.label}`} iconRight="checkmark" size="lg" fullWidth onPress={() => advance(next.key)} />
        ) : undefined
      }
    >
      <Header title={`Referral ${referral.id}`} />

      {patient && (
        <Card onPress={role !== 'patient' ? () => router.push({ pathname: '/patient/[id]', params: { id: patient.id } }) : undefined}>
          <Row gap="md">
            <Avatar name={patient.name} size={48} />
            <View style={{ flex: 1 }}>
              <Text variant="title">{patient.name}</Text>
              <Text variant="small" color="textSecondary">
                {patient.age} y · {patient.village}
                {patient.abha ? ` · ABHA ${patient.abha}` : ''}
              </Text>
            </View>
            <RiskBadge risk={patient.risk} />
          </Row>
        </Card>
      )}

      <Spacer size="md" />
      <Card style={{ gap: spacing.lg }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text variant="h3">Reason</Text>
          <UrgencyBadge level={referral.urgency} />
        </Row>
        <Text color="textSecondary">{referral.reason}</Text>
        <InfoRow icon="exit-outline" title={from?.name ?? referral.from} subtitle={from ? `From · ${facilityLevelLabel[from.level]}` : undefined} />
        <InfoRow
          icon="enter-outline"
          title={to?.name ?? referral.to}
          subtitle={to ? `To · ${facilityLevelLabel[to.level]} · ${to.distanceKm} km` : undefined}
          right={
            to && (
              <Icon name="call-outline" size={20} color={colors.primary} onPress={() => Linking.openURL(`tel:${to.phone.replace(/\s/g, '')}`)} />
            )
          }
        />
      </Card>

      <Spacer size="xl" />
      <SectionHeader title="Status" />
      <Card>
        <Stepper
          currentIndex={referral.stage === 'closed' ? referralStages.length : idx}
          steps={referralStages.map((s) => {
            const u = referral.updates.find((x) => x.stage === s.key);
            return { label: s.label, meta: u?.at, note: u?.note };
          })}
        />
      </Card>
      {referral.urgency !== 'routine' && referral.stage === 'created' && (
        <>
          <Spacer size="md" />
          <Button label="Call 102 / 108 for transport" variant="outline" iconLeft="car-outline" fullWidth onPress={() => Linking.openURL('tel:108')} />
        </>
      )}
    </Screen>
  );
}
