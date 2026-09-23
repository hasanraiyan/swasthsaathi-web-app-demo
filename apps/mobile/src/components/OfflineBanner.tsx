import Ionicons from '@expo/vector-icons/Ionicons';
import { useNetworkState } from 'expo-network';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, colors, spacing } from '../design-system';
import { useI18n } from '../state/i18n';

/** Shown app-wide whenever the device has no internet, so frontline workers know data is queued locally. */
export function OfflineBanner() {
  const net = useNetworkState();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const offline = net.isConnected === false || net.isInternetReachable === false;
  if (!offline) return null;
  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.xs }]} accessibilityRole="alert">
      <Ionicons name="cloud-offline-outline" size={16} color={colors.textOnPrimary} />
      <Text variant="caption" style={{ color: colors.textOnPrimary, flex: 1 }}>
        {t('offline')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.palette.gray700,
  },
});
