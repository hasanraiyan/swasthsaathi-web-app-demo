import { useState } from 'react';
import { Switch, View } from 'react-native';
import { Banner, Card, Header, Row, Screen, Spacer, Text, colors, spacing } from '../src/design-system';

const initial = [
  { id: 'phc', title: 'PHC Marwan', body: 'Can view visits, prescriptions and lab reports', on: true },
  { id: 'chc', title: 'CHC Kurhani', body: 'Temporary access for referral R-2031 (expires in 7 days)', on: true },
  { id: 'asha', title: 'ASHA Rekha Kumari', body: 'Can view follow-up schedule and vitals', on: true },
  { id: 'research', title: 'Anonymous data for public-health planning', body: 'No name or phone number is shared', on: false },
];

export default function Privacy() {
  const [consents, setConsents] = useState(initial);
  return (
    <Screen>
      <Header title="Privacy & Consent" />
      <Banner tone="info" title="You control your records" body="Facilities can only see your records while you allow it. You can turn access off at any time." />
      <Spacer size="lg" />
      <View style={{ gap: spacing.sm }}>
        {consents.map((c) => (
          <Card key={c.id} padding="md">
            <Row gap="md">
              <View style={{ flex: 1 }}>
                <Text variant="title">{c.title}</Text>
                <Text variant="small" color="textSecondary">
                  {c.body}
                </Text>
              </View>
              <Switch
                value={c.on}
                onValueChange={(on) => setConsents((all) => all.map((x) => (x.id === c.id ? { ...x, on } : x)))}
                trackColor={{ true: colors.primaryMuted, false: colors.borderStrong }}
                thumbColor={colors.surface}
                accessibilityLabel={`Access for ${c.title}`}
              />
            </Row>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
