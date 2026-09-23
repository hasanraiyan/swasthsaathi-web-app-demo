import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
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
} from '../../src/design-system';

type Mode = 'video' | 'audio' | 'chat';

export default function Call() {
  const params = useLocalSearchParams<{ mode?: Mode }>();
  const [mode, setMode] = useState<Mode>(params.mode ?? 'video');
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (ended) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [ended]);

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  if (ended) {
    return (
      <Screen footer={<Button label="Done" size="lg" fullWidth onPress={() => router.dismissAll()} />}>
        <Header title="Consultation Summary" onBack={() => router.dismissAll()} />
        <Card style={{ gap: spacing.lg }}>
          <Row gap="md">
            <DoctorAvatar size={56} variant="female" />
            <View style={{ flex: 1 }}>
              <Text variant="h3">Dr. Ananya Sharma</Text>
              <Text variant="small" color="textSecondary">
                General Physician · {mmss} consult
              </Text>
            </View>
          </Row>
          <InfoRow icon="clipboard-outline" title="Diagnosis" subtitle="Viral fever (provisional)" />
          <InfoRow icon="medical-outline" title="e-Prescription" subtitle="Paracetamol 500mg — 1 tablet 3× a day for 3 days · ORS as needed" />
          <InfoRow icon="flask-outline" title="Tests advised" subtitle="Complete Blood Count if fever continues beyond 3 days" />
          <InfoRow icon="calendar-outline" title="Follow-up" subtitle="Teleconsult in 3 days, or earlier if danger signs" />
        </Card>
        <Spacer size="md" />
        <Row gap="sm">
          <Button label="Find medicine" variant="outline" iconLeft="medical-outline" onPress={() => router.replace('/medicines')} style={{ flex: 1 }} fullWidth />
          <Button label="Book test" variant="outline" iconLeft="flask-outline" onPress={() => router.replace('/diagnostics')} style={{ flex: 1 }} fullWidth />
        </Row>
      </Screen>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.top}>
          <Text variant="title" style={{ color: '#fff' }}>
            Dr. Ananya Sharma
          </Text>
          <Text variant="small" style={{ color: '#BFE1D2' }}>
            {mode === 'video' ? 'Video' : mode === 'audio' ? 'Audio' : 'Chat'} · {mmss}
          </Text>
        </View>

        <View style={styles.stage}>
          <DoctorAvatar size={mode === 'video' ? 220 : 150} variant="female" />
          {mode !== 'video' && (
            <Text variant="small" style={{ color: '#BFE1D2', marginTop: spacing.md }}>
              {mode === 'audio' ? 'Audio only — saving data' : 'Chat mode'}
            </Text>
          )}
          {mode === 'video' && (
            <View style={styles.selfView}>
              <Icon name="person" size={40} color="#5BAA8F" />
              <Text variant="caption" style={{ color: '#BFE1D2' }}>
                You
              </Text>
            </View>
          )}
        </View>

        <View style={styles.signal}>
          <Icon name="cellular" size={14} color="#BFE1D2" />
          <Text variant="caption" style={{ color: '#BFE1D2' }}>
            Weak network? Switch to audio to keep the call stable.
          </Text>
        </View>

        <View style={styles.controls}>
          <CallButton icon={muted ? 'mic-off' : 'mic'} label={muted ? 'Unmute' : 'Mute'} onPress={() => setMuted((m) => !m)} />
          <CallButton
            icon={mode === 'video' ? 'videocam-off' : 'videocam'}
            label={mode === 'video' ? 'Audio only' : 'Video'}
            onPress={() => setMode((m) => (m === 'video' ? 'audio' : 'video'))}
          />
          <CallButton icon="document-attach" label="Share report" onPress={() => {}} />
          <CallButton icon="call" label="End" danger onPress={() => setEnded(true)} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function CallButton({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: ComponentProps<typeof Icon>['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ alignItems: 'center', gap: spacing.xs }}>
      <View style={[styles.callBtn, danger && { backgroundColor: colors.danger, transform: [{ rotate: '135deg' }] }]}>
        <Icon name={icon} size={24} color="#fff" />
      </View>
      <Text variant="caption" style={{ color: '#DDF0E7' }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.palette.green900 },
  top: { alignItems: 'center', paddingTop: spacing.lg, gap: 2 },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  selfView: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 96,
    height: 128,
    borderRadius: radius.md,
    backgroundColor: colors.palette.green800,
    borderWidth: 2,
    borderColor: colors.palette.green600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signal: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center', justifyContent: 'center', paddingBottom: spacing.md },
  controls: { flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: spacing.xl },
  callBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
