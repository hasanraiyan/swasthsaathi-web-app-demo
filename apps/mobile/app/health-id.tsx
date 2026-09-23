import { useUser } from '@clerk/expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  Banner,
  Button,
  Card,
  Field,
  Header,
  Icon,
  ListItem,
  Row,
  Screen,
  Spacer,
  Text,
  colors,
  radius,
  spacing,
} from '../src/design-system';

const formatAbha = (digits: string) => digits.replace(/\D/g, '').slice(0, 14).replace(/^(\d{2})(\d{0,4})(\d{0,4})(\d{0,4}).*/, (_, a, b, c, d) => [a, b, c, d].filter(Boolean).join('-'));

export default function HealthId() {
  const { user } = useUser();
  const saved = user?.unsafeMetadata?.abha as string | undefined;
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const name = user?.fullName || user?.username || 'SwasthSaathi user';

  const link = async () => {
    const digits = input.replace(/\D/g, '');
    if (digits.length !== 14) {
      setError('ABHA number has 14 digits.');
      return;
    }
    setSaving(true);
    setError(undefined);
    try {
      await user?.update({ unsafeMetadata: { ...user.unsafeMetadata, abha: formatAbha(digits) } });
    } catch {
      setError('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!saved) {
    return (
      <Screen footer={<Button label="Link ABHA" size="lg" fullWidth loading={saving} onPress={link} />}>
        <Header title="Health ID (ABHA)" />
        <Banner
          tone="info"
          title="One ID for all your health records"
          body="Your Ayushman Bharat Health Account (ABHA) lets any government or private facility see your records — only with your consent."
        />
        <Spacer size="xl" />
        <Field
          label="ABHA number"
          placeholder="91-XXXX-XXXX-XXXX"
          keyboardType="number-pad"
          value={formatAbha(input)}
          onChangeText={setInput}
          error={error}
          hint="Find it on your ABHA card or in the ABHA app."
        />
        <Spacer size="xl" />
        <Card tone="tint" style={{ gap: spacing.sm }}>
          <Text variant="title">Don't have ABHA?</Text>
          <Text variant="small" color="textSecondary">
            Create one free at abha.abdm.gov.in with Aadhaar or driving licence, or ask your ASHA / ANM to create it for you at the sub-centre.
          </Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Health ID (ABHA)" />
      <View style={styles.card}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <Text variant="caption" style={{ color: colors.primarySoft }}>
              AYUSHMAN BHARAT HEALTH ACCOUNT
            </Text>
            <Text variant="h2" style={{ color: colors.textOnPrimary }}>
              {name}
            </Text>
          </View>
          <Icon name="shield-checkmark" size={28} color={colors.primarySoft} />
        </Row>
        <Row gap="lg" style={{ marginTop: spacing.lg, alignItems: 'flex-end' }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="caption" style={{ color: colors.primarySoft }}>
              ABHA number
            </Text>
            <Text variant="h3" style={{ color: colors.textOnPrimary, letterSpacing: 1 }}>
              {saved}
            </Text>
          </View>
          <View style={styles.qr}>
            <QRCode value={`abha:${saved.replace(/-/g, '')}`} size={92} color={colors.palette.green900} backgroundColor="#fff" />
          </View>
        </Row>
      </View>
      <Text variant="caption" color="textMuted" align="center" style={{ marginTop: spacing.sm }}>
        Show this QR at the registration counter to skip paperwork.
      </Text>

      <Spacer size="lg" />
      <Card padding="none">
        <View style={{ paddingHorizontal: spacing.md }}>
          <ListItem icon="document-text-outline" label="My health records" onPress={() => router.push('/records')} />
          <ListItem icon="key-outline" label="Consents & who can see my records" onPress={() => router.push('/privacy')} />
          <ListItem
            icon="share-social-outline"
            label="Share ABHA number"
            onPress={() => Share.share({ message: `My ABHA number: ${saved}` }).catch(() => {})}
          />
        </View>
      </Card>
      <Spacer size="md" />
      <Button
        label="Unlink ABHA"
        variant="ghost"
        onPress={() => user?.update({ unsafeMetadata: { ...user.unsafeMetadata, abha: undefined } })}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.primary },
  qr: { padding: spacing.sm, borderRadius: radius.md, backgroundColor: '#fff' },
});
