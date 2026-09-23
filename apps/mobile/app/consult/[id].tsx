import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { consultQueueStore, labTests, medicines, patientsStore } from '../../src/data/rural';
import {
  Avatar,
  Banner,
  Button,
  Card,
  Checkbox,
  Field,
  Header,
  Icon,
  OptionChips,
  RiskBadge,
  Row,
  Screen,
  SectionHeader,
  Spacer,
  Text,
  UrgencyBadge,
  colors,
  radius,
  spacing,
} from '../../src/design-system';

interface RxLine {
  name: string;
  dose: string;
  days: string;
}

const doses = ['1-0-1', '1-1-1', '0-0-1', '1-0-0', 'SOS'];

export default function Consult() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const request = consultQueueStore.use().find((c) => c.id === id);
  const patient = patientsStore.use().find((p) => p.id === request?.patientId);

  const [findings, setFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [rx, setRx] = useState<RxLine[]>([]);
  const [tests, setTests] = useState<string[]>([]);
  const [followUp, setFollowUp] = useState('7d');
  const [refer, setRefer] = useState(false);

  if (!request || !patient) {
    return (
      <Screen>
        <Header title="Consultation" />
        <Text color="textSecondary">Consultation not found.</Text>
      </Screen>
    );
  }

  const addMed = (name: string) => setRx((r) => (r.some((x) => x.name === name) ? r : [...r, { name, dose: '1-0-1', days: '5' }]));
  const updateMed = (i: number, patch: Partial<RxLine>) => setRx((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const complete = () => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    consultQueueStore.set((all) => all.map((c) => (c.id === request.id ? { ...c, status: 'done' } : c)));
    patientsStore.set((all) =>
      all.map((p) =>
        p.id === patient.id
          ? {
              ...p,
              timeline: [
                ...(rx.length
                  ? [{ date: today, title: 'e-Prescription', detail: rx.map((m) => `${m.name} ${m.dose} × ${m.days}d`).join(', '), facility: 'PHC Marwan (tele)', kind: 'prescription' as const }]
                  : []),
                { date: today, title: 'Teleconsult', detail: diagnosis || findings || request.complaint, facility: 'PHC Marwan (tele)', kind: 'teleconsult' as const },
                ...p.timeline,
              ],
            }
          : p,
      ),
    );
    if (refer) router.replace({ pathname: '/referrals/new', params: { patientId: patient.id } });
    else router.back();
  };

  return (
    <Screen
      footer={
        <Row gap="sm">
          <Button
            label={request.mode === 'chat' ? 'Chat' : 'Call'}
            variant="outline"
            size="lg"
            iconLeft={request.mode === 'video' ? 'videocam' : request.mode === 'audio' ? 'call' : 'chatbubbles'}
            onPress={() => router.push({ pathname: '/teleconsult/call', params: { mode: request.mode } })}
            style={{ flex: 1 }}
            fullWidth
          />
          <Button label={refer ? 'Save & refer' : 'Complete'} size="lg" iconRight="checkmark" disabled={!diagnosis.trim()} onPress={complete} style={{ flex: 2 }} fullWidth />
        </Row>
      }
    >
      <Header title="Consultation" />

      <Card onPress={() => router.push({ pathname: '/patient/[id]', params: { id: patient.id } })} style={{ gap: spacing.sm }}>
        <Row gap="md">
          <Avatar name={patient.name} size={48} />
          <View style={{ flex: 1 }}>
            <Text variant="title">{patient.name}</Text>
            <Text variant="small" color="textSecondary">
              {patient.age === 0 ? 'Infant' : `${patient.age} y`} · {patient.gender} · {patient.village}
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.textMuted} />
        </Row>
        <Row gap="sm">
          <UrgencyBadge level={request.triage} />
          <RiskBadge risk={patient.risk} />
        </Row>
        <Text variant="small">
          <Text variant="smallMedium">Complaint: </Text>
          {request.complaint}
        </Text>
        {Object.keys(patient.vitals).length > 0 && (
          <Text variant="small" color="textSecondary">
            Vitals:{' '}
            {[patient.vitals.bp && `BP ${patient.vitals.bp}`, patient.vitals.sugar && `Sugar ${patient.vitals.sugar}`, patient.vitals.hb && `Hb ${patient.vitals.hb}`, patient.vitals.temp && `Temp ${patient.vitals.temp}°F`]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        )}
        {patient.conditions.length > 0 && (
          <Text variant="small" color="textSecondary">
            Known: {patient.conditions.join(', ')}
          </Text>
        )}
      </Card>

      {request.assistedBy && (
        <>
          <Spacer size="md" />
          <Banner tone="info" title={`Assisted by ${request.assistedBy}`} body="The health worker can take vitals and examine the patient on your instructions." />
        </>
      )}

      <Spacer size="xl" />
      <View style={{ gap: spacing.lg }}>
        <Field label="Findings / history" placeholder="Symptoms, examination findings" value={findings} onChangeText={setFindings} multiline />
        <Field label="Provisional diagnosis *" placeholder="e.g. Pregnancy-induced hypertension" value={diagnosis} onChangeText={setDiagnosis} />
      </View>

      <Spacer size="xl" />
      <SectionHeader title="e-Prescription" />
      <Text variant="caption" color="textMuted" style={{ marginBottom: spacing.sm }}>
        Tap to add. Stock shown for PHC Marwan.
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {medicines.map((m) => {
          const stock = m.stock['phc-marwan'] ?? 0;
          const added = rx.some((x) => x.name === m.name);
          return (
            <Pressable
              key={m.name}
              onPress={() => addMed(m.name)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs + 2,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: added ? colors.primary : colors.border,
                backgroundColor: added ? colors.primaryTint : colors.surface,
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center',
              }}
            >
              <Text variant="small">{m.name}</Text>
              {stock === 0 && <Icon name="close-circle" size={12} color={colors.danger} />}
            </Pressable>
          );
        })}
      </View>
      {rx.some((x) => (medicines.find((m) => m.name === x.name)?.stock['phc-marwan'] ?? 0) === 0) && (
        <Banner tone="warning" title="Out of stock at PHC" body="Patient may need to collect it from CHC Kurhani or Jan Aushadhi." style={{ marginTop: spacing.md }} />
      )}
      {rx.map((m, i) => (
        <Card key={m.name} padding="md" style={{ marginTop: spacing.sm, gap: spacing.sm }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="title">{m.name}</Text>
            <Pressable onPress={() => setRx((r) => r.filter((_, j) => j !== i))} hitSlop={8} accessibilityLabel={`Remove ${m.name}`}>
              <Icon name="trash-outline" size={18} color={colors.danger} />
            </Pressable>
          </Row>
          <OptionChips value={m.dose} onChange={(dose) => updateMed(i, { dose })} options={doses.map((d) => ({ value: d, label: d }))} />
          <OptionChips value={m.days} onChange={(days) => updateMed(i, { days })} options={['3', '5', '7', '15', '30'].map((d) => ({ value: d, label: `${d} days` }))} />
        </Card>
      ))}

      <Spacer size="xl" />
      <SectionHeader title="Tests" />
      <Card style={{ gap: spacing.md }}>
        {labTests.slice(0, 6).map((t) => (
          <Checkbox key={t.id} checked={tests.includes(t.id)} onChange={() => setTests((s) => (s.includes(t.id) ? s.filter((x) => x !== t.id) : [...s, t.id]))} label={t.name} />
        ))}
      </Card>

      <Spacer size="xl" />
      <SectionHeader title="Follow-up" />
      <OptionChips
        value={followUp}
        onChange={setFollowUp}
        options={[
          { value: '3d', label: '3 days' },
          { value: '7d', label: '1 week' },
          { value: '30d', label: '1 month' },
          { value: 'none', label: 'Not needed' },
        ]}
      />
      <Spacer size="lg" />
      <Checkbox checked={refer} onChange={setRefer} label="Refer to higher facility after saving" />
      <Spacer size="lg" />
    </Screen>
  );
}
