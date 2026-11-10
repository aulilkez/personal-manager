import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radii, Spacing, Typography } from '@/constants/theme';
import { AppIcon } from '@/components/ui/app-icon';
import { useTheme } from '@/hooks/use-theme';
import type { AgendaItemData } from '../types/dashboard.types';

export function AgendaItem({ item, isLast }: { item: AgendaItemData; isLast: boolean }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: item.completed ? theme.accentViolet : 'transparent',
            borderColor: item.completed ? theme.accentViolet : theme.mutedForeground,
          },
        ]}
      >
        {item.completed ? <Text style={[styles.check, { color: theme.background }]}>✓</Text> : null}
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.foreground }]}>
          {item.title}
        </Text>
        <View style={styles.timeRow}>
          <AppIcon name="clock" color={theme.mutedForeground} size={14} />
          <Text style={[styles.time, { color: theme.mutedForeground }]}>{item.time}</Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel={`More options for ${item.title}`}
        accessibilityRole="button"
        disabled
        style={styles.more}
      >
        <AppIcon name="moreVertical" color={theme.mutedForeground} size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radii.xs,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    ...Typography.bodyMedium,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  time: {
    ...Typography.label,
  },
  more: {
    width: 32,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
