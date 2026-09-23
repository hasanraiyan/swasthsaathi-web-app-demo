import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  Banner,
  Button,
  Card,
  Checkbox,
  DoctorAvatar,
  Field,
  Header,
  Icon,
  OptionChips,
  RadioOption,
  Row,
  Screen,
  Spacer,
  Text,
  UrgencyBadge,
  colors,
  spacing,
} from '../../src/design-system';

type Mode = 'video' | 'audio' | 'chat';

export default function Teleconsult() {
  const params = useLocalSearchParams<{ triage?: 'urgent' | 'routine'; complaint?: string }>();
  const [mode, setMode] = useState<Mode>('video');
  const [speciality, setSpeciality] = useState('general');
  const [complaint, setComplaint] = useState(params.complaint ?? '');
  const [assisted, setAssisted] = useState(false);
  const [phase, setPhase] = useState<'form' | 'waiting' | 'ready'>('form');
  const [position, setPosition] = useState(3);

  // Simulated queue movement until the teleconsult backend is connected.
  useEffect(() => {
    if (phase !== 'waiting') return;
    const id = setInterval(() => {
      setPosition((p) => {
        if (p <= 1) {
          setPhase('ready');
          return 0;
        }
        return p - 1;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [phase]);

  if (phase !== 'form') {
    return (
      <Screen
        footer={
          phase === 'ready' ? (
            <Button
              label={mode === 'chat' ? 'Open chat' : 'Join call'}
              iconLeft={mode === 'video' ? 'videocam' : mode === 'audio' ? 'call' : 'chatbubbles'}
              size="lg"
              fullWidth
              onPress={() => router.replace({ pathname: '/teleconsult/call', params: { mode } })}
            />
          ) : (
            <Button label="Leave queue" variant="outline" size="lg" fullWidth onPress={() => setPhase('form')} />
          )
        }
      >
        <Header title="Waiting Room" />
        <View style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl }}>
          <DoctorAvatar size={120} variant="female" />
          {phase === 'waiting' ? (
            <>
              <Text variant="h1" align="center">
                You are #{position} in queue
              </Text>
              <Text color="textSecondary" align="center">
                About {position * 4} minutes. Keep this screen open — we'll alert you when the doctor is ready.
              </Text>
              <ActivityIndicator color={colors.primary} />
            </>
          ) : (
            <>
              <Text variant="h1" align="center">
                Doctor is ready
              </Text>
              <Text color="textSecondary" align="center">
                Dr. Ananya Sharma · PHC Marwan teleconsult hub
              </Text>
            </>
          )}
        </View>
        <Card style={{ gap: spacing.sm }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="title">Your request</Text>
            <UrgencyBadge level={params.triage ?? 'routine'} />
          </Row>
          <Text variant="small" color="textSecondary">
            {complaint || 'General consultation'}
          </Text>
          <Text variant="small" color="textSecondary">
            Mode: {mode === 'video' ? 'Video' : mode === 'audio' ? 'Audio only' : 'Chat'}
            {assisted ? ' · Assisted by health worker' : ''}
          </Text>
        </Card>
        <Spacer size="md" />
        <Banner tone="info" title="Keep ready" body="Previous prescriptions, reports, and the medicines you are taking now." />
      </Screen>
    );
  }

  return (
    <Screen
      footer={<Button label="Join queue" iconRight="arrow-forward" size="lg" fullWidth disabled={!complaint.trim()} onPress={() => setPhase('waiting')} />}
    >
      <Header title="Talk to a Doctor" />
      {params.triage === 'urgent' && (
        <>
          <Banner tone="warning" title="Priority consult" body="Your symptom check says you should see a doctor today. You'll be placed ahead in the queue." />
          <Spacer size="lg" />
        </>
      )}

      <Text variant="h3" style={{ marginBottom: spacing.md }}>
        How do you want to consult?
      </Text>
      <View style={{ gap: spacing.sm }}>
        <RadioOption icon="videocam-outline" label="Video call" sublabel="Best with 4G / Wi-Fi" selected={mode === 'video'} onPress={() => setMode('video')} />
        <RadioOption icon="call-outline" label="Audio only" sublabel="Works on 2G / weak network" selected={mode === 'audio'} onPress={() => setMode('audio')} />
        <RadioOption icon="chatbubbles-outline" label="Chat + photos" sublabel="Lowest data; doctor replies in minutes" selected={mode === 'chat'} onPress={() => setMode('chat')} />
      </View>

      <Text variant="h3" style={{ marginTop: spacing.xxl, marginBottom: spacing.md }}>
        Speciality
      </Text>
      <OptionChips
        value={speciality}
        onChange={setSpeciality}
        options={[
          { value: 'general', label: 'General' },
          { value: 'obgyn', label: 'Pregnancy / Women' },
          { value: 'paeds', label: 'Child' },
          { value: 'medicine', label: 'Diabetes / BP' },
          { value: 'derma', label: 'Skin' },
        ]}
      />

      <View style={{ marginTop: spacing.xxl, gap: spacing.lg }}>
        <Field label="Describe the problem" placeholder="e.g. Fever for 3 days, body ache" value={complaint} onChangeText={setComplaint} multiline />
        <Checkbox checked={assisted} onChange={setAssisted} label="An ASHA / ANM is helping me with this consult" />
        <Row gap="sm">
          <Icon name="lock-closed-outline" size={14} color={colors.textMuted} />
          <Text variant="caption" color="textMuted" style={{ flex: 1 }}>
            Your consult notes are added to your health record with your consent.
          </Text>
        </Row>
      </View>
    </Screen>
  );
}
