import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { patientsStore, programLabel, type Program } from '../data/rural';
import { Avatar, Card, Chip, Icon, RiskBadge, Row, SearchBar, Spacer, Text, colors, spacing } from '../design-system';

const filters: { id: Program | 'all' | 'high'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'high', label: 'High risk' },
  { id: 'maternal', label: 'Maternal' },
  { id: 'child', label: 'Child' },
  { id: 'chronic', label: 'NCD' },
  { id: 'tb', label: 'TB' },
];

export function PatientList({ initialFilter = 'all' }: { initialFilter?: (typeof filters)[number]['id'] }) {
  const patients = patientsStore.use();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState(initialFilter);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    const order = { high: 0, medium: 1, low: 2 };
    return patients
      .filter((p) => filter === 'all' || (filter === 'high' ? p.risk === 'high' : p.program === filter))
      .filter(
        (p) =>
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.village.toLowerCase().includes(query) ||
          p.phone.includes(query) ||
          p.abha?.replace(/-/g, '').includes(query.replace(/-/g, '')),
      )
      .sort((a, b) => order[a.risk] - order[b.risk]);
  }, [patients, q, filter]);

  return (
    <View>
      <SearchBar placeholder="Search name, village, phone or ABHA" value={q} onChangeText={setQ} />
      <Spacer size="md" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.lg }}>
        {filters.map((f) => (
          <Chip key={f.id} label={f.label} selected={filter === f.id} onPress={() => setFilter(f.id)} />
        ))}
      </ScrollView>
      <View style={{ gap: spacing.md }}>
        {list.map((p) => (
          <Card key={p.id} onPress={() => router.push({ pathname: '/patient/[id]', params: { id: p.id } })}>
            <Row gap="md" style={{ alignItems: 'flex-start' }}>
              <Avatar name={p.name} size={48} />
              <View style={{ flex: 1, gap: 2 }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Text variant="title" style={{ flex: 1 }} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <RiskBadge risk={p.risk} />
                </Row>
                <Text variant="small" color="textSecondary">
                  {p.age === 0 ? 'Infant' : `${p.age} y`} · {p.gender} · {p.village} · {programLabel[p.program]}
                </Text>
                {p.riskReasons[0] && (
                  <Row gap="xs">
                    <Icon name="alert-circle-outline" size={14} color={p.risk === 'high' ? colors.danger : colors.textSecondary} />
                    <Text variant="small" color="textSecondary" numberOfLines={1} style={{ flex: 1 }}>
                      {p.riskReasons.join(' · ')}
                    </Text>
                  </Row>
                )}
                {p.nextFollowUp && (
                  <Text variant="caption" color="primary">
                    Next follow-up: {p.nextFollowUp}
                  </Text>
                )}
              </View>
            </Row>
          </Card>
        ))}
        {list.length === 0 && (
          <Text color="textSecondary" align="center" style={{ paddingVertical: spacing.xxl }}>
            No patients match.
          </Text>
        )}
      </View>
    </View>
  );
}

