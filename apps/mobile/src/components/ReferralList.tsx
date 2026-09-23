import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { getFacility, patientsStore, referralStages, referralsStore } from '../data/rural';
import { Card, Icon, ProgressBar, Row, SegmentedControl, Text, UrgencyBadge, colors, spacing } from '../design-system';

export function ReferralList() {
  const referrals = referralsStore.use();
  const patients = patientsStore.use();
  const [tab, setTab] = useState<'open' | 'closed'>('open');
  const list = referrals.filter((r) => (tab === 'open' ? !['treated', 'closed'].includes(r.stage) : ['treated', 'closed'].includes(r.stage)));

  return (
    <View style={{ gap: spacing.md }}>
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'open', label: `In progress (${referrals.filter((r) => !['treated', 'closed'].includes(r.stage)).length})` },
          { value: 'closed', label: 'Completed' },
        ]}
      />
      {list.map((r) => {
        const p = patients.find((x) => x.id === r.patientId);
        const stepIndex = referralStages.findIndex((s) => s.key === r.stage);
        const pct = Math.round(((stepIndex + 1) / referralStages.length) * 100);
        return (
          <Card key={r.id} onPress={() => router.push({ pathname: '/referrals/[id]', params: { id: r.id } })} style={{ gap: spacing.sm }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text variant="caption" color="textMuted">
                {r.id} · {r.createdAt}
              </Text>
              <UrgencyBadge level={r.urgency} />
            </Row>
            <Text variant="title">{p?.name ?? 'Patient'}</Text>
            <Text variant="small" color="textSecondary">
              {r.reason}
            </Text>
            <Row gap="xs">
              <Text variant="smallMedium">{getFacility(r.from)?.name}</Text>
              <Icon name="arrow-forward" size={14} color={colors.textSecondary} />
              <Text variant="smallMedium" style={{ flex: 1 }} numberOfLines={1}>
                {getFacility(r.to)?.name}
              </Text>
            </Row>
            <ProgressBar value={pct} />
            <Text variant="caption" color="primary">
              {referralStages[stepIndex]?.label}
            </Text>
          </Card>
        );
      })}
      {list.length === 0 && (
        <Text color="textSecondary" align="center" style={{ paddingVertical: spacing.xxl }}>
          Nothing here.
        </Text>
      )}
    </View>
  );
}
