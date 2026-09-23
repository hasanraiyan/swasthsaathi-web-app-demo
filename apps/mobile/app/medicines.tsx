import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { openDirections } from '../src/components/AppointmentCard';
import { LOW_STOCK, facilities, medicines } from '../src/data/rural';
import { Banner, Card, Header, Icon, Row, Screen, SearchBar, Spacer, Text, colors, spacing } from '../src/design-system';

function stockLabel(units: number) {
  if (units === 0) return { text: 'Out of stock', color: colors.danger, icon: 'close-circle' as const };
  if (units < LOW_STOCK) return { text: `Low (${units})`, color: '#B7791F', icon: 'warning' as const };
  return { text: 'Available', color: colors.primary, icon: 'checkmark-circle' as const };
}

export default function Medicines() {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return medicines.filter((m) => !query || m.name.toLowerCase().includes(query) || m.generic.toLowerCase().includes(query));
  }, [q]);

  return (
    <Screen>
      <Header title="Medicine Availability" />
      <SearchBar placeholder="Search medicine (e.g. Metformin)" value={q} onChangeText={setQ} />
      <Spacer size="md" />
      <Banner tone="success" title="Free at government facilities" body="Essential medicines are free at SC / PHC / CHC / DH under the Free Drugs Service Initiative." />
      <Spacer size="lg" />
      <View style={{ gap: spacing.md }}>
        {list.map((m) => {
          const nearestWithStock = [...facilities].sort((a, b) => a.distanceKm - b.distanceKm).find((f) => (m.stock[f.id] ?? 0) > 0);
          return (
            <Card key={m.name} style={{ gap: spacing.sm }}>
              <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="title">{m.name}</Text>
                  <Text variant="small" color="textSecondary">
                    {m.generic}
                    {m.price ? ` · Jan Aushadhi ₹${m.price}` : ''}
                  </Text>
                </View>
              </Row>
              {facilities.map((f) => {
                const s = stockLabel(m.stock[f.id] ?? 0);
                return (
                  <Row key={f.id} gap="sm">
                    <Text variant="small" style={{ flex: 1 }} numberOfLines={1}>
                      {f.name} <Text variant="caption" color="textMuted">· {f.distanceKm} km</Text>
                    </Text>
                    <Icon name={s.icon} size={14} color={s.color} />
                    <Text variant="caption" style={{ color: s.color, width: 86 }}>
                      {s.text}
                    </Text>
                  </Row>
                );
              })}
              {nearestWithStock && (
                <Card padding="sm" tone="tint" onPress={() => openDirections(nearestWithStock.name)}>
                  <Row gap="xs">
                    <Icon name="navigate-outline" size={14} color={colors.primary} />
                    <Text variant="smallMedium" color="primary">
                      Nearest with stock: {nearestWithStock.name}
                    </Text>
                  </Row>
                </Card>
              )}
            </Card>
          );
        })}
      </View>
      <Text variant="caption" color="textMuted" align="center" style={{ marginTop: spacing.lg }}>
        Stock is updated by facility pharmacists daily. Call ahead for critical medicines.
      </Text>
    </Screen>
  );
}
