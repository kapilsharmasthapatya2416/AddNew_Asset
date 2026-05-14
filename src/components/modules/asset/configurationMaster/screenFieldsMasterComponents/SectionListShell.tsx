'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { SectionList } from './SectionList';
import type { SectionListShellProps, ScreenSection } from '@/types/asset.types';

export function SectionListShell({ initialSections, screenName }: SectionListShellProps) {
  const defaultSectionId = useMemo(() => initialSections[0]?.id ?? null, [initialSections]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(defaultSectionId);

  useEffect(() => {
    setSelectedSectionId(defaultSectionId);
  }, [defaultSectionId]);

  const handleSectionSelect = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
  }, []);

  const handleAddSection = useCallback(() => {
    alert('Section management will be available in the next phase.');
  }, []);

  return (
    <SectionList
      sections={initialSections}
      selectedSectionId={selectedSectionId}
      onSectionSelect={handleSectionSelect}
      onAddSection={handleAddSection}
      screenName={screenName}
    />
  );
}
