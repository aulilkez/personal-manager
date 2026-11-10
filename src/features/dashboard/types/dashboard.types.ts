import type { AppIconName } from '@/components/ui/app-icon';

export type DashboardAccent = 'violet' | 'blue' | 'green' | 'amber';
export type DashboardRoute = '/(tabs)/calendar' | '/(tabs)/tasks' | '/(tabs)/finance';

export interface SummaryCardData {
  id: string;
  title: string;
  value: string;
  description: string;
  trend?: string;
  icon: AppIconName;
  accent: DashboardAccent;
  progress?: number;
  chartBars?: number[];
}

export interface AgendaItemData {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export interface QuickAccessItemData {
  id: string;
  label: string;
  icon: AppIconName;
  href?: DashboardRoute;
}

export interface StreakDayData {
  id: string;
  label: string;
  completed: boolean;
}
