import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { Card, Header, Icon, Row, Screen, Text, colors, radius, spacing } from '../src/design-system';

type Item = {
  icon: ComponentProps<typeof Icon>['name'];
  tint: string;
  bg: string;
  title: string;
  body: string;
  time: string;
  href: '/queue' | '/referrals' | '/diagnostics' | '/mother-child' | '/appointments' | '/medicines';
};

const items: Item[] = [
  { icon: 'ticket', tint: colors.primary, bg: colors.primarySoft, title: 'Your OPD turn is near', body: '5 people ahead at PHC Marwan, General OPD.', time: '2 min ago', href: '/queue' },
  { icon: 'git-branch', tint: colors.info, bg: colors.infoSoft, title: 'Referral update', body: 'Ambulance assigned for referral R-2031 to CHC Kurhani.', time: '1 h ago', href: '/referrals' },
  { icon: 'flask', tint: colors.accent, bg: colors.accentSoft, title: 'Lab report ready', body: 'Complete Blood Count report is available.', time: 'Yesterday', href: '/diagnostics' },
  { icon: 'medkit', tint: colors.danger, bg: colors.dangerSoft, title: 'Vaccination due', body: "Aarav's 10-week vaccines are due on 24 Sep.", time: 'Yesterday', href: '/mother-child' },
  { icon: 'medical', tint: '#B7791F', bg: colors.warningSoft, title: 'Medicine back in stock', body: 'Metformin 500mg is now available at PHC Marwan.', time: '2 days ago', href: '/medicines' },
];

export default function Notifications() {
  return (
    <Screen>
      <Header title="Notifications" />
      <View style={{ gap: spacing.sm }}>
        {items.map((n) => (
          <Card key={n.title} padding="md" onPress={() => router.push(n.href)}>
            <Row gap="md" style={{ alignItems: 'flex-start' }}>
              <View style={{ width: 40, height: 40, borderRadius: radius.pill, backgroundColor: n.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={n.icon} size={20} color={n.tint} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text variant="title" style={{ flex: 1 }}>
                    {n.title}
                  </Text>
                  <Text variant="caption" color="textMuted">
                    {n.time}
                  </Text>
                </Row>
                <Text variant="small" color="textSecondary">
                  {n.body}
                </Text>
              </View>
            </Row>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
