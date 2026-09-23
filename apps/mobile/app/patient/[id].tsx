import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { patientsStore, programLabel, type TimelineEvent } from '../../src/data/rural';
import {
  Avatar,
  Banner,
  Button,
  Card,
  Field,
  Grid,
  Header,
  Icon,
  IconButton,
  QuickAction,
  RiskBadge,
  Row,
  Screen,
  SectionHeader,
  Spacer,
  TagList,
  Text,
  colors,
  radius,
  spacing,
} from '../../src/design-system';

const kindIcon: Record<TimelineEvent['kind'], ComponentProps<typeof Icon>['name']> = {
  visit: 'medkit-outline',
  lab: 'flask-outline',
  referral: 'git-branch-outline',
  prescription: 'document-text-outline',
  immunisation: 'shield-checkmark-outline',
  teleconsult: 'videocam-outline',
};

export default function PatientDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const patient = patientsStore.use().find((p) => p.id === id);
  const [recording, setRecording] = useState(false);
  const [bp, setBp] = useState('');
  const [sugar, setSugar] = useState('');
  const [weight, setWeight] = useState('');
  const [temp, setTemp] = useState('');

  if (!patient) {
    return (
      <Screen>
        <Header title="Patient" />
        <Text color="textSecondary">Patient not found.</Text>
      </Screen>
    );
  }

  const saveVitals = () => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const detail = [bp && `BP ${bp}`, sugar && `Sugar ${sugar}`, weight && `Wt ${weight} kg`, temp && `Temp ${temp}°F`].filter(Boolean).join(', ');
    patientsStore.set((all) =>
      all.map((p) =>
        p.id === patient.id
          ? {
              ...p,
              vitals: {
                ...p.vitals,
                ...(bp && { bp }),
                ...(sugar && { sugar: Number(sugar) }),
                ...(weight && { weightKg: Number(weight) }),
                ...(temp && { temp: Number(temp) }),
              },
              timeline: [{ date: today, title: 'Vitals recorded (home visit)', detail, facility: `ASHA ${p.ashaName}`, kind: 'visit' }, ...p.timeline],
            }
          : p,
      ),
    );
    setRecording(false);
    setBp('');
    setSugar('');
    setWeight('');
    setTemp('');
  };

  const v = patient.vitals;
  const vitals = [
    { label: 'BP', value: v.bp, unit: 'mmHg', alert: v.bp ? Number(v.bp.split('/')[0]) >= 140 : false },
    { label: 'Sugar', value: v.sugar, unit: 'mg/dL', alert: (v.sugar ?? 0) >= 180 },
    { label: 'Hb', value: v.hb, unit: 'g/dL', alert: v.hb !== undefined && v.hb < 10 },
    { label: 'Weight', value: v.weightKg, unit: 'kg', alert: false },
    { label: 'Temp', value: v.temp, unit: '°F', alert: (v.temp ?? 0) >= 100 },
    { label: 'SpO₂', value: v.spo2, unit: '%', alert: v.spo2 !== undefined && v.spo2 < 94 },
  ].filter((x) => x.value !== undefined);

  return (
    <Screen>
      <Header title="Patient Record" right={<IconButton icon="call-outline" label="Call patient" onPress={() => Linking.openURL(`tel:${patient.phone}`)} />} />

      <Row gap="lg">
        <Avatar name={patient.name} size={64} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="h2">{patient.name}</Text>
          <Text variant="small" color="textSecondary">
            {patient.age === 0 ? 'Infant' : `${patient.age} years`} · {patient.gender === 'F' ? 'Female' : patient.gender === 'M' ? 'Male' : 'Other'} · {patient.village}
          </Text>
          <Text variant="caption" color="textMuted">
            {patient.abha ? `ABHA ${patient.abha}` : 'ABHA not linked'} · ASHA {patient.ashaName}
          </Text>
        </View>
      </Row>
      <Row gap="sm" style={{ marginTop: spacing.md }}>
        <RiskBadge risk={patient.risk} />
        <Text variant="caption" color="textSecondary">
          {programLabel[patient.program]}
          {patient.nextFollowUp ? ` · Follow-up ${patient.nextFollowUp}` : ''}
        </Text>
      </Row>

      {patient.riskReasons.length > 0 && (
        <>
          <Spacer size="md" />
          <Banner tone={patient.risk === 'high' ? 'danger' : 'warning'} title="Why flagged" body={patient.riskReasons.map((r) => `• ${r}`).join('\n')} />
        </>
      )}

      <Spacer size="lg" />
      <Grid columns={4}>
        <QuickAction icon="pulse-outline" label="Record vitals" onPress={() => setRecording((r) => !r)} />
        <QuickAction icon="videocam-outline" label="Assisted consult" tint={colors.info} background={colors.infoSoft} onPress={() => router.push({ pathname: '/teleconsult', params: { complaint: patient.riskReasons[0] ?? '' } })} />
        <QuickAction icon="git-branch-outline" label="Refer" tint={colors.danger} background={colors.dangerSoft} onPress={() => router.push({ pathname: '/referrals/new', params: { patientId: patient.id } })} />
        <QuickAction icon="flask-outline" label="Order test" tint={colors.accent} background={colors.accentSoft} onPress={() => router.push('/diagnostics')} />
      </Grid>

      {recording && (
        <Card style={{ gap: spacing.md, marginTop: spacing.md }}>
          <Text variant="h3">Record vitals</Text>
          <Row gap="sm">
            <View style={{ flex: 1 }}>
              <Field label="BP (mmHg)" placeholder="120/80" value={bp} onChangeText={setBp} keyboardType="numbers-and-punctuation" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Sugar (mg/dL)" placeholder="110" value={sugar} onChangeText={setSugar} keyboardType="number-pad" />
            </View>
          </Row>
          <Row gap="sm">
            <View style={{ flex: 1 }}>
              <Field label="Weight (kg)" placeholder="55" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Temp (°F)" placeholder="98.6" value={temp} onChangeText={setTemp} keyboardType="decimal-pad" />
            </View>
          </Row>
          <Button label="Save vitals" fullWidth disabled={!bp && !sugar && !weight && !temp} onPress={saveVitals} />
          <Text variant="caption" color="textMuted" align="center">
            Added to this patient's health timeline.
          </Text>
        </Card>
      )}

      <Spacer size="xl" />
      <SectionHeader title="Latest vitals" />
      <View style={styles.vitals}>
        {vitals.map((x) => (
          <View key={x.label} style={[styles.vital, x.alert && { borderColor: colors.danger, backgroundColor: colors.dangerSoft }]}>
            <Text variant="caption" color="textSecondary">
              {x.label}
            </Text>
            <Text variant="h3" style={x.alert ? { color: colors.danger } : undefined}>
              {String(x.value)}
            </Text>
            <Row gap="xxs">
              {x.alert && <Icon name="alert-circle" size={12} color={colors.danger} />}
              <Text variant="caption" color="textMuted">
                {x.alert ? 'Out of range' : x.unit}
              </Text>
            </Row>
          </View>
        ))}
      </View>

      <Spacer size="xl" />
      <SectionHeader title="Conditions" />
      <TagList items={patient.conditions} />

      <Spacer size="xl" />
      <SectionHeader title="Health timeline" />
      <Card>
        {patient.timeline.map((e, i) => (
          <Row key={`${e.date}-${e.title}`} gap="md" style={{ alignItems: 'flex-start' }}>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.tlIcon}>
                <Icon name={kindIcon[e.kind]} size={16} color={colors.primary} />
              </View>
              {i < patient.timeline.length - 1 && <View style={styles.tlLine} />}
            </View>
            <View style={{ flex: 1, paddingBottom: spacing.lg }}>
              <Text variant="bodyMedium">{e.title}</Text>
              <Text variant="small" color="textSecondary">
                {e.detail}
              </Text>
              <Text variant="caption" color="textMuted">
                {e.date} · {e.facility}
              </Text>
            </View>
          </Row>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  vitals: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  vital: {
    width: '31.5%',
    padding: spacing.md,
    gap: 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tlIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlLine: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 2 },
});
