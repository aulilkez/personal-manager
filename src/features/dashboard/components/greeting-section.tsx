import { StyleSheet, Text, View } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function GreetingSection({ name, message }: { name: string; message: string }) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.greeting, { color: theme.foreground }]}>Selamat malam, {name} 👋</Text>
      <Text style={[styles.message, { color: theme.mutedForeground }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
    paddingTop: Spacing.five,
  },
  greeting: {
    ...Typography.heading1,
  },
  message: {
    ...Typography.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
  },
});
