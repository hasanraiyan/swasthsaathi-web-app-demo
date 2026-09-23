import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { openDirections } from '../../src/components/AppointmentCard';
import { getDoctor } from '../../src/data/mock';
import {
  Badge,
  Button,
  Card,
  DoctorAvatar,
  Header,
  Icon,
  IconButton,
  InfoRow,
  Row,
  Screen,
  SectionHeader,
  SlotPill,
  Spacer,
  StatTile,
  TagList,
  Text,
  UnderlineTabs,
  colors,
  spacing,
} from '../../src/design-system';

type Tab = 'overview' | 'reviews' | 'qualifications' | 'location';

const reviews = [
  { name: 'Priya S.', rating: 5, text: 'Very patient and explained everything clearly. Highly recommend!' },
  { name: 'Amit K.', rating: 5, text: 'Quick diagnosis and the medicines worked within two days.' },
  { name: 'Neha R.', rating: 4, text: 'Good doctor, the clinic was a little crowded on Saturday.' },
];

export default function DoctorProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = getDoctor(id);
  const [tab, setTab] = useState<Tab>('overview');
  const [favourite, setFavourite] = useState(false);
  const [day, setDay] = useState<string | undefined>(doctor?.availableDays[3] ?? doctor?.availableDays[0]);

  if (!doctor) {
    return (
      <Screen>
        <Header title="Doctor Profile" centered />
        <Text color="textSecondary">Doctor not found.</Text>
      </Screen>
    );
  }

  const share = () =>
    Share.share({ message: `${doctor.name} (${doctor.specialty}) at ${doctor.hospital}, ${doctor.city} — book on SwasthSaathi.` }).catch(() => {});

  return (
    <Screen
      footer={
        <Button
          label="Book Appointment"
          iconRight="arrow-forward"
          size="lg"
          fullWidth
          onPress={() => router.push({ pathname: '/book/[id]', params: { id: doctor.id } })}
        />
      }
    >
      <Header
        title="Doctor Profile"
        centered
        right={
          <Row gap="none">
            <IconButton icon={favourite ? 'heart' : 'heart-outline'} label="Favourite" onPress={() => setFavourite((f) => !f)} />
            <IconButton icon="share-social-outline" label="Share" onPress={share} />
          </Row>
        }
      />

      <Row gap="lg" style={{ alignItems: 'flex-start' }}>
        <DoctorAvatar size={112} variant={doctor.avatar} />
        <View style={{ flex: 1, gap: 4 }}>
          <Badge label={doctor.availability} dot tone={doctor.availability === 'Available Today' ? 'success' : 'info'} />
          <Text variant="h2">{doctor.name}</Text>
          <Text variant="small" color="primary">
            {doctor.specialty}
          </Text>
          <Text variant="small" color="textSecondary">
            {doctor.degree}
          </Text>
          <Row gap="xs">
            <Icon name="star" size={15} color={colors.star} />
            <Text variant="smallMedium">{doctor.rating}</Text>
            <Text variant="small" color="textSecondary">
              ({doctor.reviews} reviews)
            </Text>
          </Row>
          <Row gap="xs">
            <Icon name="location-outline" size={14} color={colors.textSecondary} />
            <Text variant="small" color="textSecondary" style={{ flex: 1 }}>
              {doctor.hospital}, {doctor.city}
            </Text>
          </Row>
        </View>
      </Row>

      <Row gap="sm" style={{ marginTop: spacing.xl }}>
        <StatTile value={`${doctor.experienceYears}+`} label="Years Experience" />
        <StatTile value={`${doctor.patients}+`} label="Patients Treated" />
        <StatTile value={`${doctor.satisfaction}%`} label="Satisfaction Rate" />
      </Row>

      <Spacer size="lg" />
      <UnderlineTabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'reviews', label: 'Reviews' },
          { value: 'qualifications', label: 'Education' },
          { value: 'location', label: 'Location' },
        ]}
      />
      <Spacer size="lg" />

      {tab === 'overview' && (
        <View style={styles.section}>
          <View style={styles.block}>
            <Text variant="h3">About</Text>
            <Text color="textSecondary">{doctor.about}</Text>
          </View>
          <View style={styles.block}>
            <Text variant="h3">Specializations</Text>
            <TagList items={doctor.specializations} />
          </View>
          <View style={styles.block}>
            <Text variant="h3">Languages</Text>
            <TagList items={doctor.languages} tone="muted" />
          </View>
          <View style={styles.block}>
            <Text variant="h3">Available Days</Text>
            <Row gap="xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => {
                const available = doctor.availableDays.includes(d);
                return (
                  <SlotPill
                    key={d}
                    label={d}
                    selected={d === day}
                    onPress={available ? () => setDay(d) : undefined}
                    style={[{ flex: 1, paddingHorizontal: 0 }, !available && { opacity: 0.4 }]}
                  />
                );
              })}
            </Row>
          </View>
          <Card>
            <Row style={{ justifyContent: 'space-between' }}>
              <View>
                <Text variant="small" color="textSecondary">
                  Consultation Fee
                </Text>
                <Text variant="h1">₹{doctor.fee}</Text>
              </View>
              <Row gap="xs">
                <Icon name="videocam-outline" size={18} color={colors.textSecondary} />
                <Text variant="smallMedium" color="textSecondary">
                  {doctor.modes}
                </Text>
              </Row>
            </Row>
          </Card>
        </View>
      )}

      {tab === 'reviews' && (
        <View style={styles.section}>
          {reviews.map((r) => (
            <Card key={r.name}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="title">{r.name}</Text>
                <Row gap="xxs">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Icon key={i} name={i < r.rating ? 'star' : 'star-outline'} size={14} color={colors.star} />
                  ))}
                </Row>
              </Row>
              <Text variant="small" color="textSecondary" style={{ marginTop: spacing.xs }}>
                {r.text}
              </Text>
            </Card>
          ))}
        </View>
      )}

      {tab === 'qualifications' && (
        <View style={styles.section}>
          <SectionHeader title="Education" />
          {doctor.education.map((e) => (
            <InfoRow key={e.degree} icon="school-outline" title={e.degree} subtitle={e.institute} />
          ))}
        </View>
      )}

      {tab === 'location' && (
        <View style={styles.section}>
          <InfoRow icon="business-outline" title={doctor.hospital} subtitle={doctor.address} />
          <InfoRow icon="navigate-outline" title={`${doctor.distanceKm} km away`} subtitle="From your current area" />
          <Button
            label="Get Directions"
            variant="outline"
            iconLeft="location-outline"
            fullWidth
            onPress={() => openDirections(`${doctor.hospital}, ${doctor.address}`)}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.xl },
  block: { gap: spacing.md },
});
