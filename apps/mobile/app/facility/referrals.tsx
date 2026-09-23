import { ReferralList } from '../../src/components/ReferralList';
import { Header, Screen, Spacer, Text } from '../../src/design-system';

export default function FacilityReferrals() {
  return (
    <Screen>
      <Header title="Referrals" showBack={false} />
      <Text color="textSecondary">Accept incoming referrals and send treatment feedback back to the referring facility.</Text>
      <Spacer size="lg" />
      <ReferralList />
    </Screen>
  );
}
