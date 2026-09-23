import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { facilities, facilityLevelLabel, getFacility, myTokenStore } from '../src/data/rural';
import {
  Banner,
  Button,
  Card,
  Header,
  OptionChips,
  ProgressBar,
  RadioOption,
  Row,
  Screen,
  Spacer,
  Text,
  colors,
  radius,
  spacing,
} from '../src/design-system';

const departments = ['General OPD', 'ANC / Pregnancy', 'Child (Paediatrics)', 'NCD clinic (BP / Sugar)', 'Dental', 'Eye'];

export default function Queue() {
  const token = myTokenStore.use();
  const [facilityId, setFacilityId] = useState('phc-marwan');
  const [dept, setDept] = useState(departments[0]!);

  // Simulate the counter advancing until the facility queue API is connected.
  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => {
      myTokenStore.set((t) => (t && t.nowServing < t.token ? { ...t, nowServing: t.nowServing + 1 } : t));
    }, 8000);
    return () => clearInterval(id);
  }, [token?.token]);

  if (token) {
    const ahead = Math.max(0, token.token - token.nowServing);
    const yourTurn = ahead === 0;
    return (
      <Screen footer={<Button label="Cancel token" variant="outline" size="lg" fullWidth onPress={() => myTokenStore.set(null)} />}>
        <Header title="OPD Token" />
        <View style={[styles.ticket, yourTurn && { backgroundColor: colors.primary }]}>
          <Text variant="small" style={{ color: yourTurn ? colors.primarySoft : colors.textSecondary }}>
            {getFacility(token.facilityId)?.name} · {token.department}
          </Text>
          <Text style={[styles.tokenNo, { color: yourTurn ? colors.textOnPrimary : colors.text }]}>#{token.token}</Text>
          <Text variant="h3" style={{ color: yourTurn ? colors.textOnPrimary : colors.primary }}>
            {yourTurn ? "It's your turn — go to the counter" : `${ahead} people ahead of you`}
          </Text>
        </View>
        <Spacer size="lg" />
        <Card style={{ gap: spacing.md }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="bodyMedium">Now serving</Text>
            <Text variant="h2" color="primary">
              #{token.nowServing}
            </Text>
          </Row>
          <ProgressBar value={(token.nowServing / token.token) * 100} />
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="small" color="textSecondary">
              Estimated wait
            </Text>
            <Text variant="smallMedium">{ahead * token.avgMinsPerPatient} min</Text>
          </Row>
        </Card>
        <Spacer size="md" />
        <Banner
          tone="info"
          title="Wait at home, not in the line"
          body="Leave home when about 5 people are ahead. This screen updates as the queue moves."
        />
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <Button
          label="Get token"
          iconRight="ticket-outline"
          size="lg"
          fullWidth
          onPress={() => myTokenStore.set({ facilityId, department: dept, token: 41, nowServing: 29, avgMinsPerPatient: 6 })}
        />
      }
    >
      <Header title="OPD Token" />
      <Text color="textSecondary" style={{ marginBottom: spacing.lg }}>
        Get a token before you leave home and track the queue live.
      </Text>
      <Text variant="h3" style={{ marginBottom: spacing.md }}>
        Facility
      </Text>
      <View style={{ gap: spacing.sm }}>
        {facilities
          .filter((f) => f.level !== 'SC')
          .map((f) => (
            <RadioOption
              key={f.id}
              icon="business-outline"
              label={f.name}
              sublabel={`${facilityLevelLabel[f.level]} · ${f.distanceKm} km · ~${f.level === 'DH' ? 70 : f.level === 'CHC' ? 45 : 25} min wait now`}
              selected={facilityId === f.id}
              onPress={() => setFacilityId(f.id)}
            />
          ))}
      </View>
      <Text variant="h3" style={{ marginTop: spacing.xxl, marginBottom: spacing.md }}>
        Department
      </Text>
      <OptionChips value={dept} onChange={setDept} options={departments.map((d) => ({ value: d, label: d }))} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  ticket: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xxl,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primaryOutline,
    backgroundColor: colors.surface,
  },
  tokenNo: { fontFamily: 'Inter_800ExtraBold', fontSize: 72, lineHeight: 80 },
});
