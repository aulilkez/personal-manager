import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

export type AppIconName =
  | 'logo'
  | 'search'
  | 'notifications'
  | 'calendar'
  | 'focus'
  | 'tasks'
  | 'finance'
  | 'notes'
  | 'goals'
  | 'more'
  | 'clock'
  | 'moreVertical'
  | 'arrowRight'
  | 'flame'
  | 'edit';

const iconNames = {
  logo: { ios: 'square.stack.3d.up', android: 'layers', web: 'layers' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  notifications: { ios: 'bell', android: 'notifications', web: 'notifications' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  focus: { ios: 'scope', android: 'track_changes', web: 'track_changes' },
  tasks: { ios: 'checkmark.square', android: 'check_box', web: 'check_box' },
  finance: {
    ios: 'wallet.pass',
    android: 'account_balance_wallet',
    web: 'account_balance_wallet',
  },
  notes: { ios: 'note.text', android: 'edit_note', web: 'edit_note' },
  goals: { ios: 'scope', android: 'track_changes', web: 'track_changes' },
  more: { ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  moreVertical: { ios: 'ellipsis', android: 'more_vert', web: 'more_vert' },
  arrowRight: { ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' },
  flame: { ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' },
  edit: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' },
} as const satisfies Record<AppIconName, SymbolViewProps['name']>;

export function AppIcon({
  name,
  color,
  size = 22,
  style,
}: {
  name: AppIconName;
  color: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <SymbolView
      accessibilityElementsHidden
      name={iconNames[name]}
      size={size}
      tintColor={color}
      style={[styles.icon, style]}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
