import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { appointmentStore, formatDate, type ConsultationType } from '../src/data/appointments';
import { getDoctor } from '../src/data/mock';
import {
  Badge,
  Button,
  Card,
  Divider,
  DoctorAvatar,
  Header,
  Icon,
  RadioOption,
  Row,
  Screen,
  Text,
  colors,
  spacing,
} from '../src/design-system';

const methods = [
  { id: 'upi', label: 'UPI', sublabel: 'Google Pay, PhonePe, Paytm', icon: 'phone-portrait-outline' },
  { id: 'card', label: 'Card', sublabel: 'Visa, Mastercard, RuPay', icon: 'card-outline' },
  { id: 'netbanking', label: 'Net Banking', sublabel: 'All major banks', icon: 'business-outline' },
  { id: 'wallet', label: 'Wallet', sublabel: 'Paytm, Mobikwik', icon: 'wallet-outline' },
  { id: 'clinic', label: 'Pay at Clinic', sublabel: 'Cash or UPI at the hospital', icon: 'cash-outline' },
] as const;

type MethodId = (typeof methods)[number]['id'];

export default function ConfirmAppointment() {
  const p = useLocalSearchParams<{
    doctorId: string;
    date: string;
    time: string;
    type: ConsultationType;
    reason?: string;
    followUp?: string;
  }>();
  const doctor = getDoctor(p.doctorId);
  const [method, setMethod] = useState<MethodId>('upi');
  const [paying, setPaying] = useState(false);

  if (!doctor || !p.date || !p.time) {
    return (
      <Screen>
        <Header title="Confirm Appointment" />
        <Text color="textSecondary">Booking details are missing. Please start again.</Text>
      </Screen>
    );
  }

  const platformFee = 0;
  const total = doctor.fee + platformFee;
  const payLater = method === 'clinic';

  const pay = () => {
    setPaying(true);
    // Payment gateway integration goes here; the booking is stored locally for now.
    setTimeout(() => {
      const appt = appointmentStore.add({
        doctorId: doctor.id,
        date: p.date,
        time: p.time,
        type: p.type ?? 'in-person',
        reason: p.reason,
        followUp: p.followUp === '1',
        paid: !payLater,
      });
      router.replace({ pathname: '/confirmed', params: { id: appt.id } });
    }, 700);
  };

  return (
    <Screen
      footer={
        <Button
          label={payLater ? 'Confirm Booking' : `Pay ₹${total}`}
          iconRight="arrow-forward"
          size="lg"
          fullWidth
          loading={paying}
          onPress={pay}
        />
      }
    >
      <Header title="Confirm Appointment" />

      <Card>
        <Row gap="lg">
          <DoctorAvatar size={72} variant={doctor.avatar} />
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

      <Card style={{ marginTop: spacing.md }}>
        <Row gap="md">
          <Icon name="calendar-outline" size={22} color={colors.text} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium">{formatDate(p.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            <Text variant="small" color="textSecondary">
              {p.time} · {p.type === 'video' ? 'Video consultation' : 'In-person visit'}
            </Text>
          </View>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text variant="smallMedium" color="primary" style={{ textDecorationLine: 'underline' }}>
              Change
            </Text>
          </Pressable>
        </Row>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <Text variant="bodyMedium">Consultation Fee</Text>
            <Text variant="h1">₹{doctor.fee}</Text>
          </View>
          <Badge label={doctor.modes} tone="success" />
        </Row>
      </Card>

      <Text variant="h3" style={styles.sectionTitle}>
        Payment Method
      </Text>
      <View style={{ gap: spacing.sm }}>
        {methods.map((m) => (
          <RadioOption
            key={m.id}
            icon={m.icon}
            label={m.label}
            sublabel={m.sublabel}
            selected={method === m.id}
            onPress={() => setMethod(m.id)}
          />
        ))}
      </View>

      <Card style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <Row style={styles.billRow}>
          <Text variant="small" color="textSecondary">Consultation Fee</Text>
          <Text variant="small">₹{doctor.fee}</Text>
        </Row>
        <Row style={styles.billRow}>
          <Text variant="small" color="textSecondary">Platform Fee</Text>
          <Text variant="small">₹{platformFee}</Text>
        </Row>
        <Divider />
        <Row style={styles.billRow}>
          <Text variant="title">Total Amount</Text>
          <Text variant="h3">₹{total}</Text>
        </Row>
      </Card>
      <Row gap="xs" style={{ marginTop: spacing.md, justifyContent: 'center' }}>
        <Icon name="information-circle-outline" size={14} color={colors.textMuted} />
        <Text variant="caption" color="textMuted">
          Demo mode: no money is charged yet.
        </Text>
      </Row>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: spacing.xxl, marginBottom: spacing.md },
  billRow: { justifyContent: 'space-between' },
});
