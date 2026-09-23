import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemory, type PersonaMemoryFile } from '@personaai/react';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, colors, fonts, radius, spacing } from '../../design-system';
import { useAssistantStrings } from '../strings';

type Scope = NonNullable<PersonaMemoryFile['scope']>;
interface Entry {
  scope: Scope;
  path: string;
  content: string;
  updatedAt?: string;
}

function label(path: string) {
  const base = path.split('/').filter(Boolean).pop() ?? path;
  return base.replace(/\.(md|txt|json)$/i, '').replace(/[_-]+/g, ' ');
}

function preview(content: string) {
  return content.replace(/^#+\s*/gm, '').replace(/\s+/g, ' ').trim();
}

/**
 * The patient's side of the assistant's persistent memory — port of the example's
 * memory-workspace-dialog.tsx, as a phone screen instead of a code editor:
 *   "What I remember about you" = user-scope memory (shared by every agent) + this
 *                                 agent's own memory about the patient
 *   "Saved files"               = the agent's /workspace/ files for this patient
 * These are the same stores the agent reads and writes with its own memory tools.
 */
export function MemorySheet({ visible, onClose, agentId }: { visible: boolean; onClose: () => void; agentId: string }) {
  const s = useAssistantStrings();
  const { memory, isLoading, error, writeFile, deleteFile } = useMemory(visible);

  const [open, setOpen] = useState<Entry | null>(null);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);

  const { aboutYou, saved } = useMemo(() => {
    const agentGroup = memory.agentMemories.find((g) => g.agentId === agentId);
    const workspace = memory.agentWorkspaces.find((g) => g.agentId === agentId);
    const toEntry = (scope: Scope) => (f: PersonaMemoryFile): Entry => ({
      scope,
      path: f.path,
      content: f.content,
      updatedAt: f.updatedAt,
    });
    return {
      aboutYou: [...memory.userFiles.map(toEntry('user')), ...(agentGroup?.files ?? []).map(toEntry('agent'))],
      saved: (workspace?.files ?? []).map(toEntry('workspace')),
    };
  }, [memory, agentId]);

  const scopeArgs = (e: Entry) => ({ scope: e.scope, agentId: e.scope === 'user' ? undefined : agentId });

  const closeDetail = () => {
    setOpen(null);
    setEditing(false);
    setAdding(false);
    setDraft('');
  };

  const save = async () => {
    const text = draft.trim();
    if (!text) return;
    setBusy(true);
    try {
      if (adding) {
        await writeFile({ path: `/notes/note-${Date.now()}.md`, content: text, scope: 'user' });
      } else if (open) {
        await writeFile({ path: open.path, content: text, ...scopeArgs(open) });
      }
      closeDetail();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!open) return;
    setBusy(true);
    try {
      await deleteFile({ path: open.path, ...scopeArgs(open) });
      closeDetail();
    } finally {
      setBusy(false);
    }
  };

  const renderGroup = (title: string, hint: string, icon: 'person-circle-outline' | 'document-text-outline', entries: Entry[]) => (
    <View style={styles.group}>
      <View style={styles.groupHead}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text variant="title">{title}</Text>
          <Text variant="caption" color="textMuted">
            {hint}
          </Text>
        </View>
      </View>
      {entries.length === 0 ? (
        <Text variant="small" color="textMuted" style={styles.empty}>
          {s('memoryEmpty')}
        </Text>
      ) : (
        entries.map((e) => (
          <Pressable
            key={`${e.scope}:${e.path}`}
            onPress={() => {
              setOpen(e);
              setDraft(e.content);
            }}
            style={({ pressed }) => [styles.card, pressed && { backgroundColor: colors.primaryTint }]}
            accessibilityRole="button"
          >
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="smallMedium" numberOfLines={1}>
                {label(e.path)}
              </Text>
              <Text variant="small" color="textSecondary" numberOfLines={2}>
                {preview(e.content) || '—'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
        ))
      )}
    </View>
  );

  const detailOpen = !!open || adding;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={detailOpen ? closeDetail : onClose}>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={detailOpen ? closeDetail : onClose}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={s('close')}
          >
            <Ionicons name={detailOpen ? 'arrow-back' : 'close'} size={24} color={colors.text} />
          </Pressable>
          <Text variant="h3" style={{ flex: 1 }} numberOfLines={1}>
            {adding ? s('addNote') : open ? label(open.path) : s('memory')}
          </Text>
          {open && !editing && (
            <Pressable onPress={() => setEditing(true)} hitSlop={10} accessibilityRole="button" accessibilityLabel={s('edit')}>
              <Ionicons name="create-outline" size={22} color={colors.text} />
            </Pressable>
          )}
        </View>

        {detailOpen ? (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.detail} keyboardShouldPersistTaps="handled">
              {editing || adding ? (
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  multiline
                  autoFocus
                  placeholder={s('notePlaceholder')}
                  placeholderTextColor={colors.textMuted}
                  style={styles.editor}
                  textAlignVertical="top"
                />
              ) : (
                <Text style={{ lineHeight: 24 }}>{open?.content}</Text>
              )}
            </ScrollView>
            <View style={styles.actions}>
              {editing || adding ? (
                <>
                  <Button label={s('cancel')} variant="outline" onPress={adding ? closeDetail : () => setEditing(false)} style={{ flex: 1 }} />
                  <Button label={s('save')} onPress={save} loading={busy} disabled={!draft.trim()} style={{ flex: 1 }} />
                </>
              ) : (
                <Button label={s('deleteFile')} variant="outline" iconLeft="trash-outline" onPress={remove} loading={busy} fullWidth />
              )}
            </View>
          </KeyboardAvoidingView>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {isLoading && aboutYou.length === 0 && saved.length === 0 ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.huge }} />
            ) : (
              <>
                {error && (
                  <Text variant="small" color="danger">
                    {error.message}
                  </Text>
                )}
                {renderGroup(s('aboutYou'), s('aboutYouHint'), 'person-circle-outline', aboutYou)}
                {renderGroup(s('savedFiles'), s('savedFilesHint'), 'document-text-outline', saved)}
                <Button
                  label={s('addNote')}
                  variant="secondary"
                  iconLeft="add"
                  fullWidth
                  onPress={() => {
                    setAdding(true);
                    setDraft('');
                  }}
                />
              </>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  list: { padding: spacing.lg, gap: spacing.xl },
  group: { gap: spacing.sm },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xs },
  empty: { paddingVertical: spacing.md, paddingHorizontal: spacing.xs },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  detail: { padding: spacing.lg, flexGrow: 1 },
  editor: {
    flex: 1,
    minHeight: 220,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  actions: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
});
