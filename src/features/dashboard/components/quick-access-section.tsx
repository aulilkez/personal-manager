import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { SectionHeader } from '@/components/ui/section-header';
import type { QuickAccessItemData } from '../types/dashboard.types';
import { QuickAccessItem } from './quick-access-item';

export function QuickAccessSection({
  items,
  onItemPress,
}: {
  items: QuickAccessItemData[];
  onItemPress: (item: QuickAccessItemData) => void;
}) {
  return (
    <View>
      <SectionHeader title="Akses Cepat" actionLabel="Edit" actionIcon="edit" />
      <View style={styles.items}>
        {items.map((item) => (
          <QuickAccessItem
            key={item.id}
            item={item}
            onPress={item.href ? () => onItemPress(item) : undefined}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
