import { router } from 'expo-router';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { formatDate, type Appointment } from '../data/appointments';
import { getDoctor } from '../data/mock';
import { Badge, Card, Icon, Row, SmallAction, Text, colors, radius, spacing } from '../design-system';

const statusBadge = {
  upcoming: { label: 'Confirmed', tone: 'success' },
  past: { label: 'Completed', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
} as const;

export const openDirections = (query: string) => {
  const q = encodeURIComponent(query);
  const url = Platform.select({
    ios: `maps:0,0?q=${q}`,
    android: `geo:0,0?q=${q}`,
    default: `https://www.google.com/maps/search/?api=1&query=${q}`,
  });
  Linking.openURL(url).catch(() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`));
};

export function AppointmentCard({
  appointment,
  showActions = false,
  onCancel,
}: {
  appointment: Appointment;
  showActions?: boolean;
  onCancel?: () => void;
}) {
  const doctor = getDoctor(appointment.doctorId);
  if (!doctor) return null;
  const badge = statusBadge[appointment.status];

  return (
    <Card padding="md" onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doctor.id } })}>
      <Row gap="md" style={{ alignItems: 'flex-start' }}>
        <View style={styles.dateBox}>
          <Text variant="h2">{formatDate(appointment.date, { day: '2-digit' })}</Text>
          <Text variant="smallMedium">{formatDate(appointment.date, { month: 'short' })}</Text>
          <Text variant="caption" color="textMuted">
            {formatDate(appointment.date, { weekday: 'short' })}
          </Text>
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text variant="title" style={{ flex: 1 }} numberOfLines={1}>
              {doctor.name}
            </Text>
            <Badge label={badge.label} tone={badge.tone} />
          </Row>
          <Text variant="small" color="textSecondary">
            {doctor.specialty}
            {appointment.type === 'video' ? ' · Video consult' : ''}
          </Text>
          <Row gap="xs" style={{ marginTop: 2 }}>
            <Icon name="time-outline" size={14} color={colors.textSecondary} />
            <Text variant="small">{appointment.time}</Text>
          </Row>
          <Row gap="xs">
            <Icon name="location-outline" size={14} color={colors.textSecondary} />
            <Text variant="small" color="textSecondary" numberOfLines={1} style={{ flex: 1 }}>
              {doctor.hospital}, {doctor.city}
            </Text>
          </Row>
        </View>
      </Row>
      {showActions && appointment.status === 'upcoming' && (
        <Row gap="sm" style={{ marginTop: spacing.md }}>
          <SmallAction
            icon="refresh"
            label="Reschedule"
            onPress={() => router.push({ pathname: '/book/[id]', params: { id: doctor.id } })}
          />
          <SmallAction icon="close" label="Cancel" tone="danger" onPress={onCancel} />
          <SmallAction icon="location-outline" label="Directions" onPress={() => openDirections(`${doctor.hospital}, ${doctor.address}`)} />
        </Row>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  dateBox: {
    width: 62,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
  },
});
