import Ionicons from '@expo/vector-icons/Ionicons';
import type { UseVoiceResult } from '@personaai/react';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, colors, radius, spacing } from '../../design-system';
import { useAssistantStrings } from '../strings';
import { VoiceOrb } from './VoiceOrb';

type IconName = ComponentProps<typeof Ionicons>['name'];

function RoundButton({
  icon,
  label,
  onPress,
  tone = 'plain',
  size = 56,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  tone?: 'plain' | 'danger' | 'active';
  size?: number;
}) {
  const bg = tone === 'danger' ? colors.danger : tone === 'active' ? colors.text : colors.surface;
  const fg = tone === 'plain' ? colors.text : colors.textOnPrimary;
  return (
    <View style={{ alignItems: 'center', gap: spacing.xs }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [
          styles.round,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
          tone === 'plain' && styles.roundBorder,
        ]}
      >
        <Ionicons name={icon} size={size * 0.4} color={fg} />
      </Pressable>
      {size >= 56 && (
        <Text variant="caption" color="textSecondary">
          {label}
        </Text>
      )}
    </View>
  );
}

function useStatusLabel(voice: UseVoiceResult) {
  const s = useAssistantStrings();
  if (voice.isMuted && (voice.state === 'listening' || voice.state === 'thinking')) return s('muted');
  switch (voice.state) {
    case 'connecting':
      return s('connecting');
    case 'listening':
      return s('listening');
    case 'thinking':
      return s('thinking');
    case 'speaking':
      return s('speaking');
    case 'ended':
      return s('callEnded');
    case 'error':
      return voice.error?.message ?? s('errorGeneric');
    default:
      return '';
  }
}

/**
 * Full voice view: the large orb, what is being heard/said right now, and the call controls.
 * "Switch to chat" collapses it to {@link VoiceBar} without ending the call.
 */
export function VoicePanel({ voice, onMinimize }: { voice: UseVoiceResult; onMinimize: () => void }) {
  const s = useAssistantStrings();
  const status = useStatusLabel(voice);
  const lastLine = voice.partial ?? voice.transcript[voice.transcript.length - 1] ?? null;
  const activeTool = voice.toolCalls.find((t) => t.status === 'running');

  return (
    <View style={styles.panel}>
      <View style={styles.center}>
        <VoiceOrb state={voice.state} muted={voice.isMuted} size={168} />
        <Text variant="h3" align="center" color={voice.state === 'error' ? 'danger' : 'text'}>
          {status}
        </Text>
        {activeTool?.name && (
          <View style={styles.toolPill}>
            <Ionicons name="construct-outline" size={13} color={colors.textSecondary} />
            <Text variant="caption" color="textSecondary">
              {activeTool.name.replace(/[_-]+/g, ' ')}
            </Text>
          </View>
        )}
        {lastLine && (
          <Text
            variant="body"
            align="center"
            color={lastLine.speaker === 'user' ? 'textSecondary' : 'text'}
            numberOfLines={4}
            style={styles.caption}
          >
            {lastLine.text}
          </Text>
        )}
      </View>

      <View style={styles.controls}>
        <RoundButton
          icon={voice.isMuted ? 'mic-off' : 'mic'}
          label={voice.isMuted ? s('unmute') : s('mute')}
          tone={voice.isMuted ? 'active' : 'plain'}
          onPress={() => voice.mute(!voice.isMuted)}
        />
        <RoundButton icon="call" label={s('endVoice')} tone="danger" size={68} onPress={voice.stop} />
        <RoundButton icon="chatbubble-ellipses-outline" label={s('toChat')} onPress={onMinimize} />
      </View>
    </View>
  );
}

/** Compact in-call bar shown above the chat while the user reads/types during a live call. */
export function VoiceBar({ voice, onExpand }: { voice: UseVoiceResult; onExpand: () => void }) {
  const s = useAssistantStrings();
  const status = useStatusLabel(voice);
  return (
    <View style={styles.bar}>
      <Pressable onPress={onExpand} style={styles.barMain} accessibilityRole="button" accessibilityLabel={s('toVoice')}>
        <VoiceOrb state={voice.state} muted={voice.isMuted} size={30} />
        <Text variant="smallMedium" style={{ flex: 1 }} numberOfLines={1}>
          {status}
        </Text>
      </Pressable>
      <RoundButton
        icon={voice.isMuted ? 'mic-off' : 'mic'}
        label={voice.isMuted ? s('unmute') : s('mute')}
        tone={voice.isMuted ? 'active' : 'plain'}
        size={36}
        onPress={() => voice.mute(!voice.isMuted)}
      />
      <RoundButton icon="expand" label={s('toVoice')} size={36} onPress={onExpand} />
      <RoundButton icon="call" label={s('endVoice')} tone="danger" size={36} onPress={voice.stop} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingHorizontal: spacing.xl },
  caption: { maxWidth: 420 },
  toolPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: spacing.xxxl },
  round: { alignItems: 'center', justifyContent: 'center' },
  roundBorder: { borderWidth: 1, borderColor: colors.border },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryTint,
    borderColor: colors.primaryOutline,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingLeft: spacing.xs,
    paddingRight: spacing.xs,
    marginBottom: spacing.sm,
  },
  barMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
