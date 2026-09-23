import type { LogLevel } from '@personaai/react';

/**
 * The assistant talks only to our own API (`apps/api` mounts the Persona runtime at
 * /api/persona). The Persona credential lives on the server — never add it here.
 */
const apiUrl = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');

export const PERSONA_BASE_URL = `${apiUrl}/api/persona`;
export const PERSONA_AGENT_ID = process.env.EXPO_PUBLIC_PERSONA_AGENT_ID ?? '';

/** Persona SDK logs in Metro / device console: off | error | warn | info | debug | trace. */
export const PERSONA_LOG_LEVEL = (process.env.EXPO_PUBLIC_PERSONA_LOG_LEVEL ?? (__DEV__ ? 'warn' : 'error')) as LogLevel;
