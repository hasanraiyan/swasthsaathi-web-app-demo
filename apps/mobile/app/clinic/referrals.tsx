import { router } from 'expo-router';
import { ReferralList } from '../../src/components/ReferralList';
import { Header, IconButton, Screen } from '../../src/design-system';

export default function ClinicReferrals() {
  return (
    <Screen>
      <Header title="Referrals" showBack={false} right={<IconButton icon="add" label="New referral" onPress={() => router.push('/referrals/new')} />} />
      <ReferralList />
    </Screen>
  );
}
