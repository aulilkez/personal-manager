import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        styles[type],
        type === 'linkPrimary' && { color: theme.info },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: Typography.caption,
  smallBold: Typography.label,
  default: Typography.body,
  title: Typography.display,
  subtitle: Typography.heading2,
  link: Typography.body,
  linkPrimary: Typography.body,
  code: {
    ...Typography.caption,
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
  },
});
