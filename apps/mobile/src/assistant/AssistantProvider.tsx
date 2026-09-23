import { useAuth } from '@clerk/expo';
import { PersonaProvider } from '@personaai/react';
import { useCallback, type ReactNode } from 'react';
import { PERSONA_AGENT_ID, PERSONA_BASE_URL, PERSONA_LOG_LEVEL } from './config';

/** Gives every assistant hook the signed-in user's Clerk token; the API resolves the Persona user from it. */
export function AssistantProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const getAuthToken = useCallback(() => getToken(), [getToken]);

  return (
    <PersonaProvider
      baseUrl={PERSONA_BASE_URL}
      getAuthToken={getAuthToken}
      defaultAgentId={PERSONA_AGENT_ID}
      logLevel={PERSONA_LOG_LEVEL}
    >
      {children}
    </PersonaProvider>
  );
}
