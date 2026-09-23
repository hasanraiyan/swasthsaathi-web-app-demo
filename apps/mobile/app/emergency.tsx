import { router } from 'expo-router';
import { Linking, Pressable, Share, StyleSheet, View } from 'react-native';
import { openDirections } from '../src/components/AppointmentCard';
import { facilities, facilityLevelLabel } from '../src/data/rural';
import { Banner, Card, Header, Icon, Row, Screen, SectionHeader, Spacer, Text, colors, radius, spacing } from '../src/design-system';
import { useI18n } from '../src/state/i18n';

const helplines = [
  { number: '108', label: 'Ambulance / Emergency', icon: 'medkit' as const },
  { number: '102', label: 'Mother & child transport (JSSK)', icon: 'woman' as const },
  { number: '104', label: 'Health advice helpline', icon: 'chatbubbles' as const },
  { number: '112', label: 'Police / all emergencies', icon: 'shield' as const },
];

const warningSigns = [
  'Chest pain or difficulty breathing',
  'Unconscious, fits or sudden weakness of one side',
  'Heavy bleeding, or bleeding in pregnancy',
  'Snake or dog bite, poisoning, severe burns',
  'Baby not feeding, very cold or very hot',
];

const call = (n: string) => Linking.openURL(`tel:${n}`).catch(() => {});

export default function Emergency() {
  const { t } = useI18n();
  const nearest24x7 = facilities.filter((f) => f.open24x7).sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <Screen>
      <Header title={t('emergency')} />

      <Pressable accessibilityRole="button" accessibilityLabel="Call 108" onPress={() => call('108')} style={({ pressed }) => [styles.big, pressed && { opacity: 0.9 }]}>
        <View style={styles.bigRing}>
          <Icon name="call" size={42} color={colors.danger} />
        </View>
        <Text variant="h1" style={{ color: colors.textOnPrimary }} align="center">
          {t('emergencyCall')}
        </Text>
        <Text variant="small" style={{ color: '#FFE4E2' }} align="center">
          Free, 24×7. Tap to call now.
        </Text>
      </Pressable>

      <Spacer size="md" />
      <Card
        onPress={() =>
          Share.share({ message: 'EMERGENCY: I need help. Please call me back or come to my location. — sent from SwasthSaathi' }).catch(() => {})
        }
      >
        <Row gap="md">
          <Icon name="share-social-outline" size={22} color={colors.danger} />
          <View style={{ flex: 1 }}>
            <Text variant="title">Alert family / ASHA</Text>
            <Text variant="small" color="textSecondary">
              Send an emergency message by SMS or WhatsApp
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.textMuted} />
        </Row>
      </Card>

      <Spacer size="xl" />
      <SectionHeader title="Nearest 24×7 facilities" />
      <View style={{ gap: spacing.sm }}>
        {nearest24x7.map((f) => (
          <Card key={f.id} padding="md">
            <Row gap="md">
              <View style={{ flex: 1 }}>
                <Text variant="title">{f.name}</Text>
                <Text variant="small" color="textSecondary">
                  {facilityLevelLabel[f.level]} · {f.distanceKm} km
                </Text>
                <Text variant="caption" color="textMuted" numberOfLines={1}>
                  {f.services.join(' · ')}
                </Text>
              </View>
              <Pressable accessibilityLabel={`Call ${f.name}`} onPress={() => call(f.phone.replace(/\s/g, ''))} style={styles.roundBtn}>
                <Icon name="call-outline" size={18} color={colors.primary} />
              </Pressable>
              <Pressable accessibilityLabel={`Directions to ${f.name}`} onPress={() => openDirections(f.name)} style={styles.roundBtn}>
                <Icon name="navigate-outline" size={18} color={colors.primary} />
              </Pressable>
            </Row>
          </Card>
        ))}
      </View>

      <Spacer size="xl" />
      <SectionHeader title="Other helplines" />
      <View style={{ gap: spacing.sm }}>
        {helplines.slice(1).map((h) => (
          <Card key={h.number} padding="md" onPress={() => call(h.number)}>
            <Row gap="md">
              <Icon name={h.icon} size={20} color={colors.primary} />
              <Text variant="bodyMedium" style={{ flex: 1 }}>
                {h.label}
              </Text>
              <Text variant="h3" color="primary">
                {h.number}
              </Text>
            </Row>
          </Card>
        ))}
      </View>

      <Spacer size="xl" />
      <Banner
        tone="danger"
        title="Go to hospital immediately if you see:"
        body={warningSigns.map((w) => `• ${w}`).join('\n')}
      />
      <Spacer size="md" />
      <Pressable onPress={() => router.replace('/triage')} style={{ alignSelf: 'center', padding: spacing.sm }}>
        <Text variant="smallMedium" color="primary">
          Not an emergency? Check symptoms instead →
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  big: { alignItems: 'center', gap: spacing.sm, padding: spacing.xxl, borderRadius: radius.xl, backgroundColor: colors.danger },
  bigRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#F7A8A3',
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
