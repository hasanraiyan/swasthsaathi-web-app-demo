import { View } from 'react-native';
import { healthTips } from '../../src/data/mock';
import { Card, Header, Icon, Row, Screen, Text, colors, radius, spacing } from '../../src/design-system';

export default function HealthTips() {
  return (
    <Screen>
      <Header title="Health Tips" showBack={false} />
      <Text color="textSecondary" style={{ marginBottom: spacing.lg }}>
        Small daily habits that keep you and your family healthy.
      </Text>
      <View style={{ gap: spacing.md }}>
        {healthTips.map((t) => (
          <Card key={t.id}>
            <Row gap="lg" style={{ alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.pill,
                  backgroundColor: t.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={t.icon} size={24} color={t.tint} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="title">{t.title}</Text>
                <Text variant="small" color="textSecondary">
                  {t.body}
                </Text>
              </View>
            </Row>
          </Card>
        ))}
      </View>
      <Row gap="sm" style={{ marginTop: spacing.xl, justifyContent: 'center' }}>
        <Icon name="information-circle-outline" size={16} color={colors.textMuted} />
        <Text variant="caption" color="textMuted">
          Tips are general guidance, not a substitute for medical advice.
        </Text>
      </Row>
    </Screen>
  );
}
