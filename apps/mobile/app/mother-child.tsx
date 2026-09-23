import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { ancSchedule, immunisationSchedule } from '../src/data/rural';
import {
  Badge,
  Banner,
  Button,
  Card,
  Header,
  Icon,
  ProgressBar,
  Row,
  Screen,
  SegmentedControl,
  Spacer,
  Text,
  colors,
  spacing,
} from '../src/design-system';

const pregnancyDangerSigns = ['Bleeding', 'Severe headache / blurred vision', 'Swelling of face and hands', 'Fits', 'Baby moving less', 'High fever'];

export default function MotherChild() {
  const [tab, setTab] = useState<'pregnancy' | 'child'>('pregnancy');
  const weeks = 32;

  return (
    <Screen>
      <Header title="Mother & Child" />
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'pregnancy', label: 'Pregnancy care' },
          { value: 'child', label: 'Child vaccines' },
        ]}
      />
      <Spacer size="lg" />

      {tab === 'pregnancy' && (
        <View style={{ gap: spacing.lg }}>
          <Card tone="tint" style={{ gap: spacing.sm }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text variant="h2">{weeks} weeks</Text>
              <Badge label="3rd trimester" tone="info" />
            </Row>
            <ProgressBar value={(weeks / 40) * 100} />
            <Text variant="small" color="textSecondary">
              Expected delivery: 18 Nov 2026 · Plan delivery at PHC Marwan (24×7)
            </Text>
          </Card>

          <Text variant="h3">ANC check-ups</Text>
          <Card style={{ gap: spacing.md }}>
            {ancSchedule.map((a) => (
              <Row key={a.visit} gap="md">
                <Icon name={a.done ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={a.done ? colors.primary : colors.textMuted} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium">{a.visit}</Text>
                  <Text variant="small" color="textSecondary">
                    {a.window}
                  </Text>
                </View>
                {!a.done && a.due && <Badge label={`Due ${a.due}`} tone="warning" />}
              </Row>
            ))}
          </Card>
          <Button label="Book ANC visit" iconLeft="calendar-outline" fullWidth onPress={() => router.push('/queue')} />

          <Banner tone="danger" title="Go to hospital immediately if:" body={pregnancyDangerSigns.map((s) => `• ${s}`).join('\n')} action="108" onAction={() => router.push('/emergency')} />

          <Card style={{ gap: spacing.xs }}>
            <Text variant="title">Your entitlements</Text>
            <Text variant="small" color="textSecondary">
              • Free delivery, medicines, diet and transport under JSSK{'\n'}• Cash assistance under Janani Suraksha Yojana (JSY){'\n'}• Free check-up on the 9th of every month (PMSMA)
            </Text>
          </Card>
        </View>
      )}

      {tab === 'child' && (
        <View style={{ gap: spacing.lg }}>
          <Card tone="tint" style={{ gap: spacing.xs }}>
            <Text variant="h3">Aarav · 8 weeks</Text>
            <Text variant="small" color="textSecondary">
              Weight 3.4 kg · Next vaccines on 24 Sep at Kanti Sub-centre
            </Text>
          </Card>
          <Text variant="h3">Immunisation schedule</Text>
          <Card style={{ gap: spacing.lg }}>
            {immunisationSchedule.map((v) => (
              <Row key={v.age} gap="md" style={{ alignItems: 'flex-start' }}>
                <Icon name={v.done ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={v.done ? colors.primary : colors.textMuted} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium">{v.age}</Text>
                  <Text variant="small" color="textSecondary">
                    {v.vaccines}
                  </Text>
                </View>
                {!v.done && v.due && <Badge label={v.due} tone="warning" />}
              </Row>
            ))}
          </Card>
          <Banner tone="info" title="Vaccines are free" body="All vaccines under the Universal Immunisation Programme are free at government facilities." />
        </View>
      )}
    </Screen>
  );
}
