import { useState } from 'react';
import { View } from 'react-native';
import { LOW_STOCK, facilityKpis, medicines } from '../../src/data/rural';
import { Badge, Button, Card, Header, Icon, Row, Screen, SegmentedControl, Spacer, Text, colors, spacing } from '../../src/design-system';

type Filter = 'all' | 'attention';

export default function Stock() {
  const fid = facilityKpis.facilityId;
  const [filter, setFilter] = useState<Filter>('attention');
  const [requested, setRequested] = useState<string[]>([]);

  const rows = medicines
    .map((m) => ({ ...m, units: m.stock[fid] ?? 0 }))
    .filter((m) => filter === 'all' || m.units < LOW_STOCK)
    .sort((a, b) => a.units - b.units);

  return (
    <Screen>
      <Header title="Medicine Stock" showBack={false} />
      <SegmentedControl
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'attention', label: 'Needs attention' },
          { value: 'all', label: 'All items' },
        ]}
      />
      <Spacer size="lg" />
      <View style={{ gap: spacing.sm }}>
        {rows.map((m) => {
          const out = m.units === 0;
          const low = !out && m.units < LOW_STOCK;
          const isRequested = requested.includes(m.name);
          return (
            <Card key={m.name} padding="md" style={{ gap: spacing.sm }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="title">{m.name}</Text>
                  <Text variant="small" color="textSecondary">
                    {m.units} units in stock
                  </Text>
                </View>
                <Row gap="xs">
                  <Icon name={out ? 'close-circle' : low ? 'warning' : 'checkmark-circle'} size={16} color={out ? colors.danger : low ? '#B7791F' : colors.primary} />
                  <Badge label={out ? 'Out of stock' : low ? 'Low' : 'OK'} tone={out ? 'danger' : low ? 'warning' : 'success'} />
                </Row>
              </Row>
              {(out || low) && (
                <Button
                  label={isRequested ? 'Indent requested' : 'Request from district store'}
                  size="sm"
                  variant={isRequested ? 'secondary' : 'outline'}
                  iconLeft={isRequested ? 'checkmark' : 'cart-outline'}
                  disabled={isRequested}
                  onPress={() => setRequested((r) => [...r, m.name])}
                />
              )}
            </Card>
          );
        })}
        {rows.length === 0 && (
          <Text color="textSecondary" align="center" style={{ paddingVertical: spacing.xxl }}>
            All items are sufficiently stocked.
          </Text>
        )}
      </View>
      <Text variant="caption" color="textMuted" align="center" style={{ marginTop: spacing.lg }}>
        Low stock = fewer than {LOW_STOCK} units. Stock is visible to patients and health workers.
      </Text>
    </Screen>
  );
}
