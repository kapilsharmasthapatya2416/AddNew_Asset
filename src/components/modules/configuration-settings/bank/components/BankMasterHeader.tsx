'use client';

import { Landmark } from 'lucide-react';
import TableHeader from '@/components/common/TableHeader';
import { BankFilters } from '../BankFilters';

interface BankMasterHeaderProps {
  t: (key: string) => string;
  onAdd: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  currentState: string;
  onStateChange: (value: string) => void;
  stateOptions: { label: string; value: string }[];
}

export function BankMasterHeader({
  t,
  onAdd,
  search,
  onSearchChange,
  currentState,
  onStateChange,
  stateOptions,
}: BankMasterHeaderProps) {
  return (
    <TableHeader
      title={t('title')}
      subtitle={t('subtitle')}
      icon={Landmark}
      actionLabel={t('addBank')}
      onActionClick={onAdd}
      rightContent={
        <BankFilters
          search={search}
          onSearchChange={onSearchChange}
          currentState={currentState}
          onStateChange={onStateChange}
          stateOptions={stateOptions}
          t={t}
        />
      }
    />
  );
}
