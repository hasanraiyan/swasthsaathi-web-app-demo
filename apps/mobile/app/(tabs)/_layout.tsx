import { RoleGate } from '../../src/components/RoleGate';
import { RoleTabs } from '../../src/components/RoleTabs';
import { useI18n } from '../../src/state/i18n';

export default function PatientTabsLayout() {
  const { t } = useI18n();
  return (
    <RoleGate role="patient">
      <RoleTabs
        tabs={[
          { name: 'index', title: t('home'), icon: 'home-outline', iconActive: 'home' },
          { name: 'appointments', title: t('appointments'), icon: 'calendar-outline', iconActive: 'calendar' },
          { name: 'health-tips', title: t('healthTips'), icon: 'bulb-outline', iconActive: 'bulb' },
          { name: 'profile', title: t('profile'), icon: 'person-outline', iconActive: 'person' },
        ]}
      />
    </RoleGate>
  );
}
