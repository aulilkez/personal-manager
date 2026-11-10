import { StyleSheet, Text, View } from 'react-native';

import { Radii, Spacing, Typography } from '@/constants/theme';
import { AppIcon } from '@/components/ui/app-icon';
import { useTheme } from '@/hooks/use-theme';
import type { DashboardAccent, SummaryCardData } from '../types/dashboard.types';

const accentToken: Record<DashboardAccent, 'accentViolet' | 'info' | 'success' | 'warning'> = {
  violet: 'accentViolet',
  blue: 'info',
  green: 'success',
  amber: 'warning',
};

const surfaceToken: Record<
  DashboardAccent,
  'violetSurface' | 'blueSurface' | 'greenSurface' | 'amberSurface'
> = {
  violet: 'violetSurface',
  blue: 'blueSurface',
  green: 'greenSurface',
  amber: 'amberSurface',
};

export function SummaryCard({ card }: { card: SummaryCardData }) {
  const theme = useTheme();
  const accent = theme[accentToken[card.accent]];
  const surface = theme[surfaceToken[card.accent]];

  return (
    <View style={[styles.card, { backgroundColor: surface, borderColor: accent }]}>
      <View style={[styles.iconBox, { backgroundColor: accent }]}>
        <AppIcon
          name={card.icon}
          color={card.accent === 'amber' ? theme.background : theme.foreground}
          size={18}
        />
      </View>
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.75}
        numberOfLines={1}
        style={[styles.value, { color: theme.foreground }]}
      >
        {card.value}
      </Text>
      <Text style={[styles.title, { color: theme.mutedForeground }]}>{card.title}</Text>
      {card.trend ? (
        <Text style={[styles.trend, { color: accent }]}>{card.trend}</Text>
      ) : card.progress !== undefined ? (
        <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${card.progress * 100}%`, backgroundColor: accent },
            ]}
          />
        </View>
      ) : card.chartBars ? (
        <View style={styles.chart}>
          {card.chartBars.map((height, index) => (
            <View
              key={`${card.id}-${index}`}
              style={[
                styles.bar,
                { height, backgroundColor: accent, opacity: 0.45 + index * 0.15 },
              ]}
            />
          ))}
        </View>
      ) : (
        <Text numberOfLines={1} style={[styles.description, { color: theme.subtleForeground }]}>
          {card.description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    minHeight: 148,
    borderWidth: 1,
    borderRadius: Radii.md,
    padding: Spacing.two,
    overflow: 'hidden',
    gap: Spacing.one,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...Typography.heading2,
    fontSize: 20,
    lineHeight: 25,
    marginTop: Spacing.one,
  },
  title: {
    ...Typography.caption,
    minHeight: 30,
  },
  trend: {
    ...Typography.caption,
    fontSize: 10,
    lineHeight: 14,
  },
  description: {
    ...Typography.caption,
    fontSize: 10,
    lineHeight: 14,
  },
  progressTrack: {
    height: 9,
    borderRadius: Radii.full,
    overflow: 'hidden',
    marginTop: Spacing.one,
  },
  progressFill: {
    height: '100%',
    borderRadius: Radii.full,
  },
  chart: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: Spacing.one,
  },
  bar: {
    width: 7,
    borderTopLeftRadius: Radii.xs,
    borderTopRightRadius: Radii.xs,
  },
});
