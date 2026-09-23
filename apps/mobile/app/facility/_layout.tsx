import { RoleGate } from '../../src/components/RoleGate';
import { RoleTabs } from '../../src/components/RoleTabs';

export default function FacilityLayout() {
  return (
    <RoleGate role="admin">
      <RoleTabs
        tabs={[
          { name: 'index', title: 'Dashboard', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
          { name: 'stock', title: 'Stock', icon: 'cube-outline', iconActive: 'cube' },
          { name: 'referrals', title: 'Referrals', icon: 'git-branch-outline', iconActive: 'git-branch' },
          { name: 'profile', title: 'Profile', icon: 'person-outline', iconActive: 'person' },
        ]}
      />
    </RoleGate>
  );
}
