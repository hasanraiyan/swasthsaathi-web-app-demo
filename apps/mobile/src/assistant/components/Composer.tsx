import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../design-system';
import { useAssistantStrings } from '../strings';

type IconName = ComponentProps<typeof Ionicons>['name'];

function SlotButton({
  icon,
  label,
  onPress,
  tone = 'primary',
  dimmed,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  tone?: 'primary' | 'soft' | 'danger' | 'outline';
  dimmed?: boolean;
}) {
  const bg = { primary: colors.primary, soft: colors.primarySoft, danger: colors.danger, outline: colors.surface }[tone];
  const fg = tone === 'soft' || tone === 'outline' ? colors.primary : colors.textOnPrimary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={dimmed ? undefined : onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.slot,
        { backgroundColor: bg, opacity: dimmed ? 0.4 : pressed ? 0.85 : 1 },
        tone === 'outline' && styles.slotOutline,
      ]}
    >
      <Ionicons name={icon} size={18} color={fg} />
    </Pressable>
  );
}

/**
 * Port of the example's chat-composer.tsx. The trailing action slot is always there
 * so the composer never changes height; what it shows depends on the mode:
 *
 *   streaming   → stop generating
 *   voice live  → send the typed text into the call, and hang up
 *   empty idle  → start voice mode (the waveform) — this is the chat → voice switch
 *   has text    → send
 */
export function Composer({
  value,
  onChange,
  onSend,
  onStop,
  onStartVoice,
  onStopVoice,
  onSendToVoice,
  isStreaming,
  isVoiceActive,
  voiceStarting,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  onStartVoice: () => void;
  onStopVoice: () => void;
  onSendToVoice: (text: string) => void;
  isStreaming: boolean;
  isVoiceActive: boolean;
  voiceStarting: boolean;
  disabled?: boolean;
}) {
  const s = useAssistantStrings();
  const trimmed = value.trim();

  const submit = () => {
    if (!trimmed) return;
    if (isVoiceActive) {
      onSendToVoice(trimmed);
      onChange('');
    } else if (!isStreaming) {
      onSend();
    }
  };

  let actions;
  if (isStreaming) {
    actions = <SlotButton icon="stop" label={s('stop')} tone="soft" onPress={onStop} />;
  } else if (isVoiceActive) {
    actions = (
      <>
        {!!trimmed && <SlotButton icon="arrow-up" label={s('send')} onPress={submit} />}
        <SlotButton icon="call" label={s('endVoice')} tone="danger" onPress={onStopVoice} />
      </>
    );
  } else if (voiceStarting) {
    actions = (
      <View style={[styles.slot, styles.slotOutline]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  } else if (!trimmed) {
    actions = <SlotButton icon="pulse" label={s('startVoice')} tone="outline" onPress={onStartVoice} />;
  } else {
    actions = <SlotButton icon="arrow-up" label={s('send')} onPress={submit} />;
  }

  return (
    <View style={styles.box}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={isVoiceActive ? s('placeholderVoice') : s('placeholder')}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        multiline
        editable={!disabled}
        submitBehavior={Platform.OS === 'web' ? 'blurAndSubmit' : 'newline'}
        onSubmitEditing={Platform.OS === 'web' ? submit : undefined}
        accessibilityLabel={s('placeholder')}
      />
      <View style={styles.actions}>{actions}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs + 2,
    paddingVertical: spacing.xs + 2,
  },
  input: {
    flex: 1,
    maxHeight: 140,
    minHeight: 40,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  actions: { flexDirection: 'row', gap: spacing.xs },
  slot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  slotOutline: { borderWidth: 1, borderColor: colors.primaryOutline },
});
