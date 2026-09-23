import Ionicons from '@expo/vector-icons/Ionicons';
import type { PersonaMessage, PersonaToolCall } from '@personaai/react';
import { memo, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, View } from 'react-native';
import { Text, colors, radius, spacing } from '../../design-system';
import { useAssistantStrings } from '../strings';
import { Markdown } from './Markdown';

/** Three bouncing dots — the "assistant is working" gap filler (thinking-indicator.tsx). */
export function ThinkingDots() {
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    const loops = dots.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(v, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay((2 - i) * 150),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [dots]);
  return (
    <View style={styles.dots} accessibilityLabel="Assistant is thinking">
      {dots.map((v, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }]}
        />
      ))}
    </View>
  );
}

function humanize(name: string) {
  return name.replace(/[_-]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

/** One compact row per tool call (tool-call-trace.tsx without the developer-facing detail views). */
function ToolCallRow({ call }: { call: PersonaToolCall }) {
  const status = call.isError ? 'error' : call.result !== undefined ? 'done' : 'running';
  return (
    <View style={styles.tool}>
      {status === 'running' ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Ionicons
          name={status === 'error' ? 'alert-circle' : 'checkmark-circle'}
          size={16}
          color={status === 'error' ? colors.danger : colors.success}
        />
      )}
      <Text variant="small" color="textSecondary" numberOfLines={1} style={{ flex: 1 }}>
        {humanize(call.toolName)}
      </Text>
    </View>
  );
}

/** Collapsible model reasoning (reasoning-block.tsx) — open while it streams, folded after. */
function Reasoning({ phases }: { phases: PersonaMessage[] }) {
  const s = useAssistantStrings();
  const streaming = phases.some((p) => p.isStreaming);
  const [open, setOpen] = useState(false);
  const text = phases.map((p) => p.content).join('\n\n').trim();
  if (!text) return null;
  const expanded = open || streaming;
  return (
    <Pressable onPress={() => setOpen((o) => !o)} style={styles.reasoning} accessibilityRole="button">
      <View style={styles.reasoningHeader}>
        <Ionicons name="sparkles-outline" size={14} color={colors.textMuted} />
        <Text variant="caption" color="textMuted" style={{ flex: 1 }}>
          {s('thought')}
        </Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} />
      </View>
      {expanded && (
        <Text variant="small" color="textSecondary" numberOfLines={streaming ? 6 : undefined}>
          {text}
        </Text>
      )}
    </Pressable>
  );
}

/**
 * Role-based dispatch, same as the example: the user's turn is a bubble on the right;
 * the assistant's turn is plain markdown with its tool-call trace, no bubble.
 * Turns spoken in a voice call (ids prefixed `voice-` by useChat) carry a small mic mark.
 */
export const ChatMessage = memo(function ChatMessage({
  message,
  reasoningPhases,
}: {
  message: PersonaMessage;
  reasoningPhases?: PersonaMessage[];
}) {
  const fromVoice = message.id.startsWith('voice-');

  if (message.role === 'user') {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={{ color: colors.textOnPrimary }}>{message.content}</Text>
        </View>
        {fromVoice && <Ionicons name="mic" size={12} color={colors.textMuted} style={styles.voiceMark} />}
      </View>
    );
  }

  const toolCalls = message.toolCalls ?? [];
  const reasoning = reasoningPhases ?? [];
  const isEmptyStreaming = !!message.isStreaming && !message.content?.trim() && toolCalls.length === 0;
  const liveReasoning = reasoning.some((r) => r.isStreaming);

  return (
    <View style={styles.assistantRow}>
      <View style={styles.avatar}>
        <Ionicons name="medkit" size={14} color={colors.primary} />
      </View>
      <View style={{ flex: 1, gap: spacing.xs }}>
        {reasoning.length > 0 && <Reasoning phases={reasoning} />}
        {toolCalls.length > 0 && (
          <View style={{ gap: spacing.xxs }}>
            {toolCalls.map((c) => (
              <ToolCallRow key={c.toolCallId} call={c} />
            ))}
          </View>
        )}
        {isEmptyStreaming && !liveReasoning ? (
          <ThinkingDots />
        ) : message.content?.trim() ? (
          <Markdown>{message.content}</Markdown>
        ) : null}
        {fromVoice && !!message.content && (
          <View style={styles.voiceTag}>
            <Ionicons name="mic" size={11} color={colors.textMuted} />
            <Text variant="caption" color="textMuted">
              voice
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  userRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', gap: spacing.xs },
  userBubble: {
    maxWidth: '82%',
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    borderBottomRightRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  voiceMark: { marginBottom: spacing.xs },
  assistantRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  reasoning: { borderLeftWidth: 2, borderLeftColor: colors.border, paddingLeft: spacing.md, gap: spacing.xs },
  reasoningHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dots: { flexDirection: 'row', gap: 5, paddingVertical: spacing.sm },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primaryMuted },
  voiceTag: { flexDirection: 'row', alignItems: 'center', gap: 3 },
});
