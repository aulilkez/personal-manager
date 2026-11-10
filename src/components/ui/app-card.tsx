import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Radii } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function AppCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: Radii.md,
          borderWidth: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
