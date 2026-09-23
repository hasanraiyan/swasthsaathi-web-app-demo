import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Share, StyleSheet, View } from 'react-native';
import { openDirections } from '../src/components/AppointmentCard';
import { appointmentStore, formatDate, fromISODate } from '../src/data/appointments';
import { getDoctor } from '../src/data/mock';
import {
  ActionTile,
  Badge,
  Button,
  Card,
  CalendarCheckIllustration,
  DoctorAvatar,
  Header,
  Icon,
  InfoRow,
  Row,
  Screen,
  Spacer,
  Text,
  colors,
  radius,
  spacing,
} from '../src/design-system';

/** Opens a pre-filled Google Calendar event (works on Android, iOS and web without extra permissions). */
function addToCalendar(title: string, isoDate: string, time: string, location: string) {
  const start = fromISODate(isoDate);
  const [, hh = '9', mm = '0', ampm = 'AM'] = /(\d+):(\d+)\s*(AM|PM)/i.exec(time) ?? [];
  start.setHours((Number(hh) % 12) + (ampm.toUpperCase() === 'PM' ? 12 : 0), Number(mm));
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const url =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(title)}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(location)}`;
  Linking.openURL(url).catch(() => {});
}

export default function AppointmentConfirmed() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const appt = appointmentStore.get(id);
  const doctor = getDoctor(appt?.doctorId);
  const leaveTo = (href: '/' | '/appointments') => {
    if (router.canDismiss()) router.dismissAll();
    router.navigate(href);
  };
  const goHome = () => leaveTo('/');

  if (!appt || !doctor) {
    return (
      <Screen>
        <Header title="" onBack={goHome} />
        <Text color="textSecondary">Appointment not found.</Text>
        <Spacer />
        <Button label="Back to Home" onPress={goHome} />
      </Screen>
    );
  }

  const longDate = formatDate(appt.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const share = () =>
    Share.share({ message: `My appointment with ${doctor.name} on ${longDate} at ${appt.time}, ${doctor.hospital}.` }).catch(() => {});

  return (
    <Screen
      footer={
        <View style={{ gap: spacing.sm }}>
          <Button label="View Appointment" iconRight="arrow-forward" size="lg" fullWidth onPress={() => leaveTo('/appointments')} />
          <Button label="Back to Home" variant="outline" size="lg" fullWidth onPress={goHome} />
        </View>
      }
    >
      <Header title="" onBack={goHome} />
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <CalendarCheckIllustration size={210} />
        <Text variant="h1" align="center">
          Appointment Confirmed!
        </Text>
        <Text color="textSecondary" align="center" style={{ maxWidth: 320 }}>
          Your appointment has been successfully booked. We look forward to seeing you.
        </Text>
      </View>

      <Card style={{ marginTop: spacing.xl, gap: spacing.lg }}>
        <Row gap="md">
          <DoctorAvatar size={60} variant={doctor.avatar} />
          <View style={{ flex: 1 }}>
            <Text variant="h3">{doctor.name}</Text>
            <Text variant="small" color="textSecondary">
              {doctor.specialty}
            </Text>
            <Text variant="small" color="textSecondary">
              {doctor.hospital}, {doctor.city}
            </Text>
          </View>
        </Row>
        <InfoRow icon="calendar-outline" title={longDate} />
        <InfoRow icon="time-outline" title={appt.time} subtitle={appt.type === 'video' ? 'Video consultation — link will be shared by SMS' : undefined} />
        <InfoRow icon="location-outline" title={doctor.hospital} subtitle={doctor.address} />
        <InfoRow
          icon="receipt-outline"
          title="Consultation Fee"
          subtitle={`₹${doctor.fee}`}
          right={<Badge label={appt.paid ? 'Paid' : 'Pay at clinic'} tone={appt.paid ? 'success' : 'warning'} />}
        />
      </Card>

      <View style={styles.reminder}>
        <Icon name="notifications-outline" size={20} color={colors.primary} />
        <Text variant="small" color="textSecondary" style={{ flex: 1 }}>
          Add it to your calendar so you get a reminder before the visit.
        </Text>
      </View>

      <Row gap="sm" style={{ marginTop: spacing.md }}>
        <ActionTile
          icon="calendar-outline"
          label="Add to Calendar"
          onPress={() => addToCalendar(`Appointment with ${doctor.name}`, appt.date, appt.time, `${doctor.hospital}, ${doctor.address}`)}
        />
        <ActionTile icon="location-outline" label="Get Directions" onPress={() => openDirections(`${doctor.hospital}, ${doctor.address}`)} />
        <ActionTile icon="share-social-outline" label="Share" onPress={share} />
      </Row>
    </Screen>
  );
}

const styles = StyleSheet.create({
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
  },
});
