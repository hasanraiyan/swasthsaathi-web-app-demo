import { useUser } from '@clerk/expo';
import { useCallback } from 'react';

export type Role = 'patient' | 'worker' | 'doctor' | 'admin';

/** Home route for each role. */
export const roleHome = {
  patient: '/',
  worker: '/worker',
  doctor: '/clinic',
  admin: '/facility',
} as const;

export const roleLabel: Record<Role, string> = {
  patient: 'Patient / Family',
  worker: 'Health Worker (ASHA / ANM)',
  doctor: 'Doctor / Medical Officer',
  admin: 'Facility In-charge',
};

/**
 * The role lives in Clerk `unsafeMetadata` so it follows the user across devices.
 * In production, roles other than "patient" should be assigned server-side (publicMetadata).
 */
export function useRole() {
  const { user, isLoaded } = useUser();
  const role = (user?.unsafeMetadata?.role as Role | undefined) ?? undefined;

  const setRole = useCallback(
    async (next: Role) => {
      if (!user) return;
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, role: next } });
    },
    [user],
  );

  return { role, setRole, isLoaded };
}
