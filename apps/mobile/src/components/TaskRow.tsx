import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { patientsStore, tasksStore, type WorkerTask } from '../data/rural';
import { Badge, Card, Icon, RiskBadge, Row, Text, colors } from '../design-system';

export function TaskRow({ task }: { task: WorkerTask }) {
  const patient = patientsStore.use().find((p) => p.id === task.patientId);
  const toggle = () => tasksStore.set((all) => all.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)));

  return (
    <Card padding="md" onPress={() => router.push({ pathname: '/patient/[id]', params: { id: task.patientId } })} style={task.done ? { opacity: 0.6 } : undefined}>
      <Row gap="md">
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.done }}
          accessibilityLabel={`Mark ${task.kind} for ${patient?.name} done`}
          onPress={toggle}
          hitSlop={10}
        >
          <Icon name={task.done ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={task.done ? colors.primary : colors.textMuted} />
        </Pressable>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="title" style={task.done ? { textDecorationLine: 'line-through' } : undefined}>
            {task.kind}
          </Text>
          <Text variant="small" color="textSecondary">
            {patient?.name} · {patient?.village}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Badge label={task.due} tone={task.due === 'Overdue' ? 'danger' : task.due === 'Today' ? 'warning' : 'neutral'} />
          {patient && patient.risk === 'high' && <RiskBadge risk="high" />}
        </View>
      </Row>
    </Card>
  );
}
