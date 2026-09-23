import { useUser } from '@clerk/expo';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppointmentCard } from '../../src/components/AppointmentCard';
import { useAppointments } from '../../src/data/appointments';
import { healthTips } from '../../src/data/mock';
import { getFacility, myTokenStore, referralsStore } from '../../src/data/rural';
import {
  Button,
  Card,
  DashedButton,
  DoctorPromoIllustration,
  Grid,
  Icon,
  IconButton,
  ProgressBar,
  QuickAction,
  Row,
  Screen,
  SectionHeader,
  Spacer,
  Text,
  colors,
  radius,
  spacing,
} from '../../src/design-system';
import { useI18n } from '../../src/state/i18n';

export default function Home() {
  const { user } = useUser();
  const { t } = useI18n();
  const firstName = user?.firstName || user?.username || '';
  const next = useAppointments()
    .filter((a) => a.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const token = myTokenStore.use();
  const openReferrals = referralsStore.use().filter((r) => !['treated', 'closed'].includes(r.stage)).length;
  const tip = healthTips[0]!;

  return (
    <Screen>
      <Row style={styles.greeting}>
        <View style={{ flex: 1 }}>
          <Text variant="h1">
            {t('hello')}
            {firstName ? `, ${firstName}` : ''} 👋
          </Text>
          <Text variant="small" color="textSecondary">
            {t('tagline')}
          </Text>
        </View>
        <IconButton icon="notifications-outline" label="Notifications" bordered onPress={() => router.push('/notifications')} />
      </Row>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('emergencyCall')}
        onPress={() => router.push('/emergency')}
        style={({ pressed }) => [styles.sos, pressed && { opacity: 0.9 }]}
      >
        <View style={styles.sosIcon}>
          <Icon name="call" size={20} color={colors.danger} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="title" style={{ color: colors.textOnPrimary }}>
            {t('emergency')}
          </Text>
          <Text variant="small" style={{ color: '#FFE4E2' }}>
            {t('emergencyCall')} · nearest 24×7 hospital
          </Text>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textOnPrimary} />
      </Pressable>
      <Spacer size="md" />

      <Pressable accessibilityRole="search" onPress={() => router.push('/doctors')} style={styles.search}>
        <Icon name="search-outline" size={20} color={colors.textMuted} />
        <Text variant="small" color="textMuted" numberOfLines={1}>
          {t('search')}
        </Text>
      </Pressable>
      <Spacer size="xl" />

      <SectionHeader title={t('services')} />
      <Grid columns={4}>
        <QuickAction icon="pulse-outline" label={t('symptomCheck')} onPress={() => router.push('/triage')} tint={colors.danger} background={colors.dangerSoft} />
        <QuickAction icon="videocam-outline" label={t('teleconsult')} onPress={() => router.push('/teleconsult')} tint={colors.info} background={colors.infoSoft} />
        <QuickAction icon="ticket-outline" label={t('queue')} onPress={() => router.push('/queue')} />
        <QuickAction icon="medical-outline" label={t('medicines')} onPress={() => router.push('/medicines')} tint={colors.warning} background={colors.warningSoft} />
        <QuickAction icon="flask-outline" label={t('labTests')} onPress={() => router.push('/diagnostics')} tint={colors.accent} background={colors.accentSoft} />
        <QuickAction
          icon="git-branch-outline"
          label={t('referrals')}
          onPress={() => router.push('/referrals')}
          badge={openReferrals ? String(openReferrals) : undefined}
        />
        <QuickAction icon="woman-outline" label={t('motherChild')} onPress={() => router.push('/mother-child')} tint={colors.danger} background={colors.dangerSoft} />
        <QuickAction icon="id-card-outline" label={t('healthId')} onPress={() => router.push('/health-id')} tint={colors.info} background={colors.infoSoft} />
      </Grid>
      <Spacer size="lg" />

      {token && (
        <>
          <Card onPress={() => router.push('/queue')} style={{ gap: spacing.sm }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View>
                <Text variant="caption" color="textSecondary">
                  {getFacility(token.facilityId)?.name} · {token.department}
                </Text>
                <Text variant="h2">Token #{token.token}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text variant="caption" color="textSecondary">
                  Now serving
                </Text>
                <Text variant="h2" color="primary">
                  #{token.nowServing}
                </Text>
              </View>
            </Row>
            <ProgressBar value={(token.nowServing / token.token) * 100} />
            <Text variant="small" color="textSecondary">
              {Math.max(0, token.token - token.nowServing)} ahead · about {Math.max(0, token.token - token.nowServing) * token.avgMinsPerPatient} min wait
            </Text>
          </Card>
          <Spacer size="xl" />
        </>
      )}

      <SectionHeader title="Upcoming Appointments" action="View All" onAction={() => router.navigate('/appointments')} />
      {next ? <AppointmentCard appointment={next} /> : <DashedButton label="Book your first appointment" onPress={() => router.push('/doctors')} />}
      <Spacer size="xl" />

      <Card tone="tint" padding="xl" style={styles.promo}>
        <View style={{ maxWidth: '62%', gap: spacing.sm, zIndex: 1 }}>
          <Text variant="h2">Book Appointments in Minutes</Text>
          <Text variant="small" color="textSecondary">
            Consult verified doctors near you
          </Text>
          <Button label="Book Now" size="sm" iconRight="arrow-forward" onPress={() => router.push('/doctors')} style={{ marginTop: spacing.xs }} />
        </View>
        <View style={styles.promoArt}>
          <DoctorPromoIllustration size={120} />
        </View>
      </Card>
      <Spacer size="xl" />

      <SectionHeader title={t('healthTips')} action="See All" onAction={() => router.navigate('/health-tips')} />
      <Card tone="tint">
        <Row gap="md">
          <View style={styles.tipIcon}>
            <Icon name={tip.icon} size={22} color={colors.primaryMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="title">{tip.title}</Text>
            <Text variant="small" color="textSecondary">
              {tip.body}
            </Text>
          </View>
        </Row>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { paddingTop: spacing.lg, paddingBottom: spacing.lg, alignItems: 'flex-start' },
  sos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.danger,
  },
  sosIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 50,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promo: { flexDirection: 'row', overflow: 'hidden', minHeight: 170, borderColor: colors.primarySoft },
  promoArt: { position: 'absolute', right: 0, bottom: -4 },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
