import { AuthView, useAuthViewState } from '@clerk/expo/native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { CareHeroIllustration, colors } from '../src/design-system';

/** iOS / Android: Clerk's native SwiftUI / Jetpack Compose auth UI. Web uses sign-in.web.tsx. */
export default function SignInScreen() {
  const { isAuthFlowComplete } = useAuthViewState();

  useEffect(() => {
    if (isAuthFlowComplete) router.replace('/');
  }, [isAuthFlowComplete]);

  return (
    <View style={styles.root}>
      <AuthView
        mode="signInOrUp"
        isDismissible={false}
        logo={<CareHeroIllustration size={96} />}
        logoMaxHeight={96}
        onHostBack={() => router.replace('/onboarding')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
});
