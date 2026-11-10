import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createDatabaseClient } from '@/core/database/client';
import { Radii, Spacing, Typography } from '@/constants/theme';
import { createFeatureLogger } from '@/core/logging';
import { useTheme } from '@/hooks/use-theme';
import {
  taskInputSchema,
  taskStatusSchema,
  type Task,
  type TaskStatus,
} from '@/modules/tasks/domain/task';
import { createTasksRepository } from '@/modules/tasks/data/tasks-repository';

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  completed: 'Completed',
};

interface TaskFormState {
  title: string;
  description: string;
  status: TaskStatus;
}

const EMPTY_FORM: TaskFormState = {
  title: '',
  description: '',
  status: 'todo',
};
const log = createFeatureLogger('tasks');

export default function TasksScreen() {
  const theme = useTheme();
  const connection = useSQLiteContext();
  const repository = useMemo(
    () => createTasksRepository(createDatabaseClient(connection)),
    [connection],
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState<TaskFormState>(EMPTY_FORM);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const refreshTasks = useCallback(async (query: string) => repository.list(query), [repository]);

  useEffect(() => {
    let active = true;

    refreshTasks(search)
      .then((result) => {
        if (active) {
          setTasks(result);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        log.error('Failed to load tasks.');
        if (active) {
          setError('Unable to load tasks. Please try again.');
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [refreshTasks, search]);

  const openNewTask = () => {
    setEditingTask(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setError(null);
    setIsFormVisible(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setFormError(null);
    setError(null);
    setIsFormVisible(true);
  };

  const saveTask = async () => {
    const result = taskInputSchema.safeParse(form);
    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? 'Check the task details and try again.');
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      if (editingTask) {
        await repository.update(editingTask.id, result.data);
      } else {
        await repository.create(result.data);
      }

      setEditingTask(null);
      setIsFormVisible(false);
      setForm(EMPTY_FORM);
      setSearch('');
      setError(null);
      setTasks(await refreshTasks(''));
    } catch {
      log.error('Failed to save task.');
      setFormError('Unable to save the task. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTask = async (task: Task) => {
    setError(null);
    try {
      await repository.setStatus(task.id, task.status === 'completed' ? 'todo' : 'completed');
      setTasks(await refreshTasks(search));
    } catch {
      log.error('Failed to update task status.');
      setError('Unable to update the task. Please try again.');
    }
  };

  const confirmDelete = async () => {
    if (!deletingTask) return;

    setError(null);
    try {
      await repository.delete(deletingTask.id);
      setDeletingTask(null);
      setTasks(await refreshTasks(search));
    } catch {
      log.error('Failed to delete task.');
      setError('Unable to delete the task. Please try again.');
    }
  };

  const completedCount = tasks.filter((task) => task.status === 'completed').length;
  const statusColor = (status: TaskStatus) =>
    status === 'completed'
      ? theme.success
      : status === 'in_progress'
        ? theme.info
        : theme.subtleForeground;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: theme.mutedForeground }]}>PERSONAL MANAGER</Text>
            <Text style={[styles.heading, { color: theme.foreground }]}>Tasks</Text>
            <Text style={[styles.summary, { color: theme.mutedForeground }]}>
              {completedCount} of {tasks.length} completed
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add task"
            onPress={openNewTask}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={[styles.addButtonText, { color: theme.primaryForeground }]}>
              + Add task
            </Text>
          </Pressable>
        </View>

        <TextInput
          accessibilityLabel="Search tasks"
          value={search}
          onChangeText={setSearch}
          placeholder="Search tasks"
          placeholderTextColor={theme.subtleForeground}
          returnKeyType="search"
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.foreground,
            },
          ]}
        />

        {error ? (
          <Text accessibilityRole="alert" style={[styles.errorText, { color: theme.danger }]}>
            {error}
          </Text>
        ) : null}

        {isLoading ? (
          <ActivityIndicator color={theme.info} style={styles.loader} />
        ) : tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.foreground }]}>
              {search.trim() ? 'No matching tasks' : 'No tasks yet'}
            </Text>
            <Text style={[styles.summary, { color: theme.mutedForeground }]}>
              {search.trim() ? 'Try another search.' : 'Add a task to start organizing your day.'}
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.taskList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {tasks.map((task) => (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: task.status === 'completed' }}
                  accessibilityLabel={`Mark ${task.title} ${task.status === 'completed' ? 'incomplete' : 'complete'}`}
                  onPress={() => void toggleTask(task)}
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: task.status === 'completed' ? theme.success : 'transparent',
                      borderColor: task.status === 'completed' ? theme.success : theme.border,
                    },
                  ]}
                >
                  {task.status === 'completed' ? (
                    <Text style={[styles.checkmark, { color: theme.background }]}>✓</Text>
                  ) : null}
                </Pressable>
                <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.taskTitle,
                      {
                        color:
                          task.status === 'completed' ? theme.mutedForeground : theme.foreground,
                        textDecorationLine: task.status === 'completed' ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {task.title}
                  </Text>
                  {task.description ? (
                    <Text style={[styles.description, { color: theme.mutedForeground }]}>
                      {task.description}
                    </Text>
                  ) : null}
                  <Text style={[styles.status, { color: statusColor(task.status) }]}>
                    {STATUS_LABELS[task.status]}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${task.title}`}
                    onPress={() => openEditTask(task)}
                    hitSlop={8}
                    style={styles.actionButton}
                  >
                    <Text style={[styles.actionText, { color: theme.info }]}>Edit</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${task.title}`}
                    onPress={() => setDeletingTask(task)}
                    hitSlop={8}
                    style={styles.actionButton}
                  >
                    <Text style={[styles.actionText, { color: theme.danger }]}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsFormVisible(false)}
        transparent
        visible={isFormVisible}
      >
        <TaskFormModal
          editing={editingTask !== null}
          form={form}
          error={formError}
          isSaving={isSaving}
          onChange={setForm}
          onClose={() => {
            setEditingTask(null);
            setIsFormVisible(false);
            setFormError(null);
          }}
          onSave={() => void saveTask()}
          theme={theme}
        />
      </Modal>

      <Modal
        animationType="fade"
        onRequestClose={() => setDeletingTask(null)}
        transparent
        visible={deletingTask !== null}
      >
        <View style={styles.modalRoot}>
          <View style={[styles.scrim, { backgroundColor: theme.foreground }]} />
          <View
            style={[
              styles.confirmCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.foreground }]}>Delete task?</Text>
            <Text style={[styles.description, { color: theme.mutedForeground }]}>
              This will permanently remove “{deletingTask?.title}”.
            </Text>
            {error ? (
              <Text accessibilityRole="alert" style={[styles.errorText, { color: theme.danger }]}>
                {error}
              </Text>
            ) : null}
            <View style={styles.modalActions}>
              <Pressable onPress={() => setDeletingTask(null)} style={styles.modalButton}>
                <Text style={[styles.actionText, { color: theme.foreground }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => void confirmDelete()} style={styles.modalButton}>
                <Text style={[styles.actionText, { color: theme.danger }]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function TaskFormModal({
  editing,
  form,
  error,
  isSaving,
  onChange,
  onClose,
  onSave,
  theme,
}: {
  editing: boolean;
  form: TaskFormState;
  error: string | null;
  isSaving: boolean;
  onChange: (form: TaskFormState) => void;
  onClose: () => void;
  onSave: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.modalRoot}
    >
      <View style={[styles.scrim, { backgroundColor: theme.foreground }]} />
      <ScrollView
        contentContainerStyle={styles.modalScrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <Text style={[styles.modalTitle, { color: theme.foreground }]}>
            {editing ? 'Edit task' : 'New task'}
          </Text>
          <TextInput
            accessibilityLabel="Task title"
            autoFocus
            maxLength={120}
            onChangeText={(title) => onChange({ ...form, title })}
            placeholder="Task title"
            placeholderTextColor={theme.subtleForeground}
            returnKeyType="next"
            value={form.title}
            style={[
              styles.formInput,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.foreground,
              },
            ]}
          />
          <TextInput
            accessibilityLabel="Task details"
            maxLength={500}
            multiline
            onChangeText={(description) => onChange({ ...form, description })}
            placeholder="Details (optional)"
            placeholderTextColor={theme.subtleForeground}
            textAlignVertical="top"
            value={form.description}
            style={[
              styles.formInput,
              styles.descriptionInput,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.foreground,
              },
            ]}
          />
          <View style={styles.statusOptions}>
            {taskStatusSchema.options.map((status) => {
              const selected = form.status === status;
              return (
                <Pressable
                  key={status}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  onPress={() => onChange({ ...form, status })}
                  style={[
                    styles.statusOption,
                    {
                      backgroundColor: selected ? theme.muted : theme.surface,
                      borderColor: selected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.actionText,
                      { color: selected ? theme.foreground : theme.mutedForeground },
                    ]}
                  >
                    {STATUS_LABELS[status]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {error ? (
            <Text accessibilityRole="alert" style={[styles.errorText, { color: theme.danger }]}>
              {error}
            </Text>
          ) : null}
          <View style={styles.modalActions}>
            <Pressable disabled={isSaving} onPress={onClose} style={styles.modalButton}>
              <Text style={[styles.actionText, { color: theme.mutedForeground }]}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={isSaving}
              onPress={onSave}
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
            >
              {isSaving ? (
                <ActivityIndicator color={theme.primaryForeground} />
              ) : (
                <Text style={[styles.actionText, { color: theme.primaryForeground }]}>
                  {editing ? 'Save changes' : 'Add task'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Platform.OS === 'web' ? Spacing.ten + Spacing.six : Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  eyebrow: {
    ...Typography.label,
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  heading: {
    ...Typography.heading1,
  },
  summary: {
    ...Typography.body,
    marginTop: Spacing.one,
  },
  addButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radii.md,
  },
  addButtonText: {
    ...Typography.bodyMedium,
  },
  searchInput: {
    ...Typography.body,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  loader: {
    marginTop: Spacing.ten,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.ten,
    gap: Spacing.one,
  },
  emptyTitle: {
    ...Typography.heading3,
  },
  taskList: {
    gap: Spacing.two,
    paddingBottom: Spacing.ten,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: Radii.md,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkmark: {
    fontSize: 13,
    fontWeight: '700',
  },
  taskContent: {
    flex: 1,
    gap: Spacing.one,
  },
  taskTitle: {
    ...Typography.bodyMedium,
  },
  description: {
    ...Typography.body,
  },
  status: {
    ...Typography.caption,
  },
  actions: {
    gap: Spacing.one,
  },
  actionButton: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: Spacing.one,
  },
  actionText: {
    ...Typography.bodyMedium,
  },
  modalRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    opacity: 0.45,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  formCard: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: Radii.md,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderRadius: Radii.md,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  modalTitle: {
    ...Typography.heading2,
  },
  formInput: {
    ...Typography.body,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.three,
  },
  descriptionInput: {
    minHeight: 96,
    paddingTop: Spacing.two,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  statusOption: {
    minHeight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.two,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  modalButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  saveButton: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.three,
  },
  errorText: {
    ...Typography.body,
  },
});
