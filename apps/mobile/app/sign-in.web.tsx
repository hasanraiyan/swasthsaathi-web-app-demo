import { useAuth } from '@clerk/expo';
import { SignIn } from '@clerk/expo/web';
import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { CareHeroIllustration, Text, colors, radius, spacing } from '../src/design-system';

/** Web: Clerk's prebuilt <SignIn/> themed with SwasthSaathi tokens. */
export default function SignInWeb() {
  const { isLoaded, isSignedIn } = useAuth();
  if (isLoaded && isSignedIn) return <Redirect href="/" />;

  return (
    <View style={styles.root}>
      <View style={styles.brand}>
        <CareHeroIllustration size={120} />
        <Text variant="h1" align="center">
          Swasth<Text variant="h1" color="primaryMuted">Saathi</Text>
        </Text>
        <Text color="textSecondary" align="center">
          Your Health, Our Support
        </Text>
      </View>
      <SignIn
        routing="hash"
        withSignUp
        fallbackRedirectUrl="/"
        appearance={{
          variables: {
            colorPrimary: colors.primary,
            colorForeground: colors.text,
            colorMutedForeground: colors.textSecondary,
            colorBackground: colors.surface,
            colorInput: colors.surface,
            colorBorder: colors.border,
            colorDanger: colors.danger,
            fontFamily: 'Inter_400Regular, system-ui, sans-serif',
            borderRadius: `${radius.md}px`,
          },
          elements: {
            card: { boxShadow: '0 8px 24px rgba(16,61,50,0.10)', border: `1px solid ${colors.border}` },
            formButtonPrimary: { borderRadius: `${radius.pill}px`, height: '44px', textTransform: 'none' },
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: '100%' as never,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.xl,
    backgroundColor: '#F1F8F4',
  },
  brand: { alignItems: 'center', gap: spacing.xs },
});
