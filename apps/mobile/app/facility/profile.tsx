import { ProfileView } from '../../src/components/ProfileView';
import { facilityKpis } from '../../src/data/rural';
import { Row, StatTile } from '../../src/design-system';

export default function FacilityProfile() {
  return (
    <ProfileView subtitle="Medical Officer in-charge · PHC Marwan">
      <Row gap="sm">
        <StatTile value={facilityKpis.staffTotal} label="Staff" />
        <StatTile value="24×7" label="Delivery point" />
        <StatTile value={`${facilityKpis.bedOccupancy}%`} label="Beds used" />
      </Row>
    </ProfileView>
  );
}
