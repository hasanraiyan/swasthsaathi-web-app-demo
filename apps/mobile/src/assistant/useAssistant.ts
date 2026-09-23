import { useChat, useThreads, type PersonaMessage } from '@personaai/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createStore } from '../data/store';
import { useI18n } from '../state/i18n';
import { PERSONA_AGENT_ID } from './config';
import { useAssistantVoice } from './voice/useAssistantVoice';

/** The open conversation, shared by the chat screen and the thread list. */
export const activeThreadStore = createStore<string | undefined>(undefined);

export interface GroupedMessage {
  message: PersonaMessage;
  /** Reasoning phases streamed right before this assistant message. */
  reasoningPhases?: PersonaMessage[];
}

/** Pairs each assistant message with the reasoning that preceded it; drops system messages. */
function groupReasoning(messages: PersonaMessage[]): GroupedMessage[] {
  const result: GroupedMessage[] = [];
  let pending: PersonaMessage[] = [];
  for (const msg of messages) {
    if (msg.role === 'system') continue;
    if (msg.role === 'reasoning') {
      pending.push(msg);
      continue;
    }
    result.push({ message: msg, reasoningPhases: msg.role === 'assistant' && pending.length ? pending : undefined });
    pending = [];
  }
  return result;
}

const INACTIVE_VOICE = ['idle', 'ended', 'error'];

/**
 * Everything the assistant screen needs — a React Native port of the chat-sdk example's
 * `usePersonaChatWidget`: lazy thread creation, HITL/clarification handling, and one
 * shared thread between text chat and live voice, so switching modes keeps a single
 * conversation (`useChat` merges live voice turns into `messages`).
 */
export function useAssistant() {
  const agentId = PERSONA_AGENT_ID;
  const { lang } = useI18n();
  const activeThreadId = activeThreadStore.use();

  const { threads, createThread, deleteThread, refetch: refetchThreads, isLoading: threadsLoading } = useThreads();

  const context = useMemo(() => ({ app: 'swasthsaathi', userRole: 'patient', language: lang }), [lang]);
  const voice = useAssistantVoice({ agentId, threadId: activeThreadId, context });
  const isVoiceActive = !INACTIVE_VOICE.includes(voice.state);

  const chat = useChat({
    agentId,
    threadId: activeThreadId,
    voice,
    context: () => context,
    onTitle: () => void refetchThreads(),
  });
  const { clear, sendMessage, resumeInterrupt, interrupt, stop, isStreaming } = chat;

  const selectThread = useCallback(
    (id: string | undefined) => {
      if (id === activeThreadStore.get()) return;
      voice.stop();
      clear();
      activeThreadStore.set(id);
    },
    [clear, voice],
  );

  const newChat = useCallback(() => selectThread(undefined), [selectThread]);

  /** The current thread, or a freshly created one (voice needs a real thread to persist into). */
  const ensureThread = useCallback(async () => {
    const current = activeThreadStore.get();
    if (current) return current;
    const thread = await createThread(agentId);
    if (thread?._id) {
      activeThreadStore.set(thread._id);
      void refetchThreads();
    }
    return thread?._id;
  }, [agentId, createThread, refetchThreads]);

  const send = useCallback(
    (text?: string) => {
      // Not awaited: sendMessage shows the message optimistically and resolves the
      // thread promise itself, so the first message of a new chat appears instantly.
      void sendMessage(text, { threadId: ensureThread().catch(() => undefined) });
    },
    [ensureThread, sendMessage],
  );

  // voice.start() reads threadId from its options, so after creating a thread we wait
  // for the next render (where the hook sees the new id) before opening the call.
  const [voiceRequested, setVoiceRequested] = useState(false);
  const [voiceStarting, setVoiceStarting] = useState(false);

  const startVoice = useCallback(async () => {
    if (isVoiceActive || voiceStarting) return;
    if (isStreaming) stop();
    setVoiceStarting(true);
    try {
      const id = await ensureThread();
      if (id) setVoiceRequested(true);
    } finally {
      setVoiceStarting(false);
    }
  }, [ensureThread, isStreaming, isVoiceActive, stop, voiceStarting]);

  useEffect(() => {
    if (voiceRequested && activeThreadId) {
      setVoiceRequested(false);
      void voice.start();
    }
  }, [voiceRequested, activeThreadId, voice]);

  const stopVoice = useCallback(() => voice.stop(), [voice]);

  // After a call ends, pick up the auto-generated title for a thread that started in voice.
  const wasVoiceActive = useRef(false);
  useEffect(() => {
    if (wasVoiceActive.current && !isVoiceActive) void refetchThreads();
    wasVoiceActive.current = isVoiceActive;
  }, [isVoiceActive, refetchThreads]);

  // HITL decisions arrive one tool at a time, but the backend wants them all at once,
  // in the order the interrupt listed them.
  const hitlDecisions = useRef(new Map<string, 'approve' | 'reject'>());
  const decideHitl = useCallback(
    (actionName: string, decision: 'approve' | 'reject') => {
      if (interrupt?.kind !== 'hitl') return;
      hitlDecisions.current.set(actionName, decision);
      if (hitlDecisions.current.size < interrupt.actionRequests.length) return;
      const decisions = interrupt.actionRequests.map((a) => ({
        type: hitlDecisions.current.get(a.name) ?? ('reject' as const),
      }));
      hitlDecisions.current.clear();
      void resumeInterrupt({ decisions }, decisions.every((d) => d.type === 'approve') ? 'Approved' : 'Rejected');
    },
    [interrupt, resumeInterrupt],
  );

  const submitClarification = useCallback(
    (answers: Record<string, string>) => {
      if (interrupt?.kind !== 'clarification') return;
      const ordered = interrupt.questions.map((q) => answers[q.id] ?? '');
      void resumeInterrupt({ answers: ordered }, ordered.filter(Boolean).join(', '));
    },
    [interrupt, resumeInterrupt],
  );

  const messages = useMemo(() => groupReasoning(chat.messages), [chat.messages]);

  return {
    ...chat,
    messages,
    activeThreadId,
    threads,
    threadsLoading,
    refetchThreads,
    deleteThread,
    selectThread,
    newChat,
    send,
    voice,
    isVoiceActive,
    voiceStarting,
    startVoice,
    stopVoice,
    decideHitl,
    submitClarification,
  };
}
