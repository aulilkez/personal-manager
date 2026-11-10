import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { SummaryCardData } from '../types/dashboard.types';
import { SummaryCard } from './summary-card';

export function SummarySection({ cards }: { cards: SummaryCardData[] }) {
  return (
    <View style={styles.grid}>
      {cards.map((card) => (
        <SummaryCard key={card.id} card={card} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
