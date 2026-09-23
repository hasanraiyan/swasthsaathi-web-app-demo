import { router } from 'expo-router';
import { View } from 'react-native';
import { LOW_STOCK, facilityKpis as k, getFacility, medicines, referralsStore } from '../../src/data/rural';
import {
  Banner,
  BarChart,
  Card,
  Header,
  KpiCard,
  ProgressBar,
  Row,
  Screen,
  SectionHeader,
  Spacer,
  StatusRow,
  Text,
  spacing,
} from '../../src/design-system';

export default function FacilityDashboard() {
  const facility = getFacility(k.facilityId);
  const referrals = referralsStore.use();
  const outOfStock = medicines.filter((m) => (m.stock[k.facilityId] ?? 0) === 0);
  const low = medicines.filter((m) => {
    const u = m.stock[k.facilityId] ?? 0;
    return u > 0 && u < LOW_STOCK;
  });
  const incoming = referrals.filter((r) => r.to === k.facilityId || r.from === k.facilityId);

  return (
    <Screen>
      <Header title={facility?.name ?? 'Facility'} showBack={false} />
      <Text variant="small" color="textSecondary" style={{ marginTop: -spacing.sm, marginBottom: spacing.lg }}>
        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} · Marwan block
      </Text>

      {outOfStock.length > 0 && (
        <>
          <Banner
            tone="danger"
            title={`${outOfStock.length} essential medicines out of stock`}
            body={outOfStock.map((m) => m.name).join(', ')}
            action="Indent"
            onAction={() => router.navigate('/facility/stock')}
          />
          <Spacer size="lg" />
        </>
      )}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <KpiCard label="OPD today" value={k.opdToday} delta={k.opdToday - k.opdYesterday} icon="people-outline" />
        <KpiCard label="Avg wait" value={k.avgWaitMins} unit="min" delta={k.avgWaitMins - k.avgWaitLastWeek} goodWhen="down" icon="time-outline" />
        <KpiCard label="Teleconsults" value={k.teleconsultsToday} icon="videocam-outline" />
        <KpiCard label="Referral completion" value={`${k.referralCompletion}%`} delta={6} icon="git-branch-outline" />
        <KpiCard label="Follow-up coverage" value={`${k.followUpCoverage}%`} delta={-3} icon="checkbox-outline" />
        <KpiCard label="Staff present" value={`${k.staffPresent}/${k.staffTotal}`} icon="id-card-outline" />
      </View>

      <Spacer size="xl" />
      <SectionHeader title="OPD footfall · last 7 days" />
      <Card>
        <BarChart data={k.opdByDay.map((d) => ({ label: d.day, value: d.value }))} formatValue={(v) => `${v} patients`} />
        <Text variant="caption" color="textMuted" style={{ marginTop: spacing.sm }}>
          Tap a bar to see that day.
        </Text>
      </Card>

      <Spacer size="xl" />
      <SectionHeader title="Quality indicators" />
      <Card style={{ gap: spacing.lg }}>
        {k.quality.map((q) => (
          <View key={q.label} style={{ gap: spacing.xs }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text variant="small" style={{ flex: 1 }}>
                {q.label}
              </Text>
              <Text variant="smallMedium">{q.value}%</Text>
            </Row>
            <ProgressBar value={q.value} tone={q.value >= 80 ? 'success' : q.value >= 60 ? 'warning' : 'danger'} />
          </View>
        ))}
      </Card>

      <Spacer size="xl" />
      <SectionHeader title="Diagnostics & equipment" />
      <Card padding="md">
        {k.equipment.map((e) => (
          <StatusRow key={e.name} label={e.name} status={e.status} />
        ))}
      </Card>

      <Spacer size="xl" />
      <SectionHeader title="At a glance" />
      <Row gap="sm">
        <KpiCard label="Bed occupancy" value={`${k.bedOccupancy}%`} icon="bed-outline" />
        <KpiCard label="Low-stock items" value={low.length} icon="cube-outline" />
        <KpiCard label="Referrals (in/out)" value={incoming.length} icon="swap-horizontal-outline" />
      </Row>
    </Screen>
  );
}
