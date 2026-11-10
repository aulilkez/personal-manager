import { NativeTabs } from 'expo-router/native-tabs';
import type { AndroidSymbol } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';

export function TabIcon({ android, ios }: { android: AndroidSymbol; ios: SFSymbol }) {
  return <NativeTabs.Trigger.Icon md={android} sf={ios} />;
}
