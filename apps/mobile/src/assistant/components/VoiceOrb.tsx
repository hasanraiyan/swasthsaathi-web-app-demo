import Ionicons from '@expo/vector-icons/Ionicons';
import type { PersonaVoiceState } from '@personaai/react';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../../design-system';

const tone: Record<PersonaVoiceState, { core: string; ring: string }> = {
  idle: { core: colors.primaryMuted, ring: colors.primarySoft },
  connecting: { core: colors.primaryMuted, ring: colors.primarySoft },
  listening: { core: colors.primary, ring: colors.primaryOutline },
  thinking: { core: colors.accent, ring: colors.accentSoft },
  speaking: { core: colors.success, ring: colors.primaryOutline },
  error: { core: colors.danger, ring: colors.dangerSoft },
  ended: { core: colors.textMuted, ring: colors.surfaceMuted },
};

/**
 * Voice-state orb — stands in for the example's `orb-ui` (web-only). Two rings breathe
 * while the call is live: slow while listening, fast while the assistant speaks.
 */
export function VoiceOrb({ state, size = 160, muted = false }: { state: PersonaVoiceState; size?: number; muted?: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const live = state === 'listening' || state === 'speaking';
  const busy = state === 'connecting' || state === 'thinking';

  useEffect(() => {
    pulse.stopAnimation();
    pulse.setValue(0);
    if (!live || muted) return;
    const duration = state === 'speaking' ? 650 : 1400;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [live, muted, pulse, state]);

  useEffect(() => {
    spin.setValue(0);
    if (!busy) return;
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [busy, spin]);

  const { core, ring } = tone[state];
  const outer = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  const inner = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const icon = muted ? 'mic-off' : state === 'speaking' ? 'volume-high' : state === 'error' ? 'alert' : 'mic';

  return (
    <View style={{ width: size * 1.25, height: size * 1.25, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel={`Voice ${state}`}>
      <Animated.View
        style={[styles.ring, { width: size * 1.2, height: size * 1.2, borderRadius: size, backgroundColor: ring, opacity: 0.5, transform: [{ scale: outer }] }]}
      />
      <Animated.View
        style={[styles.ring, { width: size, height: size, borderRadius: size, backgroundColor: ring, transform: [{ scale: inner }] }]}
      />
      {busy && (
        <Animated.View
          style={[
            styles.ring,
            { width: size * 0.82, height: size * 0.82, borderRadius: size, borderWidth: 3, borderColor: core, borderTopColor: 'transparent', transform: [{ rotate }] },
          ]}
        />
      )}
      <View style={[styles.core, { width: size * 0.66, height: size * 0.66, borderRadius: size, backgroundColor: core }]}>
        <Ionicons name={icon} size={size * 0.26} color={colors.textOnPrimary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { position: 'absolute' },
  core: { alignItems: 'center', justifyContent: 'center' },
});
