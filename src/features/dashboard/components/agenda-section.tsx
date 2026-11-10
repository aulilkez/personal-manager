import { View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { AppCard } from '@/components/ui/app-card';
import { SectionHeader } from '@/components/ui/section-header';
import type { AgendaItemData } from '../types/dashboard.types';
import { AgendaItem } from './agenda-item';

export function AgendaSection({
  items,
  onSeeAll,
}: {
  items: AgendaItemData[];
  onSeeAll: () => void;
}) {
  return (
    <View>
      <SectionHeader
        title="Agenda Hari Ini"
        actionLabel="Lihat semua"
        actionIcon="arrowRight"
        onActionPress={onSeeAll}
      />
      <AppCard style={{ marginTop: Spacing.two, overflow: 'hidden' }}>
        {items.map((item, index) => (
          <AgendaItem key={item.id} item={item} isLast={index === items.length - 1} />
        ))}
      </AppCard>
    </View>
  );
}
