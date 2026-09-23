import { useVoice, type UseVoiceOptions, type UseVoiceResult } from '@personaai/react';

/**
 * Web build: the SDK's own `useVoice` (getUserMedia + AudioWorklet) works as-is.
 * Android/iOS resolve `useAssistantVoice.native.ts` instead, which speaks the same protocol.
 */
export function useAssistantVoice(options: UseVoiceOptions = {}): UseVoiceResult {
  return useVoice(options);
}
