import { router } from 'expo-router';
import { View } from 'react-native';
import { ProfileView } from '../../src/components/ProfileView';
import { useAppointments } from '../../src/data/appointments';
import { labReports, prescriptions } from '../../src/data/mock';
import { Card, ListItem, Row, StatTile, colors, spacing } from '../../src/design-system';

export default function Profile() {
  const upcoming = useAppointments().filter((a) => a.status === 'upcoming').length;
  return (
    <ProfileView>
      <Row gap="sm">
        <StatTile icon="calendar-outline" label="Appointments" value={upcoming} onPress={() => router.navigate('/appointments')} />
        <StatTile icon="heart" iconColor={colors.danger} label="Reports" value={labReports.length} onPress={() => router.push({ pathname: '/records', params: { tab: 'reports' } })} />
        <StatTile icon="medical-outline" label="Prescriptions" value={prescriptions.length} onPress={() => router.push('/records')} />
        <StatTile icon="id-card-outline" label="Health ID" value="ABHA" onPress={() => router.push('/health-id')} />
      </Row>
      <Card padding="none" style={{ marginTop: spacing.lg }}>
        <View style={{ paddingHorizontal: spacing.md }}>
          <ListItem icon="document-text-outline" label="Health Records" onPress={() => router.push('/records')} />
          <ListItem icon="id-card-outline" label="Health ID (ABHA)" onPress={() => router.push('/health-id')} />
          <ListItem icon="git-branch-outline" label="My Referrals" onPress={() => router.push('/referrals')} />
          <ListItem icon="flask-outline" label="Lab Tests" onPress={() => router.push('/diagnostics')} />
          <ListItem icon="woman-outline" label="Mother & Child" onPress={() => router.push('/mother-child')} />
        </View>
      </Card>
    </ProfileView>
  );
}
