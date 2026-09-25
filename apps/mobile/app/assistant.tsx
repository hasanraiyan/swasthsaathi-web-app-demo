import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, AppState, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatMessage } from '../src/assistant/components/ChatMessage';
import { Composer } from '../src/assistant/components/Composer';
import { EmptyState } from '../src/assistant/components/EmptyState';
import { InterruptPanel } from '../src/assistant/components/InterruptPanel';
import { MemorySheet } from '../src/assistant/components/MemorySheet';
import { ThreadsDrawer } from '../src/assistant/components/ThreadsDrawer';
import { PERSONA_AGENT_ID } from '../src/assistant/config';
import { VoiceBar, VoicePanel } from '../src/assistant/components/VoicePanel';
import { useAssistantStrings } from '../src/assistant/strings';
import { useAssistant } from '../src/assistant/useAssistant';
import { RoleGate } from '../src/components/RoleGate';
import { Text, colors, layout, radius, spacing } from '../src/design-system';

/**
 * The health assistant (port of the example's persona-chat-view.tsx, patient-only).
 * One thread is shared by text chat and live voice:
 *   chat → voice: the waveform in the composer (or the big mic in the empty state)
 *   voice → chat: "Switch to chat" keeps the call running as a compact bar above the
 *                 conversation, where typed messages go into the call; hanging up
 *                 returns to plain text chat with the spoken turns still in the thread.
 */
function AssistantScreen() {
  const s = useAssistantStrings();
  const params = useLocalSearchParams<{ mode?: string }>();
  const a = useAssistant();
  const { voice, isVoiceActive, startVoice, stopVoice } = a;

  const [threadsOpen, setThreadsOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [voiceMinimized, setVoiceMinimized] = useState(false);

  // Each new call opens in the full voice view.
  useEffect(() => {
    if (isVoiceActive) setVoiceMinimized(false);
  }, [isVoiceActive]);

  // Long-pressing the FAB opens straight into voice.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (params.mode === 'voice' && !autoStarted.current) {
      autoStarted.current = true;
      void startVoice();
    }
  }, [params.mode, startVoice]);

  // A call must never keep the mic open in the background.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next !== 'active') stopVoice();
    });
    return () => sub.remove();
  }, [stopVoice]);

  // Inverted list: newest message sits at the bottom, next to the composer.
  const reversed = useMemo(() => [...a.messages].reverse(), [a.messages]);
  const showVoicePanel = isVoiceActive && !voiceMinimized;

  // One friendly banner for every failure: thread actions, voice, or the chat run itself
  // (e.g. "Service temporarily overloaded" from the agent's model provider).
  const problem = (() => {
    if (a.notice === 'threadCreateFailed') return { text: s('errThreadCreate') };
    if (a.notice === 'threadDeleteFailed') return { text: s('errThreadDelete') };
    if (a.notice === 'voiceStartFailed') return { text: s('errVoiceStart'), retry: () => void startVoice() };
    if (voice.state === 'error') {
      const mic = /microphone|permission/i.test(voice.error?.message ?? '');
      return { text: mic ? s('errMic') : s('errVoiceStart'), retry: mic ? undefined : () => void startVoice() };
    }
    if (a.error) {
      const busy = /overload|busy|rate.?limit|capacity|429/i.test(a.error.message ?? '');
      return { text: busy ? s('errBusy') : s('errServer'), retry: () => void a.reload() };
    }
    return null;
  })();

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => setThreadsOpen(true)} hitSlop={10} accessibilityRole="button" accessibilityLabel={s('menu')}>
          <Ionicons name="menu" size={25} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text variant="h3" numberOfLines={1}>
            {a.threads.find((t) => t._id === a.activeThreadId)?.title || s('title')}
          </Text>
          <Text variant="caption" color="textMuted">
            {s('subtitle')}
          </Text>
        </View>
        <Pressable onPress={a.newChat} hitSlop={10} accessibilityRole="button" accessibilityLabel={s('newChat')}>
          <Ionicons name="create-outline" size={23} color={colors.text} />
        </Pressable>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel={s('close')}>
          <Ionicons name="chevron-down" size={25} color={colors.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={styles.column} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {showVoicePanel ? (
          <VoicePanel voice={voice} onMinimize={() => setVoiceMinimized(true)} />
        ) : a.isLoadingHistory && a.messages.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : a.messages.length === 0 ? (
          <EmptyState onPrompt={(text) => a.send(text)} onVoice={() => void startVoice()} />
        ) : (
          <FlatList
            inverted
            data={reversed}
            keyExtractor={(g) => g.message.id}
            renderItem={({ item }) => <ChatMessage message={item.message} reasoningPhases={item.reasoningPhases} />}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          />
        )}

        <View style={styles.footer}>
          {problem && (
            <View style={styles.problem} accessibilityRole="alert">
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text variant="small" style={{ flex: 1 }}>
                {problem.text}
              </Text>
              {problem.retry && (
                <Pressable onPress={problem.retry} hitSlop={8} accessibilityRole="button">
                  <Text variant="smallMedium" color="primary">
                    {s('retry')}
                  </Text>
                </Pressable>
              )}
              {a.notice && (
                <Pressable onPress={a.clearNotice} hitSlop={8} accessibilityRole="button" accessibilityLabel={s('dismiss')}>
                  <Ionicons name="close" size={16} color={colors.textMuted} />
                </Pressable>
              )}
            </View>
          )}
          {a.interrupt && !showVoicePanel && (
            <InterruptPanel
              interrupt={a.interrupt}
              onDecideHitl={a.decideHitl}
              onSubmitClarification={a.submitClarification}
            />
          )}
          {isVoiceActive && voiceMinimized && <VoiceBar voice={voice} onExpand={() => setVoiceMinimized(false)} />}
          {!showVoicePanel && (
            <Composer
              value={a.input}
              onChange={a.setInput}
              onSend={() => a.send()}
              onStop={a.stop}
              onStartVoice={() => void startVoice()}
              onStopVoice={stopVoice}
              onSendToVoice={voice.sendText}
              isStreaming={a.isStreaming}
              isVoiceActive={isVoiceActive}
              voiceStarting={a.voiceStarting}
              disabled={!!a.interrupt}
            />
          )}
        </View>
      </KeyboardAvoidingView>

      <ThreadsDrawer
        visible={threadsOpen}
        onClose={() => setThreadsOpen(false)}
        threads={a.threads}
        loading={a.threadsLoading}
        activeThreadId={a.activeThreadId}
        onSelect={a.selectThread}
        onNew={a.newChat}
        onDelete={(id) => void a.removeThread(id)}
        onOpenMemory={() => setMemoryOpen(true)}
      />
      <MemorySheet visible={memoryOpen} onClose={() => setMemoryOpen(false)} agentId={PERSONA_AGENT_ID} />
    </SafeAreaView>
  );
}

export default function AssistantRoute() {
  return (
    <RoleGate role="patient">
      <AssistantScreen />
    </RoleGate>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  column: { flex: 1, width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  footer: { paddingHorizontal: spacing.md, paddingTop: spacing.xs, paddingBottom: spacing.sm },
  problem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
});
