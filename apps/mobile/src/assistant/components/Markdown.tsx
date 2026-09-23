import { Linking, StyleSheet } from 'react-native';
import MarkdownDisplay from 'react-native-markdown-display';
import { colors, fonts, radius, spacing, typography } from '../../design-system';

/** Assistant replies render as markdown in the app's own type scale (port of message-markdown.tsx). */
export function Markdown({ children }: { children: string }) {
  return (
    <MarkdownDisplay
      style={styles}
      onLinkPress={(url) => {
        void Linking.openURL(url);
        return false;
      }}
    >
      {children}
    </MarkdownDisplay>
  );
}

const styles = StyleSheet.create({
  body: { ...typography.body, color: colors.text },
  paragraph: { marginTop: 0, marginBottom: spacing.sm },
  strong: { fontFamily: fonts.semibold },
  em: { fontStyle: 'italic' },
  heading1: { ...typography.h2, marginBottom: spacing.sm },
  heading2: { ...typography.h3, marginBottom: spacing.xs },
  heading3: { ...typography.title, marginBottom: spacing.xs },
  bullet_list: { marginBottom: spacing.sm },
  ordered_list: { marginBottom: spacing.sm },
  list_item: { marginBottom: spacing.xxs },
  link: { color: colors.primary, textDecorationLine: 'underline' },
  code_inline: { fontFamily: fonts.medium, backgroundColor: colors.surfaceMuted, borderRadius: radius.sm, paddingHorizontal: 4 },
  code_block: { backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: spacing.md, borderWidth: 0 },
  fence: { backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: spacing.md, borderWidth: 0 },
  blockquote: { backgroundColor: colors.primaryTint, borderLeftColor: colors.primary, borderLeftWidth: 3, paddingHorizontal: spacing.md },
  hr: { backgroundColor: colors.border, marginVertical: spacing.md },
  table: { borderColor: colors.border, borderRadius: radius.sm },
  th: { padding: spacing.xs },
  td: { padding: spacing.xs },
});
