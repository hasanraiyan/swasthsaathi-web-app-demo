import type { PersonaInterrupt } from '@personaai/react';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Button, Chip, Text, colors, fonts, radius, spacing } from '../../design-system';
import { useAssistantStrings } from '../strings';

/**
 * Port of interrupt-panel.tsx: approve/reject for a paused tool call (HITL), or
 * answers to the assistant's clarifying questions. All questions show at once —
 * simpler on a phone than the example's step-by-step wizard.
 */
export function InterruptPanel({
  interrupt,
  onDecideHitl,
  onSubmitClarification,
}: {
  interrupt: PersonaInterrupt;
  onDecideHitl: (actionName: string, decision: 'approve' | 'reject') => void;
  onSubmitClarification: (answers: Record<string, string>) => void;
}) {
  const s = useAssistantStrings();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [decided, setDecided] = useState<Record<string, boolean>>({});

  if (interrupt.kind === 'hitl') {
    return (
      <View style={styles.card}>
        <Text variant="smallMedium" color="textSecondary">
          {s('approvalTitle')}
        </Text>
        {interrupt.actionRequests.map((action) => (
          <View key={action.name} style={styles.action}>
            <Text variant="title" style={{ flex: 1 }}>
              {action.name.replace(/[_-]+/g, ' ')}
            </Text>
            {!decided[action.name] && (
              <View style={styles.row}>
                <Button
                  label={s('reject')}
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    setDecided((d) => ({ ...d, [action.name]: true }));
                    onDecideHitl(action.name, 'reject');
                  }}
                />
                <Button
                  label={s('approve')}
                  size="sm"
                  onPress={() => {
                    setDecided((d) => ({ ...d, [action.name]: true }));
                    onDecideHitl(action.name, 'approve');
                  }}
                />
              </View>
            )}
          </View>
        ))}
      </View>
    );
  }

  const missing = interrupt.questions.some((q) => q.required && !answers[q.id]?.trim());
  return (
    <View style={styles.card}>
      {interrupt.questions.map((q) => (
        <View key={q.id} style={{ gap: spacing.sm }}>
          <Text variant="title">{q.text}</Text>
          {q.options.length > 0 && (
            <View style={styles.chips}>
              {q.options.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={answers[q.id] === opt}
                  onPress={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                />
              ))}
            </View>
          )}
          {(q.allowCustom || q.options.length === 0) && (
            <TextInput
              style={styles.input}
              placeholderTextColor={colors.textMuted}
              placeholder="…"
              value={q.options.includes(answers[q.id] ?? '') ? '' : (answers[q.id] ?? '')}
              onChangeText={(t) => setAnswers((a) => ({ ...a, [q.id]: t }))}
            />
          )}
        </View>
      ))}
      <Button label={s('submit')} size="sm" disabled={missing} onPress={() => onSubmitClarification(answers)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primaryOutline,
    marginBottom: spacing.sm,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  row: { flexDirection: 'row', gap: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
});
