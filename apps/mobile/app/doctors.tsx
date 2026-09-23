import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DoctorCard } from '../src/components/DoctorCard';
import { doctors, getSpecialty, specialties } from '../src/data/mock';
import {
  Chip,
  Header,
  IconButton,
  IconTile,
  Screen,
  SearchBar,
  SectionHeader,
  Spacer,
  Text,
  spacing,
} from '../src/design-system';

const sorts = [
  { id: 'nearby', label: 'Nearby', icon: 'shield-checkmark-outline' },
  { id: 'today', label: 'Available Today', icon: 'calendar-outline' },
  { id: 'top', label: 'Top Rated', icon: 'star-outline' },
] as const;

type SortId = (typeof sorts)[number]['id'];

export default function Doctors() {
  const params = useLocalSearchParams<{ specialty?: string; q?: string }>();
  const [specialty, setSpecialty] = useState<string | undefined>(params.specialty);
  const [query, setQuery] = useState(params.q ?? '');
  const [sort, setSort] = useState<SortId>('nearby');
  const [showSearch, setShowSearch] = useState(!params.specialty);

  const current = getSpecialty(specialty);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doctors
      .filter((d) => !specialty || d.specialtyId === specialty)
      .filter(
        (d) =>
          !q ||
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.hospital.toLowerCase().includes(q),
      )
      .filter((d) => sort !== 'today' || d.availability === 'Available Today')
      .sort((a, b) => (sort === 'top' ? b.rating - a.rating : a.distanceKm - b.distanceKm));
  }, [specialty, query, sort]);

  return (
    <Screen>
      <Header
        title={current?.label ?? 'Book Appointment'}
        right={<IconButton icon={showSearch ? 'close' : 'search-outline'} label="Search" onPress={() => setShowSearch((s) => !s)} />}
      />

      {!current && (
        <View style={{ gap: spacing.xs, marginBottom: spacing.lg }}>
          <Text variant="h2">Find the right doctor{'\n'}for your needs</Text>
          <Text variant="small" color="textSecondary">
            Search by specialty, doctor name or hospital
          </Text>
        </View>
      )}

      {showSearch && (
        <>
          <SearchBar
            placeholder="Search doctors, specialities, or hospitals"
            value={query}
            onChangeText={setQuery}
            autoFocus={!!current}
            returnKeyType="search"
          />
          <Spacer size="lg" />
        </>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
        <Chip label="All" selected={!specialty} onPress={() => setSpecialty(undefined)} />
        {specialties.map((s) => (
          <Chip key={s.id} label={s.label} selected={specialty === s.id} onPress={() => setSpecialty(s.id)} />
        ))}
      </ScrollView>

      {!current && !query && (
        <>
          <SectionHeader title="Popular Specialties" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tiles}>
            {specialties.map((s) => (
              <IconTile
                key={s.id}
                icon={s.icon}
                label={s.label}
                tint={s.tint}
                background={s.background}
                onPress={() => setSpecialty(s.id)}
              />
            ))}
          </ScrollView>
          <Spacer size="xl" />
        </>
      )}

      <SectionHeader title={current ? `${list.length} doctors` : 'Available Doctors'} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
        {sorts.map((s) => (
          <Chip key={s.id} label={s.label} icon={s.icon} selected={sort === s.id} onPress={() => setSort(s.id)} />
        ))}
      </ScrollView>

      <View style={{ gap: spacing.md }}>
        {list.map((d) => (
          <DoctorCard key={d.id} doctor={d} />
        ))}
        {list.length === 0 && (
          <View style={styles.empty}>
            <Text variant="title" align="center">No doctors found</Text>
            <Text variant="small" color="textSecondary" align="center">
              Try a different specialty or search term.
            </Text>
            <Spacer size="sm" />
            <Chip label="Show all doctors" onPress={() => { setSpecialty(undefined); setQuery(''); setSort('nearby'); router.setParams({ specialty: undefined }); }} />
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pills: { gap: spacing.sm, paddingBottom: spacing.lg },
  tiles: { gap: spacing.md, paddingRight: spacing.lg },
  empty: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xxxl },
});
