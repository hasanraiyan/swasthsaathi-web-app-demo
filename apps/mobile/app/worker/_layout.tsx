import { RoleGate } from '../../src/components/RoleGate';
import { RoleTabs } from '../../src/components/RoleTabs';

export default function WorkerLayout() {
  return (
    <RoleGate role="worker">
      <RoleTabs
        tabs={[
          { name: 'index', title: 'Home', icon: 'home-outline', iconActive: 'home' },
          { name: 'patients', title: 'Patients', icon: 'people-outline', iconActive: 'people' },
          { name: 'followups', title: 'Follow-ups', icon: 'checkbox-outline', iconActive: 'checkbox' },
          { name: 'profile', title: 'Profile', icon: 'person-outline', iconActive: 'person' },
        ]}
      />
    </RoleGate>
  );
}
