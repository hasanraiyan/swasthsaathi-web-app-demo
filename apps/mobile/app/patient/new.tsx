import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { patientsStore, type Patient, type Program } from '../../src/data/rural';
import { Button, Checkbox, Field, Header, OptionChips, Row, Screen, Spacer, Text, spacing } from '../../src/design-system';

export default function NewPatient() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Patient['gender']>('F');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [abha, setAbha] = useState('');
  const [program, setProgram] = useState<Program>('general');
  const [pregnant, setPregnant] = useState(false);
  const [consent, setConsent] = useState(false);

  const valid = name.trim() && age && village.trim() && consent;

  const save = () => {
    const id = `p${Date.now()}`;
    const high = pregnant || program === 'maternal';
    patientsStore.set((all) => [
      {
        id,
        name: name.trim(),
        age: Number(age),
        gender,
        phone: phone.trim(),
        village: village.trim(),
        abha: abha.trim() || undefined,
        program: pregnant ? 'maternal' : program,
        risk: high ? 'medium' : 'low',
        riskReasons: pregnant ? ['New pregnancy — first ANC due'] : [],
        conditions: pregnant ? ['Pregnancy'] : [],
        vitals: {},
        nextFollowUp: pregnant ? 'This week' : undefined,
        ashaName: 'Rekha Kumari',
        timeline: [
          {
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            title: 'Registered by ASHA',
            detail: 'Household visit',
            facility: village.trim(),
            kind: 'visit',
          },
        ],
      },
      ...all,
    ]);
    router.replace({ pathname: '/patient/[id]', params: { id } });
  };

  return (
    <Screen footer={<Button label="Register patient" size="lg" fullWidth disabled={!valid} onPress={save} />}>
      <Header title="Register Patient" />
      <View style={{ gap: spacing.lg }}>
        <Field label="Full name *" placeholder="e.g. Sunita Devi" value={name} onChangeText={setName} />
        <Row gap="sm">
          <View style={{ flex: 1 }}>
            <Field label="Age (years) *" placeholder="0 for infant" value={age} onChangeText={(t) => setAge(t.replace(/\D/g, ''))} keyboardType="number-pad" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Mobile" placeholder="10 digits" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
        </Row>
        <View style={{ gap: spacing.sm }}>
          <Text variant="smallMedium">Gender</Text>
          <OptionChips
            value={gender}
            onChange={setGender}
            options={[
              { value: 'F', label: 'Female' },
              { value: 'M', label: 'Male' },
              { value: 'O', label: 'Other' },
            ]}
          />
        </View>
        <Field label="Village / ward *" placeholder="e.g. Kanti" value={village} onChangeText={setVillage} />
        <Field label="ABHA number (optional)" placeholder="91-XXXX-XXXX-XXXX" value={abha} onChangeText={setAbha} keyboardType="number-pad" />
        <View style={{ gap: spacing.sm }}>
          <Text variant="smallMedium">Programme</Text>
          <OptionChips
            value={program}
            onChange={setProgram}
            options={[
              { value: 'general', label: 'General' },
              { value: 'maternal', label: 'Maternal' },
              { value: 'child', label: 'Child' },
              { value: 'chronic', label: 'NCD' },
              { value: 'tb', label: 'TB' },
            ]}
          />
        </View>
        {gender === 'F' && <Checkbox checked={pregnant} onChange={setPregnant} label="Currently pregnant" />}
        <Checkbox checked={consent} onChange={setConsent} label="Patient agreed to digital health record *" />
      </View>
      <Spacer size="lg" />
    </Screen>
  );
}
