import { ProfileView } from '../../src/components/ProfileView';
import { consultQueueStore } from '../../src/data/rural';
import { Row, StatTile } from '../../src/design-system';

export default function DoctorProfile() {
  const queue = consultQueueStore.use();
  return (
    <ProfileView subtitle="Medical Officer · PHC Marwan">
      <Row gap="sm">
        <StatTile value={queue.filter((c) => c.status === 'done').length + 17} label="Consults today" />
        <StatTile value="4.8" label="Patient rating" />
        <StatTile value="92%" label="Rx per guidelines" />
      </Row>
    </ProfileView>
  );
}
