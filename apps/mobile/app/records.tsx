import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppointmentCard } from '../src/components/AppointmentCard';
import { useAppointments } from '../src/data/appointments';
import { getDoctor, labReports, prescriptions } from '../src/data/mock';
import {
  Badge,
  Card,
  Divider,
  Header,
  Icon,
  IconButton,
  Row,
  Screen,
  SegmentedControl,
  Text,
  colors,
  radius,
  spacing,
} from '../src/design-system';

type Tab = 'prescriptions' | 'reports' | 'history';

export default function Records() {
  const params = useLocalSearchParams<{ tab?: Tab }>();
  const [tab, setTab] = useState<Tab>(params.tab ?? 'prescriptions');
  const [expanded, setExpanded] = useState<string | null>(null);
  const past = useAppointments().filter((a) => a.status === 'past');

  return (
    <Screen>
      <Header
        title="Health Records"
        centered
        right={<IconButton icon="calendar-outline" label="Appointments" onPress={() => router.navigate('/appointments')} />}
      />
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'prescriptions', label: 'Prescriptions' },
          { value: 'reports', label: 'Reports' },
          { value: 'history', label: 'Record History' },
        ]}
      />

      <View style={styles.list}>
        {tab === 'prescriptions' &&
          prescriptions.map((rx) => {
            const doctor = getDoctor(rx.doctorId);
            const open = expanded === rx.id;
            const meds = open ? rx.medicines : rx.medicines.slice(0, 3);
            return (
              <Card key={rx.id} style={{ gap: spacing.md }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View>
                    <Text variant="h3">{doctor?.name}</Text>
                    <Text variant="small" color="textSecondary">
                      {rx.date}
                    </Text>
                  </View>
                  <Badge label={rx.status} tone={rx.status === 'Active' ? 'success' : 'neutral'} />
                </Row>
                <Text variant="title">Medicines</Text>
                {meds.map((m) => (
                  <Row key={m.name} gap="md" style={{ alignItems: 'flex-start' }}>
                    <View style={styles.pill}>
                      <Icon name="medical" size={16} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyMedium">{m.name}</Text>
                      <Text variant="small" color="textSecondary">
                        {m.dosage}
                      </Text>
                    </View>
                    <Text variant="small" color="textSecondary">
                      {m.duration}
                    </Text>
                  </Row>
                ))}
                {open && (
                  <>
                    <Divider />
                    <Text variant="small" color="textSecondary">
                      Prescribed by {doctor?.name}, {doctor?.degree} · {doctor?.hospital}
                    </Text>
                  </>
                )}
                <Card padding="md" onPress={() => setExpanded(open ? null : rx.id)} style={styles.viewFull}>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Text variant="smallMedium">{open ? 'Hide details' : 'View Full Prescription'}</Text>
                    <Icon name={open ? 'chevron-up' : 'chevron-forward'} size={16} color={colors.text} />
                  </Row>
                </Card>
              </Card>
            );
          })}

        {tab === 'reports' &&
          labReports.map((r) => (
            <Card key={r.id}>
              <Row gap="md">
                <View style={styles.reportIcon}>
                  <Icon name={r.icon} size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="title">{r.title}</Text>
                  <Text variant="small" color="textSecondary">
                    {r.meta}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textMuted} />
              </Row>
            </Card>
          ))}

        {tab === 'history' &&
          (past.length ? (
            past.map((a) => <AppointmentCard key={a.id} appointment={a} />)
          ) : (
            <Text color="textSecondary" align="center" style={{ paddingVertical: spacing.xxl }}>
              No past visits yet.
            </Text>
          ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md, marginTop: spacing.lg },
  pill: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewFull: { shadowOpacity: 0, elevation: 0 },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
