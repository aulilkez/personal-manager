import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radii, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { AppIcon, type AppIconName } from './app-icon';

export function SectionHeader({
  title,
  actionLabel,
  actionIcon,
  onActionPress,
}: {
  title: string;
  actionLabel?: string;
  actionIcon?: AppIconName;
  onActionPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: theme.foreground }]}>{title}</Text>
      {actionLabel || actionIcon ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          disabled={!onActionPress}
          onPress={onActionPress}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          {actionLabel ? (
            <Text style={[styles.actionText, { color: theme.mutedForeground }]}>{actionLabel}</Text>
          ) : null}
          {actionIcon ? (
            <AppIcon name={actionIcon} color={theme.mutedForeground} size={18} />
          ) : null}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    ...Typography.heading3,
  },
  action: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
    borderRadius: Radii.sm,
  },
  actionText: {
    ...Typography.body,
  },
  pressed: {
    opacity: 0.7,
  },
});
