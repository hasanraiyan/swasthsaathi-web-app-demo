/**
 * Sample data for the rural care-access modules: facilities, patients, referrals,
 * medicines, diagnostics, queues and follow-ups. Replace with API calls module by module.
 */
import { createStore } from './store';

/* ---------------- Facilities (public-health hierarchy) ---------------- */

export type FacilityLevel = 'SC' | 'PHC' | 'CHC' | 'SDH' | 'DH';

export const facilityLevelLabel: Record<FacilityLevel, string> = {
  SC: 'Sub-centre',
  PHC: 'Primary Health Centre',
  CHC: 'Community Health Centre',
  SDH: 'Sub-divisional Hospital',
  DH: 'District Hospital',
};

export interface Facility {
  id: string;
  name: string;
  level: FacilityLevel;
  block: string;
  distanceKm: number;
  phone: string;
  open24x7: boolean;
  services: string[];
}

export const facilities: Facility[] = [
  { id: 'sc-kanti', name: 'Kanti Sub-centre', level: 'SC', block: 'Kanti', distanceKm: 1.2, phone: '+91 612 000 1001', open24x7: false, services: ['ANC', 'Immunisation', 'BP & Sugar check'] },
  { id: 'phc-marwan', name: 'PHC Marwan', level: 'PHC', block: 'Marwan', distanceKm: 6.5, phone: '+91 612 000 1002', open24x7: true, services: ['OPD', 'Delivery', 'Lab', 'Teleconsult hub'] },
  { id: 'chc-kurhani', name: 'CHC Kurhani', level: 'CHC', block: 'Kurhani', distanceKm: 14.2, phone: '+91 612 000 1003', open24x7: true, services: ['Specialist OPD', 'X-ray', 'C-section', 'Blood storage'] },
  { id: 'dh-muz', name: 'Sadar Hospital Muzaffarpur', level: 'DH', block: 'Muzaffarpur', distanceKm: 27.8, phone: '+91 612 000 1004', open24x7: true, services: ['ICU', 'Trauma', 'All specialities', 'CT scan'] },
];

export const getFacility = (id?: string) => facilities.find((f) => f.id === id);

/* ---------------- Patients (as seen by health workers / doctors) ---------------- */

export type RiskLevel = 'high' | 'medium' | 'low';
export type Program = 'maternal' | 'child' | 'chronic' | 'tb' | 'general';

export interface Vitals {
  bp?: string;
  sugar?: number;
  weightKg?: number;
  hb?: number;
  temp?: number;
  spo2?: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  detail: string;
  facility: string;
  kind: 'visit' | 'lab' | 'referral' | 'prescription' | 'immunisation' | 'teleconsult';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'F' | 'M' | 'O';
  phone: string;
  village: string;
  abha?: string;
  program: Program;
  risk: RiskLevel;
  riskReasons: string[];
  conditions: string[];
  vitals: Vitals;
  nextFollowUp?: string;
  ashaName: string;
  timeline: TimelineEvent[];
}

export const patientsStore = createStore<Patient[]>([
  {
    id: 'p1',
    name: 'Sunita Devi',
    age: 24,
    gender: 'F',
    phone: '98XXXX1201',
    village: 'Kanti',
    abha: '91-2345-6789-0123',
    program: 'maternal',
    risk: 'high',
    riskReasons: ['Pregnancy 32 weeks', 'Hb 8.2 g/dL (anaemia)', 'BP 142/94'],
    conditions: ['Pregnancy (G2P1)', 'Moderate anaemia'],
    vitals: { bp: '142/94', hb: 8.2, weightKg: 52 },
    nextFollowUp: 'Today',
    ashaName: 'Rekha Kumari',
    timeline: [
      { date: '20 Sep 2026', title: 'ANC visit 3', detail: 'BP raised, IFA doubled, referred for review', facility: 'Kanti Sub-centre', kind: 'visit' },
      { date: '20 Sep 2026', title: 'Referral to CHC Kurhani', detail: 'Suspected pre-eclampsia', facility: 'Kanti Sub-centre', kind: 'referral' },
      { date: '02 Sep 2026', title: 'Haemoglobin test', detail: 'Hb 8.2 g/dL', facility: 'PHC Marwan', kind: 'lab' },
      { date: '14 Aug 2026', title: 'TT-2 injection', detail: 'Tetanus toxoid second dose', facility: 'Kanti Sub-centre', kind: 'immunisation' },
    ],
  },
  {
    id: 'p2',
    name: 'Ramesh Prasad',
    age: 58,
    gender: 'M',
    phone: '97XXXX4410',
    village: 'Marwan',
    abha: '91-8765-4321-0098',
    program: 'chronic',
    risk: 'high',
    riskReasons: ['Uncontrolled diabetes (FBS 212)', 'Missed 2 refills'],
    conditions: ['Type 2 diabetes', 'Hypertension'],
    vitals: { bp: '156/98', sugar: 212, weightKg: 71 },
    nextFollowUp: 'Tomorrow',
    ashaName: 'Rekha Kumari',
    timeline: [
      { date: '18 Sep 2026', title: 'Teleconsult with Dr. Arvind Kumar', detail: 'Metformin dose increased', facility: 'PHC Marwan (hub)', kind: 'teleconsult' },
      { date: '18 Sep 2026', title: 'e-Prescription', detail: 'Metformin 1000mg BD, Amlodipine 5mg OD', facility: 'PHC Marwan', kind: 'prescription' },
      { date: '01 Aug 2026', title: 'HbA1c', detail: '9.4%', facility: 'CHC Kurhani', kind: 'lab' },
    ],
  },
  {
    id: 'p3',
    name: 'Baby of Anita (Aarav)',
    age: 0,
    gender: 'M',
    phone: '99XXXX7788',
    village: 'Kanti',
    program: 'child',
    risk: 'medium',
    riskReasons: ['Low birth weight 2.1 kg', 'Pentavalent-2 due'],
    conditions: ['Low birth weight'],
    vitals: { weightKg: 3.4, temp: 98.4 },
    nextFollowUp: 'In 2 days',
    ashaName: 'Rekha Kumari',
    timeline: [
      { date: '10 Sep 2026', title: 'Pentavalent-1, OPV-1', detail: '6-week vaccines given', facility: 'Kanti Sub-centre', kind: 'immunisation' },
      { date: '28 Jul 2026', title: 'Institutional delivery', detail: 'Birth weight 2.1 kg', facility: 'PHC Marwan', kind: 'visit' },
    ],
  },
  {
    id: 'p4',
    name: 'Kalawati Devi',
    age: 67,
    gender: 'F',
    phone: '96XXXX0021',
    village: 'Bochaha',
    abha: '91-1122-3344-5566',
    program: 'tb',
    risk: 'medium',
    riskReasons: ['On TB treatment, month 3', 'Weight loss 2 kg'],
    conditions: ['Pulmonary TB (DOTS)'],
    vitals: { weightKg: 41, temp: 99.1, spo2: 95 },
    nextFollowUp: 'Fri',
    ashaName: 'Rekha Kumari',
    timeline: [{ date: '15 Sep 2026', title: 'Sputum follow-up', detail: 'Negative', facility: 'CHC Kurhani', kind: 'lab' }],
  },
  {
    id: 'p5',
    name: 'Mohan Sahni',
    age: 34,
    gender: 'M',
    phone: '95XXXX3342',
    village: 'Marwan',
    program: 'general',
    risk: 'low',
    riskReasons: [],
    conditions: ['Seasonal fever (recovered)'],
    vitals: { temp: 98.6, bp: '122/80' },
    ashaName: 'Rekha Kumari',
    timeline: [{ date: '05 Sep 2026', title: 'OPD visit', detail: 'Viral fever, paracetamol', facility: 'PHC Marwan', kind: 'visit' }],
  },
]);

export const programLabel: Record<Program, string> = {
  maternal: 'Maternal',
  child: 'Child health',
  chronic: 'NCD / Chronic',
  tb: 'TB',
  general: 'General',
};

/* ---------------- Referrals ---------------- */

export type ReferralStage = 'created' | 'accepted' | 'transport' | 'arrived' | 'treated' | 'closed';

export const referralStages: { key: ReferralStage; label: string }[] = [
  { key: 'created', label: 'Referred' },
  { key: 'accepted', label: 'Accepted by facility' },
  { key: 'transport', label: 'Transport arranged' },
  { key: 'arrived', label: 'Patient arrived' },
  { key: 'treated', label: 'Treated' },
  { key: 'closed', label: 'Feedback sent back' },
];

export interface Referral {
  id: string;
  patientId: string;
  from: string;
  to: string;
  reason: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  stage: ReferralStage;
  createdAt: string;
  updates: { stage: ReferralStage; at: string; note?: string }[];
}

export const referralsStore = createStore<Referral[]>([
  {
    id: 'R-2031',
    patientId: 'p1',
    from: 'sc-kanti',
    to: 'chc-kurhani',
    reason: 'Suspected pre-eclampsia at 32 weeks',
    urgency: 'urgent',
    stage: 'transport',
    createdAt: '20 Sep 2026, 11:40 AM',
    updates: [
      { stage: 'created', at: '20 Sep, 11:40 AM', note: 'Referred by ANM Kanti' },
      { stage: 'accepted', at: '20 Sep, 12:05 PM', note: 'Accepted by Dr. S. Kapoor, CHC Kurhani' },
      { stage: 'transport', at: '20 Sep, 12:20 PM', note: '102 ambulance assigned (BR06-XX-1234)' },
    ],
  },
  {
    id: 'R-2027',
    patientId: 'p2',
    from: 'phc-marwan',
    to: 'dh-muz',
    reason: 'Diabetic foot ulcer — surgical review',
    urgency: 'routine',
    stage: 'treated',
    createdAt: '12 Sep 2026, 09:10 AM',
    updates: [
      { stage: 'created', at: '12 Sep, 09:10 AM' },
      { stage: 'accepted', at: '12 Sep, 10:00 AM' },
      { stage: 'arrived', at: '14 Sep, 11:30 AM' },
      { stage: 'treated', at: '14 Sep, 02:15 PM', note: 'Debridement done, dressing advised' },
    ],
  },
]);

/* ---------------- Medicines (stock at facilities) ---------------- */

export interface MedicineStock {
  name: string;
  generic: string;
  stock: Record<string, number>; // facilityId -> units
  price?: number; // Jan Aushadhi MRP
}

export const medicines: MedicineStock[] = [
  { name: 'Paracetamol 500mg', generic: 'Paracetamol', stock: { 'sc-kanti': 120, 'phc-marwan': 900, 'chc-kurhani': 2400, 'dh-muz': 8000 }, price: 8 },
  { name: 'Metformin 500mg', generic: 'Metformin', stock: { 'sc-kanti': 0, 'phc-marwan': 60, 'chc-kurhani': 800, 'dh-muz': 3000 }, price: 12 },
  { name: 'Amlodipine 5mg', generic: 'Amlodipine', stock: { 'sc-kanti': 20, 'phc-marwan': 0, 'chc-kurhani': 400, 'dh-muz': 1500 }, price: 10 },
  { name: 'Iron Folic Acid (IFA)', generic: 'Ferrous sulphate + folic acid', stock: { 'sc-kanti': 300, 'phc-marwan': 1200, 'chc-kurhani': 3000, 'dh-muz': 5000 } },
  { name: 'ORS sachet', generic: 'Oral rehydration salts', stock: { 'sc-kanti': 45, 'phc-marwan': 500, 'chc-kurhani': 900, 'dh-muz': 2000 } },
  { name: 'Amoxicillin 500mg', generic: 'Amoxicillin', stock: { 'sc-kanti': 0, 'phc-marwan': 30, 'chc-kurhani': 600, 'dh-muz': 2200 }, price: 25 },
  { name: 'Insulin (Regular)', generic: 'Human insulin', stock: { 'sc-kanti': 0, 'phc-marwan': 0, 'chc-kurhani': 12, 'dh-muz': 140 }, price: 140 },
  { name: 'Anti-snake venom', generic: 'ASV', stock: { 'sc-kanti': 0, 'phc-marwan': 4, 'chc-kurhani': 18, 'dh-muz': 60 } },
];

export const LOW_STOCK = 50;

/* ---------------- Diagnostics ---------------- */

export type LabStatus = 'booked' | 'sample-collected' | 'processing' | 'ready';

export interface LabOrder {
  id: string;
  test: string;
  facilityId: string;
  date: string;
  status: LabStatus;
  homeCollection: boolean;
  result?: string;
}

export const labTests = [
  { id: 'cbc', name: 'Complete Blood Count', price: 0, tat: 'Same day' },
  { id: 'hb', name: 'Haemoglobin', price: 0, tat: '1 hour' },
  { id: 'fbs', name: 'Blood Sugar (Fasting)', price: 0, tat: '1 hour' },
  { id: 'hba1c', name: 'HbA1c', price: 0, tat: '1 day' },
  { id: 'urine', name: 'Urine Routine', price: 0, tat: 'Same day' },
  { id: 'xray', name: 'Chest X-ray', price: 0, tat: 'Same day' },
  { id: 'sputum', name: 'Sputum for TB (CBNAAT)', price: 0, tat: '2 days' },
];

export const labOrdersStore = createStore<LabOrder[]>([
  { id: 'L-881', test: 'HbA1c', facilityId: 'chc-kurhani', date: '22 Sep 2026', status: 'processing', homeCollection: true },
  { id: 'L-870', test: 'Complete Blood Count', facilityId: 'phc-marwan', date: '12 Sep 2026', status: 'ready', homeCollection: false, result: 'Hb 11.9 g/dL, WBC 7,200, Platelets 2.4 L — normal' },
]);

/* ---------------- OPD queue ---------------- */

export interface QueueToken {
  facilityId: string;
  department: string;
  token: number;
  nowServing: number;
  avgMinsPerPatient: number;
}

export const myTokenStore = createStore<QueueToken | null>({
  facilityId: 'phc-marwan',
  department: 'General OPD',
  token: 34,
  nowServing: 27,
  avgMinsPerPatient: 6,
});

/* ---------------- Doctor's teleconsult / OPD queue ---------------- */

export interface ConsultRequest {
  id: string;
  patientId: string;
  mode: 'video' | 'audio' | 'chat';
  triage: 'emergency' | 'urgent' | 'routine';
  complaint: string;
  assistedBy?: string;
  from: string;
  waitingMins: number;
  status: 'waiting' | 'in-progress' | 'done';
}

export const consultQueueStore = createStore<ConsultRequest[]>([
  { id: 'c1', patientId: 'p1', mode: 'video', triage: 'urgent', complaint: 'Headache, swelling of feet, BP 142/94', assistedBy: 'ANM Kanti', from: 'Kanti Sub-centre', waitingMins: 4, status: 'waiting' },
  { id: 'c2', patientId: 'p2', mode: 'audio', triage: 'routine', complaint: 'Sugar high on glucometer, burning feet', assistedBy: 'ASHA Rekha', from: 'Marwan (home)', waitingMins: 11, status: 'waiting' },
  { id: 'c3', patientId: 'p4', mode: 'chat', triage: 'routine', complaint: 'Mild cough, TB medicines side effects', from: 'Bochaha', waitingMins: 18, status: 'waiting' },
  { id: 'c4', patientId: 'p5', mode: 'video', triage: 'routine', complaint: 'Follow-up after fever', from: 'Marwan', waitingMins: 0, status: 'done' },
]);

/* ---------------- Health worker tasks ---------------- */

export interface WorkerTask {
  id: string;
  patientId: string;
  kind: 'ANC visit' | 'PNC visit' | 'Immunisation' | 'NCD refill' | 'TB DOTS' | 'Referral follow-up';
  due: 'Today' | 'Tomorrow' | 'This week' | 'Overdue';
  done: boolean;
}

export const tasksStore = createStore<WorkerTask[]>([
  { id: 't1', patientId: 'p1', kind: 'Referral follow-up', due: 'Today', done: false },
  { id: 't2', patientId: 'p3', kind: 'Immunisation', due: 'Overdue', done: false },
  { id: 't3', patientId: 'p2', kind: 'NCD refill', due: 'Today', done: false },
  { id: 't4', patientId: 'p4', kind: 'TB DOTS', due: 'Tomorrow', done: false },
  { id: 't5', patientId: 'p1', kind: 'ANC visit', due: 'This week', done: false },
]);

/* ---------------- Mother & child ---------------- */

export const ancSchedule = [
  { visit: 'ANC 1', window: 'Within 12 weeks', done: true },
  { visit: 'ANC 2', window: '14–26 weeks', done: true },
  { visit: 'ANC 3', window: '28–34 weeks', done: false, due: '25 Sep 2026' },
  { visit: 'ANC 4', window: '36 weeks – term', done: false, due: '20 Oct 2026' },
];

export const immunisationSchedule = [
  { age: 'Birth', vaccines: 'BCG, OPV-0, Hep B-0', done: true },
  { age: '6 weeks', vaccines: 'Pentavalent-1, OPV-1, Rota-1, fIPV-1, PCV-1', done: true },
  { age: '10 weeks', vaccines: 'Pentavalent-2, OPV-2, Rota-2', done: false, due: '24 Sep 2026' },
  { age: '14 weeks', vaccines: 'Pentavalent-3, OPV-3, Rota-3, fIPV-2, PCV-2', done: false, due: '22 Oct 2026' },
  { age: '9 months', vaccines: 'MR-1, JE-1, PCV booster, Vit A', done: false },
];

/* ---------------- Facility dashboard ---------------- */

export const facilityKpis = {
  facilityId: 'phc-marwan',
  opdToday: 142,
  opdYesterday: 128,
  avgWaitMins: 38,
  avgWaitLastWeek: 55,
  teleconsultsToday: 23,
  referralCompletion: 78,
  followUpCoverage: 71,
  stockOuts: 3,
  bedOccupancy: 64,
  staffPresent: 11,
  staffTotal: 14,
  opdByDay: [
    { day: 'Mon', value: 118 },
    { day: 'Tue', value: 131 },
    { day: 'Wed', value: 124 },
    { day: 'Thu', value: 140 },
    { day: 'Fri', value: 152 },
    { day: 'Sat', value: 128 },
    { day: 'Sun', value: 142 },
  ],
  equipment: [
    { name: 'Haemoglobinometer', status: 'working' as const },
    { name: 'Glucometer strips', status: 'low' as const },
    { name: 'X-ray unit', status: 'down' as const },
    { name: 'Oxygen concentrator', status: 'working' as const },
    { name: 'Cold chain (ILR)', status: 'working' as const },
  ],
  quality: [
    { label: 'Prescriptions per generic guidelines', value: 92 },
    { label: 'ANC with 4+ visits', value: 67 },
    { label: 'Full immunisation (12–23 m)', value: 84 },
    { label: 'Hypertension patients controlled', value: 48 },
  ],
};
