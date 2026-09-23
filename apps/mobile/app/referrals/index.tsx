import { router } from 'expo-router';
import { ReferralList } from '../../src/components/ReferralList';
import { Header, IconButton, Screen, Spacer, Text } from '../../src/design-system';
import { useRole } from '../../src/state/role';

export default function Referrals() {
  const { role } = useRole();
  const canCreate = role === 'worker' || role === 'doctor';
  return (
    <Screen>
      <Header
        title="Referrals"
        right={canCreate ? <IconButton icon="add" label="New referral" onPress={() => router.push('/referrals/new')} /> : undefined}
      />
      <Text color="textSecondary">Track every referral from sub-centre to district hospital until feedback comes back.</Text>
      <Spacer size="lg" />
      <ReferralList />
    </Screen>
  );
}
