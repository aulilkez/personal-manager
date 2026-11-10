import type {
  AgendaItemData,
  QuickAccessItemData,
  StreakDayData,
  SummaryCardData,
} from '../types/dashboard.types';

export const dashboardGreeting = {
  name: 'Ulil',
  message: 'Tetap konsisten dengan rencana hari ini.',
  date: 'Sen, 10 Nov 2026',
  focus: 'Fokus: Belajar',
} as const;

export const summaryCards: SummaryCardData[] = [
  {
    id: 'tasks',
    title: 'Tugas selesai',
    value: '8',
    description: 'dari target hari ini',
    trend: '↑ +2 dari kemarin',
    icon: 'tasks',
    accent: 'violet',
  },
  {
    id: 'agenda',
    title: 'Agenda minggu ini',
    value: '12',
    description: 'agenda terjadwal',
    icon: 'calendar',
    accent: 'blue',
    chartBars: [6, 10, 15, 23],
  },
  {
    id: 'finance',
    title: 'Saldo bulan ini',
    value: 'Rp2,45M',
    description: 'dibanding bulan lalu',
    trend: '↑ +12,4%',
    icon: 'finance',
    accent: 'green',
  },
  {
    id: 'goals',
    title: 'Target bulanan',
    value: '75%',
    description: 'progres target',
    icon: 'goals',
    accent: 'amber',
    progress: 0.75,
  },
];

export const todayAgenda: AgendaItemData[] = [
  {
    id: 'budget-review',
    title: 'Review anggaran bulanan',
    time: '09:00 – 09:30',
    completed: true,
  },
  {
    id: 'typescript-learning',
    title: 'Belajar TypeScript',
    time: '14:00 – 16:00',
    completed: false,
  },
  {
    id: 'plan-tomorrow',
    title: 'Rencanakan besok',
    time: '20:00 – 20:30',
    completed: false,
  },
];

export const quickAccessItems: QuickAccessItemData[] = [
  { id: 'calendar', label: 'Kalender', icon: 'calendar', href: '/(tabs)/calendar' },
  { id: 'tasks', label: 'Tugas', icon: 'tasks', href: '/(tabs)/tasks' },
  { id: 'finance', label: 'Keuangan', icon: 'finance', href: '/(tabs)/finance' },
  { id: 'notes', label: 'Catatan', icon: 'notes' },
  { id: 'goals', label: 'Target', icon: 'goals' },
  { id: 'more', label: 'Lainnya', icon: 'more' },
];

export const streakDays: StreakDayData[] = [
  { id: 'kam', label: 'Kam', completed: true },
  { id: 'jum', label: 'Jum', completed: true },
  { id: 'sab', label: 'Sab', completed: true },
  { id: 'min', label: 'Min', completed: false },
  { id: 'sen', label: 'Sen', completed: false },
];
