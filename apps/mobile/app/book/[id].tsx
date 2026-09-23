import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { toISODate, type ConsultationType } from '../../src/data/appointments';
import { getDoctor } from '../../src/data/mock';
import {
  Button,
  Card,
  Checkbox,
  DoctorAvatar,
  Header,
  Icon,
  RadioOption,
  Row,
  Screen,
  SlotPill,
  Spacer,
  Text,
  TextArea,
  colors,
  spacing,
} from '../../src/design-system';

function nextSevenDays() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function BookAppointment() {
  const { id, time } = useLocalSearchParams<{ id: string; time?: string }>();
  const doctor = getDoctor(id);
  const days = useMemo(nextSevenDays, []);

  const [dayIndex, setDayIndex] = useState(Math.min(3, days.length - 1));
  const [slot, setSlot] = useState(time ?? doctor?.slots[1]);
  const [type, setType] = useState<ConsultationType>('in-person');
  const [reason, setReason] = useState('');
  const [followUp, setFollowUp] = useState(false);

  if (!doctor) {
    return (
      <Screen>
        <Header title="Book Appointment" centered />
        <Text color="textSecondary">Doctor not found.</Text>
      </Screen>
    );
  }

  const selectedDay = days[dayIndex]!;
  const monthLabel = selectedDay.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const onContinue = () =>
    router.push({
      pathname: '/confirm',
      params: {
        doctorId: doctor.id,
        date: toISODate(selectedDay),
        time: slot!,
        type,
        reason,
        followUp: followUp ? '1' : '0',
      },
    });

  return (
    <Screen
      footer={<Button label="Continue" iconRight="arrow-forward" size="lg" fullWidth disabled={!slot} onPress={onContinue} />}
    >
      <Header title="Book Appointment" centered />

      <Card padding="lg">
        <Row gap="lg">
          <DoctorAvatar size={76} variant={doctor.avatar} />
          <View style={{ flex: 1, gap: 3 }}>
            <Text variant="h3">{doctor.name}</Text>
            <Text variant="small" color="textSecondary">
              {doctor.specialty}
            </Text>
            <Row gap="xs">
              <Icon name="star" size={15} color={colors.star} />
              <Text variant="smallMedium">{doctor.rating}</Text>
              <Text variant="small" color="textSecondary">
                ({doctor.reviews} reviews)
              </Text>
            </Row>
            <Row gap="xs">
              <Icon name="location-outline" size={14} color={colors.textSecondary} />
              <Text variant="small" color="textSecondary" style={{ flex: 1 }}>
                {doctor.hospital}, {doctor.city}
              </Text>
            </Row>
          </View>
        </Row>
      </Card>

      <Row style={styles.sectionTitle}>
        <Text variant="h3">Select Date</Text>
        <Row gap="xs">
          <Text variant="smallMedium" color="textSecondary">
            {monthLabel}
          </Text>
          <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
        </Row>
      </Row>
      <Row gap="xs">
        {days.map((d, i) => (
          <SlotPill
            key={d.toISOString()}
            sublabel={d.toLocaleDateString('en-IN', { weekday: 'short' })}
            label={String(d.getDate())}
            selected={i === dayIndex}
            idleTone="outline"
            onPress={() => setDayIndex(i)}
            style={styles.dayPill}
          />
        ))}
      </Row>

      <Text variant="h3" style={styles.sectionTitle}>
        Select Time
      </Text>
      <View style={styles.timeGrid}>
        {doctor.slots.map((s) => (
          <SlotPill key={s} label={s} selected={s === slot} onPress={() => setSlot(s)} style={styles.timePill} />
        ))}
      </View>

      <Text variant="h3" style={styles.sectionTitle}>
        Consultation Type
      </Text>
      <Row gap="sm">
        <RadioOption
          variant="card"
          icon="person-outline"
          label="In-person"
          sublabel="Visit hospital"
          selected={type === 'in-person'}
          onPress={() => setType('in-person')}
        />
        <RadioOption
          variant="card"
          icon="videocam-outline"
          label="Video Consultation"
          sublabel="Online"
          selected={type === 'video'}
          onPress={() => setType('video')}
        />
      </Row>

      <Text variant="h3" style={styles.sectionTitle}>
        Reason for Visit
      </Text>
      <TextArea placeholder="e.g. Fever, cough, general checkup..." value={reason} onChangeText={setReason} />
      <Spacer size="md" />
      <Checkbox checked={followUp} onChange={setFollowUp} label="This is a follow-up visit" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { justifyContent: 'space-between', marginTop: spacing.xxl, marginBottom: spacing.md },
  dayPill: { flex: 1, paddingHorizontal: 0, minHeight: 64 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timePill: { flexGrow: 1, flexBasis: '30%', minHeight: 48 },
});
