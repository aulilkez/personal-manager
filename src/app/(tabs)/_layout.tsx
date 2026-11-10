import { NativeTabs } from 'expo-router/native-tabs';
import { useTheme } from '@/hooks/use-theme';

import { TabIcon } from '@/components/navigation/tab-icon';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.surface}
      disableTransparentOnScrollEdge
      iconColor={{ default: theme.mutedForeground, selected: theme.foreground }}
      indicatorColor={theme.surfaceHover}
      labelStyle={{
        default: { color: theme.mutedForeground },
        selected: { color: theme.foreground },
      }}
      labelVisibilityMode="labeled"
      rippleColor={theme.surfaceHover}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Beranda</NativeTabs.Trigger.Label>
        <TabIcon android="home" ios="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Label>Kalender</NativeTabs.Trigger.Label>
        <TabIcon android="calendar_month" ios="calendar" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tasks">
        <NativeTabs.Trigger.Label>Tugas</NativeTabs.Trigger.Label>
        <TabIcon android="check_box" ios="checkmark.square" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="finance">
        <NativeTabs.Trigger.Label>Keuangan</NativeTabs.Trigger.Label>
        <TabIcon android="account_balance_wallet" ios="wallet.pass" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profil</NativeTabs.Trigger.Label>
        <TabIcon android="person" ios="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
