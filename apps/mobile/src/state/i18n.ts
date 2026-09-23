import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createStore } from '../data/store';

export type Lang = 'en' | 'hi' | 'bho';

export const languages: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bho', label: 'Bhojpuri', native: 'भोजपुरी' },
];

const strings = {
  en: {
    hello: 'Hello',
    tagline: 'Take a step towards a healthier you',
    search: 'Search doctors, specialties, or hospitals',
    services: 'Health Services',
    emergency: 'Emergency',
    emergencyCall: 'Call 108 Ambulance',
    symptomCheck: 'Check Symptoms',
    teleconsult: 'Talk to Doctor',
    queue: 'OPD Token',
    medicines: 'Medicines',
    labTests: 'Lab Tests',
    referrals: 'Referrals',
    motherChild: 'Mother & Child',
    healthId: 'Health ID',
    records: 'My Records',
    home: 'Home',
    appointments: 'Appointments',
    healthTips: 'Health Tips',
    profile: 'Profile',
    offline: "You're offline. Changes are saved on this phone and will sync later.",
    language: 'Language',
  },
  hi: {
    hello: 'नमस्ते',
    tagline: 'स्वस्थ जीवन की ओर एक कदम',
    search: 'डॉक्टर, विशेषज्ञ या अस्पताल खोजें',
    services: 'स्वास्थ्य सेवाएँ',
    emergency: 'आपातकाल',
    emergencyCall: '108 एम्बुलेंस बुलाएँ',
    symptomCheck: 'लक्षण जाँचें',
    teleconsult: 'डॉक्टर से बात करें',
    queue: 'ओपीडी टोकन',
    medicines: 'दवाइयाँ',
    labTests: 'जाँच (लैब)',
    referrals: 'रेफ़रल',
    motherChild: 'माँ और बच्चा',
    healthId: 'हेल्थ आईडी',
    records: 'मेरे रिकॉर्ड',
    home: 'होम',
    appointments: 'अपॉइंटमेंट',
    healthTips: 'स्वास्थ्य सुझाव',
    profile: 'प्रोफ़ाइल',
    offline: 'आप ऑफ़लाइन हैं। जानकारी फ़ोन में सुरक्षित है, नेटवर्क आने पर सिंक होगी।',
    language: 'भाषा',
  },
  bho: {
    hello: 'प्रणाम',
    tagline: 'स्वस्थ जिनगी के ओर एगो कदम',
    search: 'डॉक्टर, बेमारी भा अस्पताल खोजीं',
    services: 'स्वास्थ्य सेवा',
    emergency: 'इमरजेंसी',
    emergencyCall: '108 एम्बुलेंस बोलाईं',
    symptomCheck: 'लक्षण जाँचीं',
    teleconsult: 'डॉक्टर से बात करीं',
    queue: 'ओपीडी टोकन',
    medicines: 'दवाई',
    labTests: 'जाँच',
    referrals: 'रेफ़रल',
    motherChild: 'माई आ लइका',
    healthId: 'हेल्थ आईडी',
    records: 'हमार रिकॉर्ड',
    home: 'होम',
    appointments: 'अपॉइंटमेंट',
    healthTips: 'सेहत के बात',
    profile: 'प्रोफ़ाइल',
    offline: 'रउआ ऑफ़लाइन बानी। जानकारी फ़ोन में बा, नेटवर्क आवे पर सिंक हो जाई।',
    language: 'भाषा',
  },
} as const;

export type StringKey = keyof (typeof strings)['en'];

const KEY = 'swasthsaathi.lang';
const langStore = createStore<Lang>('en');

// Restore the saved language (best effort; defaults to English).
(async () => {
  try {
    const saved = Platform.OS === 'web' ? globalThis.localStorage?.getItem(KEY) : await SecureStore.getItemAsync(KEY);
    if (saved === 'en' || saved === 'hi' || saved === 'bho') langStore.set(saved);
  } catch {}
})();

export function setLanguage(lang: Lang) {
  langStore.set(lang);
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(KEY, lang);
    else SecureStore.setItemAsync(KEY, lang).catch(() => {});
  } catch {}
}

export function useI18n() {
  const lang = langStore.use();
  const t = (key: StringKey) => strings[lang][key] ?? strings.en[key];
  return { lang, t, setLanguage };
}
