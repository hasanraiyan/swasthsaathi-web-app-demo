import { useSyncExternalStore } from 'react';

export type AppointmentStatus = 'upcoming' | 'past' | 'cancelled';
export type ConsultationType = 'in-person' | 'video';

export interface Appointment {
  id: string;
  doctorId: string;
  /** ISO date (yyyy-mm-dd) */
  date: string;
  time: string;
  type: ConsultationType;
  reason?: string;
  followUp?: boolean;
  status: AppointmentStatus;
  paid: boolean;
}

const isoOffset = (days: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const fromISODate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Sample data until the API has an appointments module.
let appointments: Appointment[] = [
  { id: 'a1', doctorId: 'ananya-sharma', date: isoOffset(3), time: '10:30 AM', type: 'in-person', status: 'upcoming', paid: true },
  { id: 'a2', doctorId: 'rohit-verma', date: isoOffset(7), time: '04:00 PM', type: 'video', status: 'upcoming', paid: true },
  { id: 'a3', doctorId: 'sneha-kapoor', date: isoOffset(-10), time: '11:30 AM', type: 'in-person', status: 'past', paid: true },
  { id: 'a4', doctorId: 'arvind-kumar', date: isoOffset(-4), time: '12:30 PM', type: 'in-person', status: 'cancelled', paid: false },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const appointmentStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => appointments,
  get: (id?: string) => appointments.find((a) => a.id === id),
  add(input: Omit<Appointment, 'id' | 'status'>) {
    const appt: Appointment = { ...input, id: `a${Date.now()}`, status: 'upcoming' };
    appointments = [appt, ...appointments];
    emit();
    return appt;
  },
  cancel(id: string) {
    appointments = appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a));
    emit();
  },
};

export function useAppointments() {
  return useSyncExternalStore(appointmentStore.subscribe, appointmentStore.getSnapshot, appointmentStore.getSnapshot);
}

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions) => fromISODate(iso).toLocaleDateString('en-IN', opts);
