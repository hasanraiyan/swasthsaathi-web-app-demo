import { useAuth } from '@clerk/expo';
import { Redirect, router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
  Button,
  CareHeroIllustration,
  DoctorPromoIllustration,
  Icon,
  Text,
  colors,
  radius,
  spacing,
} from '../src/design-system';

const features = [
  { icon: 'calendar-outline', label: 'Book\nAppointments' },
  { icon: 'people-outline', label: 'Trusted\nDoctors' },
  { icon: 'document-text-outline', label: 'Digital\nHealth Records' },
  { icon: 'notifications-outline', label: 'Smarter\nHealthcare' },
] as const;

type Slide = { key: string; title?: string; subtitle: string; body?: string };

const slides: Slide[] = [
  { key: 'brand', subtitle: 'Your Health, Our Support' },
  {
    key: 'doctors',
    title: 'Verified doctors near you',
    subtitle: 'Consult trusted specialists',
    body: 'Browse ratings, qualifications and live availability, then pick a slot that works for you.',
  },
  {
    key: 'records',
    title: 'All your records, one place',
    subtitle: 'Digital health records',
    body: 'Prescriptions, lab reports and visit notes stay safe and ready whenever you need them.',
  },
];

export default function Onboarding() {
  const { isLoaded, isSignedIn } = useAuth();
  const { width: windowWidth } = useWindowDimensions();
  // Phone carousel stays narrow; tablets/laptops get a wider centered column.
  const width = Math.min(windowWidth, windowWidth >= 1024 ? 720 : 560);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  if (isLoaded && isSignedIn) return <Redirect href="/" />;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const goToAuth = () => router.replace('/sign-in');
  const next = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex(index + 1);
    } else goToAuth();
  };

  return (
    <View style={styles.root}>
      <DecorBlobs />
      <SafeAreaView style={styles.safe}>
        <View style={[styles.column, { width }]}>
          <View style={styles.topBar}>
            <Pressable onPress={goToAuth} hitSlop={12} accessibilityRole="button">
              <Text variant="bodyMedium" color="textSecondary">
                Skip
              </Text>
            </Pressable>
          </View>

          <FlatList
            ref={listRef}
            data={slides}
            keyExtractor={(s) => s.key}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            style={{ flexGrow: 1 }}
            renderItem={({ item }) => (
              <View style={[styles.slide, { width }]}>
                {item.key === 'brand' ? <BrandSlide /> : <InfoSlide slide={item} />}
              </View>
            )}
          />

          <View style={styles.dots}>
            {slides.map((s, i) => (
              <View key={s.key} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>

          <View style={styles.footer}>
            <Button
              label={index === 0 || index === slides.length - 1 ? 'Get Started' : 'Next'}
              iconRight="arrow-forward"
              size="lg"
              fullWidth
              onPress={next}
            />
            <Text variant="small" color="textSecondary" align="center">
              A healthier tomorrow, together
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function BrandSlide() {
  return (
    <View style={styles.center}>
      <CareHeroIllustration size={250} />
      <Text variant="display" align="center" style={{ marginTop: spacing.sm }}>
        Swasth<Text variant="display" color="primaryMuted">Saathi</Text>
      </Text>
      <Text variant="h3" color="textSecondary" align="center" style={{ fontFamily: 'Inter_500Medium' }}>
        Your Health, Our Support
      </Text>
      <View style={styles.features}>
        {features.map((f) => (
          <View key={f.icon} style={styles.feature}>
            <Icon name={f.icon} size={28} color={colors.text} />
            <Text variant="caption" color="textSecondary" align="center">
              {f.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function InfoSlide({ slide }: { slide: Slide }) {
  return (
    <View style={styles.center}>
      <View style={styles.infoArt}>
        {slide.key === 'doctors' ? (
          <DoctorPromoIllustration size={180} />
        ) : (
          <Icon name="document-text" size={120} color={colors.primaryMuted} />
        )}
      </View>
      <Text variant="caption" color="primary" align="center" style={styles.eyebrow}>
        {slide.subtitle.toUpperCase()}
      </Text>
      <Text variant="h1" align="center">
        {slide.title}
      </Text>
      <Text color="textSecondary" align="center" style={{ maxWidth: 320 }}>
        {slide.body}
      </Text>
    </View>
  );
}

function DecorBlobs() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <Path d="M260 0c10 70 70 120 140 110V0z" fill={colors.primarySoft} />
        <Path d="M0 560c60 20 110 90 90 240H0z" fill={colors.primaryTint} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F1F8F4' },
  safe: { flex: 1, alignItems: 'center' },
  column: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  slide: { paddingHorizontal: spacing.xxl, justifyContent: 'center' },
  center: { alignItems: 'center', gap: spacing.sm },
  features: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', marginTop: spacing.xxxl },
  feature: { alignItems: 'center', gap: spacing.sm, flex: 1 },
  infoArt: {
    width: 240,
    height: 240,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  eyebrow: { letterSpacing: 1.2 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs + 2, paddingVertical: spacing.xl },
  dot: { width: 14, height: 4, borderRadius: 2, backgroundColor: colors.primaryOutline },
  dotActive: { width: 26, backgroundColor: colors.primary },
  footer: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xl, gap: spacing.lg },
});
