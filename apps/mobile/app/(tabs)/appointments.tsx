import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppointmentCard } from '../../src/components/AppointmentCard';
import { appointmentStore, useAppointments, type AppointmentStatus } from '../../src/data/appointments';
import {
  Button,
  Card,
  DashedButton,
  Header,
  HealthMattersIllustration,
  IconButton,
  Screen,
  SegmentedControl,
  Text,
  spacing,
} from '../../src/design-system';

const emptyCopy: Record<AppointmentStatus, string> = {
  upcoming: 'No upcoming appointments.',
  past: 'No past appointments yet.',
  cancelled: 'No cancelled appointments.',
};

export default function Appointments() {
  const all = useAppointments();
  const [status, setStatus] = useState<AppointmentStatus>('upcoming');
  const list = all.filter((a) => a.status === status);

  return (
    <Screen>
      <Header
        title="My Appointments"
        showBack={false}
        right={<IconButton icon="calendar-outline" label="Book appointment" onPress={() => router.push('/doctors')} />}
      />
      <SegmentedControl
        value={status}
        onChange={setStatus}
        options={[
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'past', label: 'Past' },
          { value: 'cancelled', label: 'Cancelled' },
        ]}
      />

      <View style={styles.list}>
        {list.map((a) => (
          <AppointmentCard key={a.id} appointment={a} showActions onCancel={() => appointmentStore.cancel(a.id)} />
        ))}
        {list.length === 0 && (
          <Text color="textSecondary" align="center" style={{ paddingVertical: spacing.xxl }}>
            {emptyCopy[status]}
          </Text>
        )}
        <DashedButton label="Book a New Appointment" onPress={() => router.push('/doctors')} />
      </View>

      <Card tone="tint" padding="xl" style={styles.promo}>
        <View style={{ maxWidth: '60%', gap: spacing.sm }}>
          <Text variant="h2">Your Health Matters</Text>
          <Text variant="small" color="textSecondary">
            Regular checkups today for a healthier tomorrow.
          </Text>
          <Button label="Book Checkup" size="sm" onPress={() => router.push({ pathname: '/doctors', params: { specialty: 'general' } })} />
        </View>
        <View style={styles.promoArt}>
          <HealthMattersIllustration size={120} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md, marginTop: spacing.lg },
  promo: { marginTop: spacing.xl, overflow: 'hidden', minHeight: 160 },
  promoArt: { position: 'absolute', right: spacing.sm, bottom: -6 },
});
