import { router } from 'expo-router';
import { View } from 'react-native';
import { Header, RadioOption, Screen, Spacer, Text, spacing } from '../src/design-system';
import { languages, useI18n } from '../src/state/i18n';

export default function Language() {
  const { lang, setLanguage, t } = useI18n();
  return (
    <Screen>
      <Header title={t('language')} />
      <Text color="textSecondary">Choose the language for menus and health guidance.</Text>
      <Spacer size="lg" />
      <View style={{ gap: spacing.sm }}>
        {languages.map((l) => (
          <RadioOption
            key={l.code}
            icon="language-outline"
            label={l.native}
            sublabel={l.label}
            selected={lang === l.code}
            onPress={() => {
              setLanguage(l.code);
              router.back();
            }}
          />
        ))}
      </View>
      <Spacer size="lg" />
      <Text variant="caption" color="textMuted">
        More languages (Maithili, Bengali, Urdu) and voice guidance are coming soon.
      </Text>
    </Screen>
  );
}
