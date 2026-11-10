import { StyleSheet, Text, View } from 'react-native';

import { Radii, Spacing, Typography } from '@/constants/theme';
import { AppIcon } from '@/components/ui/app-icon';
import { useTheme } from '@/hooks/use-theme';

export function DashboardControls({ date, focus }: { date: string; focus: string }) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.control,
          styles.dateControl,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <AppIcon name="calendar" color={theme.foreground} size={19} />
        <Text numberOfLines={1} style={[styles.label, { color: theme.foreground }]}>
          {date}
        </Text>
        <Text style={[styles.chevron, { color: theme.mutedForeground }]}>⌄</Text>
      </View>
      <View
        style={[
          styles.control,
          styles.focusControl,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <AppIcon name="focus" color={theme.mutedForeground} size={19} />
        <Text numberOfLines={1} style={[styles.label, { color: theme.mutedForeground }]}>
          {focus}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: Spacing.five,
  },
  control: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: Radii.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  dateControl: {
    flex: 1,
  },
  focusControl: {
    maxWidth: '46%',
  },
  label: {
    ...Typography.bodyMedium,
    flexShrink: 1,
  },
  chevron: {
    fontSize: 20,
  },
});
