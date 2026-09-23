import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { colors } from '../design-system/tokens';

type IconName = ComponentProps<typeof Ionicons>['name'];

export interface Specialty {
  id: string;
  label: string;
  icon: IconName;
  tint: string;
  background: string;
}

export const specialties: Specialty[] = [
  { id: 'general', label: 'General Physician', icon: 'medkit-outline', tint: colors.primary, background: colors.primarySoft },
  { id: 'cardio', label: 'Cardiologist', icon: 'heart-outline', tint: colors.danger, background: colors.dangerSoft },
  { id: 'derma', label: 'Dermatologist', icon: 'color-palette-outline', tint: colors.warning, background: colors.warningSoft },
  { id: 'pulmo', label: 'Pulmonologist', icon: 'fitness-outline', tint: colors.info, background: colors.infoSoft },
  { id: 'gyno', label: 'Gynecologist', icon: 'woman-outline', tint: colors.accent, background: colors.accentSoft },
];

export const getSpecialty = (id?: string) => specialties.find((s) => s.id === id);

export interface Doctor {
  id: string;
  name: string;
  avatar: 'female' | 'male';
  specialtyId: string;
  specialty: string;
  rating: number;
  reviews: number;
  degree: string;
  experienceYears: number;
  patients: number;
  satisfaction: number;
  hospital: string;
  address: string;
  city: string;
  distanceKm: number;
  fee: number;
  modes: string;
  availability: 'Available Today' | 'Available Tomorrow';
  about: string;
  specializations: string[];
  languages: string[];
  education: { degree: string; institute: string }[];
  availableDays: string[];
  slots: string[];
}

export const doctors: Doctor[] = [
  {
    id: 'ananya-sharma',
    name: 'Dr. Ananya Sharma',
    avatar: 'female',
    specialtyId: 'general',
    specialty: 'General Physician',
    rating: 4.8,
    reviews: 320,
    degree: 'MBBS, MD (General Medicine)',
    experienceYears: 8,
    patients: 320,
    satisfaction: 98,
    hospital: 'City Care Hospital',
    address: 'Akharaghat Road, Muzaffarpur, Bihar 842001',
    city: 'Muzaffarpur',
    distanceKm: 2.1,
    fee: 500,
    modes: 'In-clinic & Online',
    availability: 'Available Today',
    about:
      'Dr. Ananya Sharma is a dedicated General Physician with 8+ years of experience in internal medicine. She focuses on preventive care, chronic disease management and holistic wellness.',
    specializations: ['General Medicine', 'Preventive Care', 'Diabetes Care', 'Hypertension', 'Lifestyle Diseases'],
    languages: ['English', 'Hindi', 'Bhojpuri'],
    education: [
      { degree: 'MBBS', institute: 'Government Medical College, Patna' },
      { degree: 'MD (General Medicine)', institute: 'AIIMS, New Delhi' },
    ],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    slots: ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:00 PM', '05:30 PM'],
  },
  {
    id: 'rohit-verma',
    name: 'Dr. Rohit Verma',
    avatar: 'male',
    specialtyId: 'derma',
    specialty: 'Dermatologist',
    rating: 4.6,
    reviews: 215,
    degree: 'MBBS, DNB (Dermatology)',
    experienceYears: 10,
    patients: 540,
    satisfaction: 96,
    hospital: 'LifeLine Hospital',
    address: 'Juran Chapra, Muzaffarpur, Bihar 842001',
    city: 'Muzaffarpur',
    distanceKm: 3.4,
    fee: 600,
    modes: 'In-clinic & Online',
    availability: 'Available Today',
    about:
      'Dr. Rohit Verma treats skin, hair and nail conditions, with a special interest in acne, eczema and pigmentation disorders.',
    specializations: ['Acne & Scars', 'Eczema', 'Hair Loss', 'Pigmentation'],
    languages: ['English', 'Hindi'],
    education: [
      { degree: 'MBBS', institute: 'Darbhanga Medical College' },
      { degree: 'DNB (Dermatology)', institute: 'Safdarjung Hospital, New Delhi' },
    ],
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    slots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:00 PM'],
  },
  {
    id: 'sneha-kapoor',
    name: 'Dr. Sneha Kapoor',
    avatar: 'female',
    specialtyId: 'general',
    specialty: 'General Physician',
    rating: 4.9,
    reviews: 410,
    degree: 'MBBS, MD',
    experienceYears: 12,
    patients: 900,
    satisfaction: 99,
    hospital: 'Swasthya Multispeciality',
    address: 'Club Road, Muzaffarpur, Bihar 842002',
    city: 'Muzaffarpur',
    distanceKm: 5.1,
    fee: 700,
    modes: 'In-clinic',
    availability: 'Available Tomorrow',
    about: 'Dr. Sneha Kapoor is an experienced physician focused on family medicine, fevers and infections, and elderly care.',
    specializations: ['Family Medicine', 'Infectious Diseases', 'Geriatric Care'],
    languages: ['English', 'Hindi', 'Urdu'],
    education: [
      { degree: 'MBBS', institute: 'Patna Medical College' },
      { degree: 'MD (Medicine)', institute: 'PGIMER, Chandigarh' },
    ],
    availableDays: ['Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    slots: ['09:30 AM', '11:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '04:30 PM', '06:00 PM'],
  },
  {
    id: 'arvind-kumar',
    name: 'Dr. Arvind Kumar',
    avatar: 'male',
    specialtyId: 'cardio',
    specialty: 'Cardiologist',
    rating: 4.5,
    reviews: 190,
    degree: 'MBBS, DM (Cardiology)',
    experienceYears: 15,
    patients: 1200,
    satisfaction: 95,
    hospital: "People's Hospital",
    address: 'Motijheel, Muzaffarpur, Bihar 842001',
    city: 'Muzaffarpur',
    distanceKm: 6.2,
    fee: 900,
    modes: 'In-clinic & Online',
    availability: 'Available Today',
    about: 'Dr. Arvind Kumar is a cardiologist specialising in hypertension, heart failure and preventive cardiology.',
    specializations: ['Hypertension', 'Heart Failure', 'Preventive Cardiology'],
    languages: ['English', 'Hindi'],
    education: [
      { degree: 'MBBS', institute: 'SKMCH, Muzaffarpur' },
      { degree: 'DM (Cardiology)', institute: 'AIIMS, New Delhi' },
    ],
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    slots: ['10:00 AM', '12:30 PM', '04:00 PM'],
  },
];

export const getDoctor = (id?: string) => doctors.find((d) => d.id === id);

export interface HealthTip {
  id: string;
  icon: IconName;
  title: string;
  body: string;
  tint: string;
  background: string;
}

export const healthTips: HealthTip[] = [
  { id: 'water', icon: 'water', title: 'Stay hydrated, stay healthy!', body: 'Aim for 8 glasses of water a day, more in the summer heat.', tint: colors.info, background: colors.infoSoft },
  { id: 'walk', icon: 'walk', title: 'Walk 30 minutes daily', body: 'A brisk walk keeps your heart strong and your mood up.', tint: colors.primary, background: colors.primarySoft },
  { id: 'sleep', icon: 'moon', title: 'Sleep 7–8 hours', body: 'Good sleep supports immunity, memory and healthy weight.', tint: colors.accent, background: colors.accentSoft },
  { id: 'food', icon: 'nutrition', title: 'Eat seasonal fruits', body: 'Fresh, local fruit gives you fibre and vitamins at low cost.', tint: colors.warning, background: colors.warningSoft },
  { id: 'bp', icon: 'heart', title: 'Check your BP regularly', body: 'After 30, check blood pressure at least once every few months.', tint: colors.danger, background: colors.dangerSoft },
];

export interface Medicine {
  name: string;
  dosage: string;
  duration: string;
}

export interface Prescription {
  id: string;
  doctorId: string;
  date: string;
  status: 'Active' | 'Completed';
  medicines: Medicine[];
}

export const prescriptions: Prescription[] = [
  {
    id: 'rx-1',
    doctorId: 'ananya-sharma',
    date: '25 Sep 2026',
    status: 'Active',
    medicines: [
      { name: 'Paracetamol 500mg', dosage: '1 tablet, twice a day (after food)', duration: '5 days' },
      { name: 'Vitamin D3 60K', dosage: '1 capsule, once a week', duration: '4 weeks' },
      { name: 'Cetirizine 10mg', dosage: '1 tablet, once a day (at night)', duration: '5 days' },
    ],
  },
  {
    id: 'rx-2',
    doctorId: 'rohit-verma',
    date: '12 Sep 2026',
    status: 'Completed',
    medicines: [
      { name: 'Amoxicillin 500mg', dosage: '1 capsule, thrice a day (after food)', duration: '5 days' },
      { name: 'Pantoprazole 40mg', dosage: '1 tablet, once a day (before food)', duration: '5 days' },
    ],
  },
];

export const labReports = [
  { id: 'lab-1', icon: 'flask-outline' as IconName, title: 'Complete Blood Count', meta: 'City Care Hospital · 12 Sep 2026' },
  { id: 'lab-2', icon: 'pulse-outline' as IconName, title: 'ECG Report', meta: 'LifeLine Hospital · 18 Aug 2026' },
  { id: 'lab-3', icon: 'water-outline' as IconName, title: 'Lipid Profile', meta: 'Swasthya Multispeciality · 02 Aug 2026' },
];
