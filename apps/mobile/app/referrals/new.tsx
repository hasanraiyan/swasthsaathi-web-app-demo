import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { facilities, facilityLevelLabel, patientsStore, referralsStore, type Referral } from '../../src/data/rural';
import { Banner, Button, Checkbox, Field, Header, OptionChips, RadioOption, Screen, Spacer, Text, spacing } from '../../src/design-system';

export default function NewReferral() {
  const params = useLocalSearchParams<{ patientId?: string }>();
  const patients = patientsStore.use();
  const [patientId, setPatientId] = useState(params.patientId ?? patients[0]?.id);
  const [from, setFrom] = useState('sc-kanti');
  const [to, setTo] = useState('chc-kurhani');
  const [urgency, setUrgency] = useState<Referral['urgency']>('urgent');
  const [reason, setReason] = useState('');
  const [transport, setTransport] = useState(true);
  const [shareRecord, setShareRecord] = useState(true);

  const submit = () => {
    const id = `R-${2100 + Math.floor(Math.random() * 800)}`;
    const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    referralsStore.set((all) => [
      {
        id,
        patientId: patientId!,
        from,
        to,
        reason: reason.trim(),
        urgency,
        stage: 'created',
        createdAt: now,
        updates: [
          {
            stage: 'created',
            at: now,
            note: [transport && 'Transport requested', shareRecord && 'Health record shared with receiving facility'].filter(Boolean).join(' · ') || undefined,
          },
        ],
      },
      ...all,
    ]);
    router.replace({ pathname: '/referrals/[id]', params: { id } });
  };

  return (
    <Screen footer={<Button label="Send referral" iconRight="send" size="lg" fullWidth disabled={!reason.trim() || !patientId || from === to} onPress={submit} />}>
      <Header title="New Referral" />
      <View style={{ gap: spacing.xl }}>
        <View style={{ gap: spacing.md }}>
          <Text variant="h3">Patient</Text>
          <OptionChips value={patientId} onChange={setPatientId} options={patients.map((p) => ({ value: p.id, label: p.name }))} />
        </View>
        <View style={{ gap: spacing.md }}>
          <Text variant="h3">Urgency</Text>
          <OptionChips
            value={urgency}
            onChange={setUrgency}
            options={[
              { value: 'emergency', label: 'Emergency' },
              { value: 'urgent', label: 'Urgent (24 h)' },
              { value: 'routine', label: 'Routine' },
            ]}
          />
          {urgency === 'emergency' && <Banner tone="danger" title="Call 108 first" body="For emergencies, arrange the ambulance before filling this form." />}
        </View>
        <View style={{ gap: spacing.md }}>
          <Text variant="h3">From</Text>
          <OptionChips value={from} onChange={setFrom} options={facilities.map((f) => ({ value: f.id, label: f.name }))} />
        </View>
        <View style={{ gap: spacing.sm }}>
          <Text variant="h3">Refer to</Text>
          {facilities
            .filter((f) => f.id !== from)
            .map((f) => (
              <RadioOption
                key={f.id}
                icon="business-outline"
                label={f.name}
                sublabel={`${facilityLevelLabel[f.level]} · ${f.distanceKm} km · ${f.services.slice(0, 2).join(', ')}`}
                selected={to === f.id}
                onPress={() => setTo(f.id)}
              />
            ))}
        </View>
        <Field label="Reason for referral" placeholder="Findings, vitals, what has been done so far" value={reason} onChangeText={setReason} multiline />
        <Checkbox checked={transport} onChange={setTransport} label="Patient needs transport (102 / 108)" />
        <Checkbox checked={shareRecord} onChange={setShareRecord} label="Share health record with receiving facility (patient consented)" />
      </View>
      <Spacer size="lg" />
    </Screen>
  );
}
