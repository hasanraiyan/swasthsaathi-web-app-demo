import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';
import {
  Banner,
  Button,
  Card,
  Checkbox,
  Header,
  Icon,
  OptionChips,
  ProgressBar,
  Row,
  Screen,
  Spacer,
  Text,
  colors,
  radius,
  spacing,
} from '../src/design-system';

type Who = 'self' | 'other';
type AgeGroup = 'infant' | 'child' | 'adult' | 'elderly';
type Symptom = 'fever' | 'breathing' | 'chest' | 'stomach' | 'pregnancy' | 'injury' | 'skin' | 'other';
type Duration = 'today' | '1-3' | '4-7' | 'week+';
type Level = 'emergency' | 'urgent' | 'routine';

const symptoms: { value: Symptom; label: string; icon: 'thermometer-outline' | 'cloud-outline' | 'heart-outline' | 'restaurant-outline' | 'woman-outline' | 'bandage-outline' | 'hand-left-outline' | 'help-circle-outline' }[] = [
  { value: 'fever', label: 'Fever', icon: 'thermometer-outline' },
  { value: 'breathing', label: 'Cough / breathing', icon: 'cloud-outline' },
  { value: 'chest', label: 'Chest pain', icon: 'heart-outline' },
  { value: 'stomach', label: 'Stomach / loose motions', icon: 'restaurant-outline' },
  { value: 'pregnancy', label: 'Pregnancy problem', icon: 'woman-outline' },
  { value: 'injury', label: 'Injury / bite / burn', icon: 'bandage-outline' },
  { value: 'skin', label: 'Skin / rash', icon: 'hand-left-outline' },
  { value: 'other', label: 'Something else', icon: 'help-circle-outline' },
];

const redFlagsBySymptom: Record<Symptom, string[]> = {
  fever: ['Fits / convulsions', 'Very drowsy or confused', 'Stiff neck', 'Bleeding from gums or nose'],
  breathing: ['Breathing very fast or with difficulty', 'Lips or face turning blue', 'Coughing blood'],
  chest: ['Pain spreading to arm, jaw or back', 'Sweating or fainting', 'Breathless'],
  stomach: ['Blood in stool or vomit', 'No urine for 8+ hours', 'Cannot keep any fluids down'],
  pregnancy: ['Bleeding from vagina', 'Severe headache or blurred vision', 'Fits', 'Baby moving less', 'Water broke'],
  injury: ['Heavy bleeding that will not stop', 'Snake bite', 'Head injury with vomiting', 'Large burn'],
  skin: ['Swelling of face or lips', 'Rash with high fever'],
  other: ['Unconscious or fainting', 'Sudden weakness of one side of body', 'Severe pain'],
};

const common = ['Unconscious or unresponsive'];

function assess(a: { age?: AgeGroup; symptom?: Symptom; flags: string[]; duration?: Duration }): Level {
  if (a.flags.length > 0 || a.symptom === 'chest') return 'emergency';
  if (a.symptom === 'pregnancy') return 'urgent';
  if ((a.age === 'infant' || a.age === 'elderly') && a.symptom !== 'skin') return 'urgent';
  if (a.duration === '4-7' || a.duration === 'week+') return 'urgent';
  return 'routine';
}

const result: Record<Level, { title: string; body: string; tone: 'danger' | 'warning' | 'success' }> = {
  emergency: {
    title: 'Emergency — get help now',
    body: 'These signs can be life-threatening. Call 108 and go to the nearest 24×7 hospital. Do not wait for an appointment.',
    tone: 'danger',
  },
  urgent: {
    title: 'See a doctor today',
    body: 'Talk to a doctor within the next few hours. A teleconsult is the fastest option; the doctor can refer you if needed.',
    tone: 'warning',
  },
  routine: {
    title: 'Home care + routine consult',
    body: 'Rest, drink plenty of fluids and watch for warning signs. Book a routine visit or teleconsult if it does not improve in 2–3 days.',
    tone: 'success',
  },
};

export default function Triage() {
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<Who>('self');
  const [age, setAge] = useState<AgeGroup>();
  const [symptom, setSymptom] = useState<Symptom>();
  const [flags, setFlags] = useState<string[]>([]);
  const [duration, setDuration] = useState<Duration>();

  const totalSteps = 4;
  const level = assess({ age, symptom, flags, duration });
  const canNext = [!!age, !!symptom, true, !!duration][step];
  const toggleFlag = (f: string) => setFlags((xs) => (xs.includes(f) ? xs.filter((x) => x !== f) : [...xs, f]));

  const footer =
    step < totalSteps ? (
      <Row gap="sm">
        {step > 0 && <Button label="Back" variant="outline" size="lg" onPress={() => setStep((s) => s - 1)} style={{ flex: 1 }} />}
        <Button
          label={step === totalSteps - 1 ? 'See result' : 'Next'}
          iconRight="arrow-forward"
          size="lg"
          disabled={!canNext}
          onPress={() => setStep((s) => s + 1)}
          style={{ flex: 2 }}
          fullWidth
        />
      </Row>
    ) : null;

  return (
    <Screen footer={footer}>
      <Header title="Check Symptoms" />
      {step < totalSteps && (
        <>
          <ProgressBar value={((step + 1) / totalSteps) * 100} />
          <Text variant="caption" color="textMuted" style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
            Step {step + 1} of {totalSteps}
          </Text>
        </>
      )}

      {step === 0 && (
        <View style={{ gap: spacing.xl }}>
          <View style={{ gap: spacing.md }}>
            <Text variant="h2">Who is unwell?</Text>
            <OptionChips
              value={who}
              onChange={setWho}
              options={[
                { value: 'self', label: 'Me' },
                { value: 'other', label: 'Someone else (assisted)' },
              ]}
            />
          </View>
          <View style={{ gap: spacing.md }}>
            <Text variant="h3">Age group</Text>
            <OptionChips
              value={age}
              onChange={setAge}
              options={[
                { value: 'infant', label: 'Under 1 year' },
                { value: 'child', label: '1–12 years' },
                { value: 'adult', label: '13–59 years' },
                { value: 'elderly', label: '60+ years' },
              ]}
            />
          </View>
        </View>
      )}

      {step === 1 && (
        <View style={{ gap: spacing.md }}>
          <Text variant="h2">What is the main problem?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {symptoms.map((s) => {
              const active = symptom === s.value;
              return (
                <Card
                  key={s.value}
                  padding="md"
                  onPress={() => {
                    setSymptom(s.value);
                    setFlags([]);
                  }}
                  style={{
                    width: '48.5%',
                    gap: spacing.sm,
                    borderColor: active ? colors.primary : colors.border,
                    backgroundColor: active ? colors.primaryTint : colors.surface,
                  }}
                >
                  <Icon name={s.icon} size={24} color={active ? colors.primary : colors.textSecondary} />
                  <Text variant="smallMedium">{s.label}</Text>
                </Card>
              );
            })}
          </View>
        </View>
      )}

      {step === 2 && symptom && (
        <View style={{ gap: spacing.md }}>
          <Text variant="h2">Any of these danger signs?</Text>
          <Text color="textSecondary">Tick all that apply. Leave empty if none.</Text>
          <Card style={{ gap: spacing.lg }}>
            {[...redFlagsBySymptom[symptom], ...common].map((f) => (
              <Checkbox key={f} checked={flags.includes(f)} onChange={() => toggleFlag(f)} label={f} />
            ))}
          </Card>
          {flags.length > 0 && <Banner tone="danger" title="Danger sign selected" body="This needs emergency care. You can call 108 right now." action="Call 108" onAction={() => Linking.openURL('tel:108')} />}
        </View>
      )}

      {step === 3 && (
        <View style={{ gap: spacing.md }}>
          <Text variant="h2">Since when?</Text>
          <OptionChips
            value={duration}
            onChange={setDuration}
            options={[
              { value: 'today', label: 'Today' },
              { value: '1-3', label: '1–3 days' },
              { value: '4-7', label: '4–7 days' },
              { value: 'week+', label: 'More than a week' },
            ]}
          />
        </View>
      )}

      {step === totalSteps && (
        <View style={{ gap: spacing.lg }}>
          <View
            style={{
              alignItems: 'center',
              gap: spacing.sm,
              padding: spacing.xxl,
              borderRadius: radius.xl,
              backgroundColor: level === 'emergency' ? colors.dangerSoft : level === 'urgent' ? colors.warningSoft : colors.primarySoft,
            }}
          >
            <Icon
              name={level === 'emergency' ? 'alert-circle' : level === 'urgent' ? 'time' : 'checkmark-circle'}
              size={56}
              color={level === 'emergency' ? colors.danger : level === 'urgent' ? '#B7791F' : colors.primary}
            />
            <Text variant="h2" align="center">
              {result[level].title}
            </Text>
            <Text color="textSecondary" align="center">
              {result[level].body}
            </Text>
          </View>

          {level === 'emergency' && (
            <>
              <Button label="Call 108 Ambulance" iconLeft="call" size="lg" fullWidth onPress={() => Linking.openURL('tel:108')} style={{ backgroundColor: colors.danger }} />
              <Button label="Nearest 24×7 hospital" variant="outline" fullWidth onPress={() => router.push('/emergency')} />
            </>
          )}
          {level !== 'emergency' && (
            <>
              <Button
                label={level === 'urgent' ? 'Talk to a doctor now' : 'Teleconsult'}
                iconLeft="videocam-outline"
                size="lg"
                fullWidth
                onPress={() => router.push({ pathname: '/teleconsult', params: { triage: level, complaint: symptoms.find((s) => s.value === symptom)?.label } })}
              />
              <Button label="Book a visit at PHC" variant="outline" fullWidth onPress={() => router.push('/doctors')} />
              <Button label="Get OPD token" variant="ghost" fullWidth onPress={() => router.push('/queue')} />
            </>
          )}

          <Card tone="tint">
            <Text variant="small" color="textSecondary">
              This check is guidance only and does not replace a doctor. If you are unsure or feel worse, call 108 or 104 (health advice).
            </Text>
          </Card>
          <Button label="Start again" variant="ghost" onPress={() => { setStep(0); setFlags([]); setSymptom(undefined); setDuration(undefined); }} />
        </View>
      )}
      <Spacer size="lg" />
    </Screen>
  );
}
