import { useState } from 'react';
import { View } from 'react-native';
import { facilities, getFacility, labOrdersStore, labTests, type LabStatus } from '../src/data/rural';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Header,
  Icon,
  OptionChips,
  Row,
  Screen,
  SegmentedControl,
  Spacer,
  Stepper,
  Text,
  colors,
  spacing,
} from '../src/design-system';

const statusSteps: { key: LabStatus; label: string }[] = [
  { key: 'booked', label: 'Booked' },
  { key: 'sample-collected', label: 'Sample collected' },
  { key: 'processing', label: 'Processing at lab' },
  { key: 'ready', label: 'Report ready' },
];

export default function Diagnostics() {
  const orders = labOrdersStore.use();
  const [tab, setTab] = useState<'orders' | 'book'>('orders');
  const [selected, setSelected] = useState<string[]>([]);
  const [facilityId, setFacilityId] = useState('phc-marwan');
  const [home, setHome] = useState(false);
  const [open, setOpen] = useState<string | null>(orders[0]?.id ?? null);

  const book = () => {
    const tests = labTests.filter((t) => selected.includes(t.id));
    labOrdersStore.set((prev) => [
      ...tests.map((t, i) => ({
        id: `L-${900 + prev.length + i}`,
        test: t.name,
        facilityId,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'booked' as const,
        homeCollection: home,
      })),
      ...prev,
    ]);
    setSelected([]);
    setTab('orders');
  };

  return (
    <Screen
      footer={
        tab === 'book' ? (
          <Button label={`Book ${selected.length || ''} test${selected.length === 1 ? '' : 's'}`} size="lg" fullWidth disabled={!selected.length} onPress={book} />
        ) : undefined
      }
    >
      <Header title="Lab Tests" />
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'orders', label: 'My tests' },
          { value: 'book', label: 'Book a test' },
        ]}
      />
      <Spacer size="lg" />

      {tab === 'orders' && (
        <View style={{ gap: spacing.md }}>
          {orders.map((o) => {
            const idx = statusSteps.findIndex((s) => s.key === o.status);
            const expanded = open === o.id;
            return (
              <Card key={o.id} onPress={() => setOpen(expanded ? null : o.id)} style={{ gap: spacing.md }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text variant="title">{o.test}</Text>
                    <Text variant="small" color="textSecondary">
                      {getFacility(o.facilityId)?.name} · {o.date}
                      {o.homeCollection ? ' · Home collection' : ''}
                    </Text>
                  </View>
                  <Badge label={statusSteps[idx]!.label} tone={o.status === 'ready' ? 'success' : 'info'} />
                </Row>
                {expanded && <Stepper steps={statusSteps} currentIndex={o.status === 'ready' ? statusSteps.length : idx} />}
                {o.result && (
                  <Card tone="tint" padding="md">
                    <Row gap="sm" style={{ alignItems: 'flex-start' }}>
                      <Icon name="document-text-outline" size={18} color={colors.primary} />
                      <Text variant="small" style={{ flex: 1 }}>
                        {o.result}
                      </Text>
                    </Row>
                  </Card>
                )}
              </Card>
            );
          })}
        </View>
      )}

      {tab === 'book' && (
        <View style={{ gap: spacing.xl }}>
          <Card style={{ gap: spacing.lg }}>
            {labTests.map((t) => (
              <Row key={t.id} style={{ justifyContent: 'space-between' }}>
                <Checkbox
                  checked={selected.includes(t.id)}
                  onChange={() => setSelected((s) => (s.includes(t.id) ? s.filter((x) => x !== t.id) : [...s, t.id]))}
                  label={t.name}
                />
                <Text variant="caption" color="textMuted">
                  {t.price === 0 ? 'Free' : `₹${t.price}`} · {t.tat}
                </Text>
              </Row>
            ))}
          </Card>
          <View style={{ gap: spacing.md }}>
            <Text variant="h3">Where?</Text>
            <OptionChips
              value={facilityId}
              onChange={setFacilityId}
              options={facilities.filter((f) => f.services.some((s) => /lab|x-ray|ct/i.test(s)) || f.level !== 'SC').map((f) => ({ value: f.id, label: f.name }))}
            />
            <Checkbox checked={home} onChange={setHome} label="Home sample collection by ANM / lab technician" />
          </View>
        </View>
      )}
    </Screen>
  );
}
