import { PatientList } from '../../src/components/PatientList';
import { Header, Screen } from '../../src/design-system';

export default function ClinicPatients() {
  return (
    <Screen>
      <Header title="Patients" showBack={false} />
      <PatientList />
    </Screen>
  );
}
