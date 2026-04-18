'use client';

import { Tabs, type TabItem, TableHeader } from '@/components/common';
import { Lock, Layers, Hammer, Users, Calendar } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface WeightageMasterHeaderProps {
  locale: string;
  title: string;
  subtitle: string;
  labels: {
    floor: string;
    nature: string;
    subType: string;
    age: string;
  };
}

export function WeightageMasterHeader({ locale, title, subtitle, labels }: WeightageMasterHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const base = `/${locale}/property-tax/weightage-master`;

  const activeTab =
    pathname.includes('/nature-weightage')
      ? 'nature'
      : pathname.includes('/sub-type-weightage')
        ? 'subType'
        : pathname.includes('/age-weightage')
          ? 'age'
          : pathname.endsWith('/weightage-master')
            ? 'floor'
            : 'floor';

  const tabs: TabItem[] = [
    { value: 'floor', label: labels.floor, icon: Layers, content: null },
    { value: 'nature', label: labels.nature, icon: Hammer, content: null },
    { value: 'subType', label: labels.subType, icon: Users, content: null },
    { value: 'age', label: labels.age, icon: Calendar, content: null },
  ];

  return (
    <TableHeader
      title={title}
      subtitle={subtitle}
      icon={Lock}
      rightContent={
        <Tabs
          value={activeTab}
          variant="pills"
          items={tabs}
          onChange={(v) => {
            if (v === 'floor') {
              router.push(`${base}`);
            } else {
              router.push(`${base}/${v === 'subType' ? 'sub-type' : v}-weightage`);
            }
          }}
        />
      }
    />
  );
}
