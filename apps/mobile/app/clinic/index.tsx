import { useUser } from '@clerk/expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { consultQueueStore, patientsStore, type ConsultRequest } from '../../src/data/rural';
import {
  Avatar,
  Card,
  Icon,
  IconButton,
  KpiCard,
  Row,
  Screen,
  SegmentedControl,
  Spacer,
  Text,
  UrgencyBadge,
  colors,
  spacing,
} from '../../src/design-system';

const modeIcon = { video: 'videocam-outline', audio: 'call-outline', chat: 'chatbubbles-outline' } as const;
const triageOrder = { emergency: 0, urgent: 1, routine: 2 };

export default function DoctorQueue() {
  const { user } = useUser();
  const queue = consultQueueStore.use();
  const patients = patientsStore.use();
  const [tab, setTab] = useState<'waiting' | 'done'>('waiting');

  const waiting = queue.filter((c) => c.status !== 'done');
  const list = (tab === 'waiting' ? waiting : queue.filter((c) => c.status === 'done')).sort(
    (a, b) => triageOrder[a.triage] - triageOrder[b.triage] || b.waitingMins - a.waitingMins,
  );
  const avgWait = waiting.length ? Math.round(waiting.reduce((s, c) => s + c.waitingMins, 0) / waiting.length) : 0;

  return (
    <Screen>
      <Row style={{ paddingVertical: spacing.lg, alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text variant="h1">Dr. {user?.lastName || user?.firstName || 'Doctor'}</Text>
          <Text variant="small" color="textSecondary">
            Medical Officer · PHC Marwan teleconsult hub
          </Text>
        </View>
        <IconButton icon="notifications-outline" label="Notifications" bordered onPress={() => router.push('/notifications')} />
      </Row>

      <Row gap="sm">
        <KpiCard label="Waiting" value={waiting.length} icon="hourglass-outline" />
        <KpiCard label="Avg wait" value={avgWait} unit="min" icon="time-outline" />
        <KpiCard label="Seen today" value={queue.filter((c) => c.status === 'done').length + 17} icon="checkmark-done-outline" />
      </Row>
      <Spacer size="lg" />

      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'waiting', label: `Waiting (${waiting.length})` },
          { value: 'done', label: 'Completed' },
        ]}
      />
      <Spacer size="lg" />

      <View style={{ gap: spacing.md }}>
        {list.map((c) => (
          <QueueCard key={c.id} request={c} patientName={patients.find((p) => p.id === c.patientId)?.name ?? 'Patient'} />
        ))}
        {list.length === 0 && (
          <Text color="textSecondary" align="center" style={{ paddingVertical: spacing.xxl }}>
            Queue is empty.
          </Text>
        )}
      </View>
      <Text variant="caption" color="textMuted" align="center" style={{ marginTop: spacing.lg }}>
        Sorted by triage level, then waiting time.
      </Text>
    </Screen>
  );
}

function QueueCard({ request: c, patientName }: { request: ConsultRequest; patientName: string }) {
  return (
    <Card onPress={() => router.push({ pathname: '/consult/[id]', params: { id: c.id } })} style={{ gap: spacing.sm }}>
      <Row gap="md">
        <Avatar name={patientName} size={44} />
        <View style={{ flex: 1 }}>
          <Text variant="title">{patientName}</Text>
          <Text variant="small" color="textSecondary">
            {c.from}
            {c.assistedBy ? ` · with ${c.assistedBy}` : ''}
          </Text>
        </View>
        <UrgencyBadge level={c.triage} />
      </Row>
      <Text variant="small">{c.complaint}</Text>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row gap="xs">
          <Icon name={modeIcon[c.mode]} size={15} color={colors.textSecondary} />
          <Text variant="caption" color="textSecondary">
            {c.mode === 'video' ? 'Video' : c.mode === 'audio' ? 'Audio only' : 'Chat'}
          </Text>
        </Row>
        <Text variant="caption" color={c.waitingMins > 10 ? 'danger' : 'textSecondary'}>
          {c.status === 'done' ? 'Completed' : `Waiting ${c.waitingMins} min`}
        </Text>
      </Row>
    </Card>
  );
}
