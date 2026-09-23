import { useState } from 'react';
import { View } from 'react-native';
import { TaskRow } from '../../src/components/TaskRow';
import { tasksStore, type WorkerTask } from '../../src/data/rural';
import { Header, ProgressBar, Row, Screen, SectionHeader, SegmentedControl, Spacer, Text, spacing } from '../../src/design-system';

const order: WorkerTask['due'][] = ['Overdue', 'Today', 'Tomorrow', 'This week'];

export default function FollowUps() {
  const tasks = tasksStore.use();
  const [tab, setTab] = useState<'pending' | 'done'>('pending');
  const done = tasks.filter((t) => t.done).length;
  const list = tasks.filter((t) => (tab === 'done' ? t.done : !t.done));

  return (
    <Screen>
      <Header title="Follow-ups" showBack={false} />
      <Row style={{ justifyContent: 'space-between', marginBottom: spacing.xs }}>
        <Text variant="small" color="textSecondary">
          This week's coverage
        </Text>
        <Text variant="smallMedium">
          {done}/{tasks.length} visits
        </Text>
      </Row>
      <ProgressBar value={(done / Math.max(1, tasks.length)) * 100} />
      <Spacer size="lg" />
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'pending', label: `Pending (${tasks.length - done})` },
          { value: 'done', label: `Done (${done})` },
        ]}
      />
      <Spacer size="lg" />
      {tab === 'pending' ? (
        order.map((due) => {
          const group = list.filter((t) => t.due === due);
          if (!group.length) return null;
          return (
            <View key={due} style={{ marginBottom: spacing.lg }}>
              <SectionHeader title={due} />
              <View style={{ gap: spacing.sm }}>
                {group.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </View>
            </View>
          );
        })
      ) : (
        <View style={{ gap: spacing.sm }}>
          {list.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </View>
      )}
      {list.length === 0 && (
        <Text color="textSecondary" align="center" style={{ paddingVertical: spacing.xxl }}>
          Nothing here.
        </Text>
      )}
    </Screen>
  );
}
