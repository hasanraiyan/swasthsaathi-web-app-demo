import { patientsStore, tasksStore } from '../../src/data/rural';
import { ProfileView } from '../../src/components/ProfileView';
import { Row, StatTile } from '../../src/design-system';

export default function WorkerProfile() {
  const patients = patientsStore.use();
  const tasks = tasksStore.use();
  return (
    <ProfileView subtitle="ASHA · Kanti Sub-centre, Kanti block">
      <Row gap="sm">
        <StatTile value={patients.length} label="Patients" />
        <StatTile value={tasks.filter((t) => t.done).length} label="Visits done" />
        <StatTile value={patients.filter((p) => p.program === 'maternal').length} label="Pregnancies" />
      </Row>
    </ProfileView>
  );
}
