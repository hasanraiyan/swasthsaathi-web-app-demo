import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getAuth } from '@clerk/express';
import { PersonaModule, type LogLevel } from '@personaai/adapters/nestjs';

/**
 * Mounts the Persona runtime at /api/persona for the in-app health assistant.
 *
 * The credential never leaves this server — the mobile app only talks to these
 * routes with its Clerk session token. Every request is scoped to the signed-in
 * Clerk user, so each patient only ever sees their own threads. All admin
 * capabilities (agent CRUD, providers, skills, ...) stay at their default: off.
 */
@Module({
  imports: [
    PersonaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseUrl: config.getOrThrow<string>('PERSONA_BASE_URL'),
        credential: config.getOrThrow<string>('PERSONA_CREDENTIAL'),
        resolveUserFrom: (req) => getAuth(req)?.userId ?? null,
        routePrefix: '/api/persona',
        // PERSONA_LOG_LEVEL: off | error | warn | info | debug | trace
        logLevel: config.get<LogLevel>('PERSONA_LOG_LEVEL') ?? (config.get('NODE_ENV') === 'production' ? 'warn' : 'info'),
        // 'development' puts the real error (message, stack, upstream response) in API
        // error responses instead of a generic message — never enable in production.
        mode: config.get('PERSONA_DEBUG_ERRORS') === 'true' ? 'development' : 'production',
      }),
    }),
  ],
})
export class AssistantModule {}
