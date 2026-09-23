import { RoleGate } from '../../src/components/RoleGate';
import { RoleTabs } from '../../src/components/RoleTabs';

export default function ClinicLayout() {
  return (
    <RoleGate role="doctor">
      <RoleTabs
        tabs={[
          { name: 'index', title: 'Queue', icon: 'people-circle-outline', iconActive: 'people-circle' },
          { name: 'patients', title: 'Patients', icon: 'folder-open-outline', iconActive: 'folder-open' },
          { name: 'referrals', title: 'Referrals', icon: 'git-branch-outline', iconActive: 'git-branch' },
          { name: 'profile', title: 'Profile', icon: 'person-outline', iconActive: 'person' },
        ]}
      />
    </RoleGate>
  );
}
