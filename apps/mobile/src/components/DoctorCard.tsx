import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import type { Doctor } from '../data/mock';
import { Badge, Card, DoctorAvatar, Icon, Row, SlotPill, Text, colors, spacing } from '../design-system';

export function DoctorCard({ doctor, showSlots = true }: { doctor: Doctor; showSlots?: boolean }) {
  const [slot, setSlot] = useState(doctor.slots[1]);
  const shown = doctor.slots.slice(0, 3);
  const extra = doctor.slots.length - shown.length;
  const openProfile = () => router.push({ pathname: '/doctor/[id]', params: { id: doctor.id } });
  const book = (time?: string) => router.push({ pathname: '/book/[id]', params: { id: doctor.id, time: time ?? slot } });

  return (
    <Card onPress={openProfile}>
      <Row gap="md" style={{ alignItems: 'flex-start' }}>
        <DoctorAvatar size={64} variant={doctor.avatar} />
        <View style={{ flex: 1, gap: 3 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text variant="h3" style={{ flex: 1 }} numberOfLines={1}>
              {doctor.name}
            </Text>
            {showSlots ? (
              <Icon name="chevron-forward" size={20} color={colors.text} />
            ) : (
              <Badge label={doctor.availability} dot tone={doctor.availability === 'Available Today' ? 'success' : 'info'} />
            )}
          </Row>
          <Text variant="small" color="textSecondary">
            {showSlots ? doctor.degree : doctor.specialty}
          </Text>
          <Row gap="xs">
            <Icon name="star" size={15} color={colors.star} />
            <Text variant="smallMedium">{doctor.rating}</Text>
            <Text variant="small" color="textSecondary">
              ({doctor.reviews} reviews)
            </Text>
          </Row>
          <Row style={{ justifyContent: 'space-between' }}>
            <Row gap="xs" style={{ flex: 1 }}>
              <Icon name="location-outline" size={14} color={colors.textSecondary} />
              <Text variant="small" color="textSecondary" numberOfLines={1} style={{ flex: 1 }}>
                {doctor.hospital}
              </Text>
            </Row>
            <Text variant="small" color="textSecondary">
              {doctor.distanceKm} km
            </Text>
          </Row>
        </View>
      </Row>
      {showSlots && (
        <Row gap="sm" style={{ marginTop: spacing.md }}>
          {shown.map((s) => (
            <SlotPill
              key={s}
              label={s}
              selected={s === slot}
              onPress={() => (s === slot ? book(s) : setSlot(s))}
              style={{ flex: 1 }}
            />
          ))}
          {extra > 0 && <SlotPill label={`+${extra}`} onPress={() => book()} style={{ width: 52 }} />}
        </Row>
      )}
    </Card>
  );
}
