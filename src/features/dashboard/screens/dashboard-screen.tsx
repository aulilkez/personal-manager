import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  dashboardGreeting,
  quickAccessItems,
  streakDays,
  summaryCards,
  todayAgenda,
} from '../data/dashboard-dummy-data';
import type { QuickAccessItemData } from '../types/dashboard.types';
import { AgendaSection } from '../components/agenda-section';
import { DashboardControls } from '../components/dashboard-controls';
import { DashboardHeader } from '../components/dashboard-header';
import { GreetingSection } from '../components/greeting-section';
import { QuickAccessSection } from '../components/quick-access-section';
import { StreakCard } from '../components/streak-card';
import { SummarySection } from '../components/summary-section';

export function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();

  const navigateToQuickAccess = (item: QuickAccessItemData) => {
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DashboardHeader />
        <GreetingSection name={dashboardGreeting.name} message={dashboardGreeting.message} />
        <DashboardControls date={dashboardGreeting.date} focus={dashboardGreeting.focus} />
        <SummarySection cards={summaryCards} />
        <AgendaSection items={todayAgenda} onSeeAll={() => router.push('/(tabs)/calendar')} />
        <QuickAccessSection items={quickAccessItems} onItemPress={navigateToQuickAccess} />
        <StreakCard
          title="Streak Konsistensi"
          description="3 hari berturut-turut"
          days={streakDays}
        />
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.four,
  },
  bottomSpace: {
    height: Spacing.two,
  },
});
