import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/app-card';
import { AppIcon } from '@/components/ui/app-icon';
import { Radii, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { StreakDayData } from '../types/dashboard.types';

export function StreakCard({
  title,
  description,
  days,
}: {
  title: string;
  description: string;
  days: StreakDayData[];
}) {
  const theme = useTheme();

  return (
    <AppCard style={styles.card}>
      <View style={styles.streakCopy}>
        <View style={[styles.flame, { backgroundColor: theme.surfaceHover }]}>
          <AppIcon name="flame" color={theme.foreground} size={28} />
        </View>
        <View style={styles.copy}>
          <Text numberOfLines={1} style={[styles.title, { color: theme.foreground }]}>
            {title}
          </Text>
          <Text style={[styles.description, { color: theme.mutedForeground }]}>{description}</Text>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.days}>
        {days.map((day) => (
          <View key={day.id} style={styles.day}>
            <View
              style={[
                styles.dayBox,
                {
                  backgroundColor: day.completed ? theme.accentViolet : 'transparent',
                  borderColor: day.completed ? theme.accentViolet : theme.mutedForeground,
                },
              ]}
            >
              {day.completed ? (
                <Text style={[styles.check, { color: theme.background }]}>✓</Text>
              ) : null}
            </View>
            <Text style={[styles.dayLabel, { color: theme.mutedForeground }]}>{day.label}</Text>
          </View>
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  streakCopy: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flame: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
  },
  title: {
    ...Typography.bodyMedium,
  },
  description: {
    ...Typography.body,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 46,
  },
  days: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  day: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  dayBox: {
    width: 20,
    height: 20,
    borderRadius: Radii.xs,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  dayLabel: {
    ...Typography.caption,
    fontSize: 10,
  },
});
