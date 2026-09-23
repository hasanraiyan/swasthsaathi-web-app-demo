import { useUser } from '@clerk/expo';
import { useNetworkState } from 'expo-network';
import { router } from 'expo-router';
import { View } from 'react-native';
import { TaskRow } from '../../src/components/TaskRow';
import { patientsStore, referralsStore, tasksStore } from '../../src/data/rural';
import {
  Banner,
  Card,
  Grid,
  Icon,
  IconButton,
  KpiCard,
  QuickAction,
  Row,
  Screen,
  SectionHeader,
  Spacer,
  Text,
  colors,
  spacing,
} from '../../src/design-system';

export default function WorkerHome() {
  const { user } = useUser();
  const net = useNetworkState();
  const tasks = tasksStore.use();
  const patients = patientsStore.use();
  const referrals = referralsStore.use();

  const today = tasks.filter((t) => !t.done && (t.due === 'Today' || t.due === 'Overdue'));
  const highRisk = patients.filter((p) => p.risk === 'high');
  const openReferrals = referrals.filter((r) => !['treated', 'closed'].includes(r.stage));
  const online = net.isConnected !== false && net.isInternetReachable !== false;

  return (
    <Screen>
      <Row style={{ paddingVertical: spacing.lg, alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text variant="h1">Namaste, {user?.firstName || 'Didi'} 🙏</Text>
          <Text variant="small" color="textSecondary">
            ASHA · Kanti Sub-centre area · {patients.length} families
          </Text>
        </View>
        <IconButton icon="notifications-outline" label="Notifications" bordered onPress={() => router.push('/notifications')} />
      </Row>

      <Card padding="md">
        <Row gap="sm">
          <Icon name={online ? 'cloud-done-outline' : 'cloud-offline-outline'} size={20} color={online ? colors.primary : colors.textSecondary} />
          <Text variant="small" style={{ flex: 1 }}>
            {online ? 'Online' : 'Offline mode — keep working, entries stay on this phone'}
          </Text>
        </Row>
      </Card>
      <Spacer size="lg" />

      <Row gap="sm">
        <KpiCard label="Due today" value={today.length} icon="today-outline" />
        <KpiCard label="High risk" value={highRisk.length} icon="alert-circle-outline" />
        <KpiCard label="Open referrals" value={openReferrals.length} icon="git-branch-outline" />
      </Row>
      <Spacer size="xl" />

      <SectionHeader title="Quick actions" />
      <Grid columns={4}>
        <QuickAction icon="person-add-outline" label="Register patient" onPress={() => router.push('/patient/new')} />
        <QuickAction icon="pulse-outline" label="Triage" tint={colors.danger} background={colors.dangerSoft} onPress={() => router.push('/triage')} />
        <QuickAction icon="videocam-outline" label="Assisted consult" tint={colors.info} background={colors.infoSoft} onPress={() => router.push('/teleconsult')} />
        <QuickAction icon="git-branch-outline" label="Refer" tint={colors.accent} background={colors.accentSoft} onPress={() => router.push('/referrals/new')} />
        <QuickAction icon="call-outline" label="Emergency" tint={colors.danger} background={colors.dangerSoft} onPress={() => router.push('/emergency')} />
        <QuickAction icon="medical-outline" label="Medicine stock" tint={colors.warning} background={colors.warningSoft} onPress={() => router.push('/medicines')} />
        <QuickAction icon="flask-outline" label="Lab tests" onPress={() => router.push('/diagnostics')} />
        <QuickAction icon="list-outline" label="Referrals" onPress={() => router.push('/referrals')} badge={openReferrals.length ? String(openReferrals.length) : undefined} />
      </Grid>
      <Spacer size="xl" />

      {highRisk.length > 0 && (
        <>
          <Banner
            tone="danger"
            title={`${highRisk.length} high-risk patients need attention`}
            body={highRisk.map((p) => `${p.name} — ${p.riskReasons[0]}`).join('\n')}
            action="View"
            onAction={() => router.navigate('/worker/patients')}
          />
          <Spacer size="xl" />
        </>
      )}

      <SectionHeader title="Today's visits" action="All follow-ups" onAction={() => router.navigate('/worker/followups')} />
      <View style={{ gap: spacing.sm }}>
        {today.map((t) => (
          <TaskRow key={t.id} task={t} />
        ))}
        {today.length === 0 && (
          <Text color="textSecondary" align="center" style={{ paddingVertical: spacing.xl }}>
            All done for today 🎉
          </Text>
        )}
      </View>
    </Screen>
  );
}
