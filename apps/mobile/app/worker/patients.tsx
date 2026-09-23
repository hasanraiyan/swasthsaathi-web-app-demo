import { router } from 'expo-router';
import { PatientList } from '../../src/components/PatientList';
import { Header, IconButton, Screen } from '../../src/design-system';

export default function WorkerPatients() {
  return (
    <Screen>
      <Header title="My Patients" showBack={false} right={<IconButton icon="person-add-outline" label="Register patient" onPress={() => router.push('/patient/new')} />} />
      <PatientList />
    </Screen>
  );
}
