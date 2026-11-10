import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function BlankScreen({ title }: { title: string }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
          Halaman ini belum tersedia.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  title: {
    ...Typography.heading1,
  },
  subtitle: {
    ...Typography.body,
  },
});
