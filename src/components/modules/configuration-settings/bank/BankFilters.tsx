'use client';

import { SearchInput } from '@/components/common/SearchInput';
import { SearchSelect } from '@/components/common/SearchSelect';

interface BankFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  currentState: string;
  onStateChange: (value: string) => void;
  stateOptions: { label: string; value: string }[];
  t: (key: string) => string;
}

export function BankFilters({
  search,
  onSearchChange,
  currentState,
  onStateChange,
  stateOptions,
  t,
}: BankFiltersProps) {
  return (
    <div className="flex w-full items-center gap-3 justify-end">
      <div className="w-64">
        <SearchSelect
          name="stateFilter"
          options={stateOptions}
          value={currentState}
          onChange={(_name, value) => onStateChange(value)}
          placeholder={t('filters.statePlaceholder')}
          className="mb-0"
        />
      </div>

      <div className="w-72">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={t('filters.searchPlaceholder')}
          className="mb-0 w-full text-gray-900"
        />
      </div>
    </div>
  );
}
