import { StyleSheet, Text, View } from 'react-native';

import { Radii, Spacing, Typography } from '@/constants/theme';
import { AppIcon } from '@/components/ui/app-icon';
import { useTheme } from '@/hooks/use-theme';

export function DashboardHeader() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View style={[styles.logo, { backgroundColor: theme.surfaceHover }]}>
          <AppIcon name="logo" color={theme.foreground} size={26} />
        </View>
        <View style={styles.brandCopy}>
          <Text style={[styles.title, { color: theme.foreground }]}>Personal Manager</Text>
          <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
            Plan · Focus · Manage · Grow
          </Text>
        </View>
      </View>
      <View style={styles.tools}>
        <View style={styles.iconButton}>
          <AppIcon name="search" color={theme.foreground} size={24} />
        </View>
        <View style={styles.iconButton}>
          <AppIcon name="notifications" color={theme.foreground} size={24} />
          <View style={[styles.notificationDot, { backgroundColor: theme.warning }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minWidth: 0,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCopy: {
    flexShrink: 1,
    gap: Spacing.one,
  },
  title: {
    ...Typography.heading3,
  },
  subtitle: {
    ...Typography.body,
  },
  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconButton: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    top: 5,
    right: 3,
    borderRadius: Radii.full,
  },
});
