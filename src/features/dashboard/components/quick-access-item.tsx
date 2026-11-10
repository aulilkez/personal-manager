import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radii, Spacing, Typography } from '@/constants/theme';
import { AppIcon } from '@/components/ui/app-icon';
import { useTheme } from '@/hooks/use-theme';
import type { QuickAccessItemData } from '../types/dashboard.types';

export function QuickAccessItem({
  item,
  onPress,
}: {
  item: QuickAccessItemData;
  onPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={item.label}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={[styles.tile, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <AppIcon name={item.icon} color={theme.foreground} size={22} />
        <Text numberOfLines={1} style={[styles.label, { color: theme.foreground }]}>
          {item.label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
  },
  tile: {
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.one,
    borderWidth: 1,
    borderRadius: Radii.sm,
  },
  label: {
    ...Typography.caption,
    fontSize: 10,
  },
  pressed: {
    opacity: 0.65,
  },
});
