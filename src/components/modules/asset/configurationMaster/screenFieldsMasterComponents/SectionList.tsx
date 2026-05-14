'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Layers, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Tooltip } from '@/components/common';
import { Badge } from '@/components/common/Badge';
import { Card, CardContent, CardHeader } from '@/components/common/Card';
import type { SectionGroup, SectionListProps, ScreenSection, SectionListShellProps } from '@/types/asset.types';

export function SectionList({
  sections,
  selectedSectionId,
  onSectionSelect,
  onAddSection,
  screenName,
}: SectionListProps) {
  const groupedSections = [...sections]
    .sort((a, b) => a.order - b.order)
    .reduce<SectionGroup[]>((groups, section) => {
      const groupLabel = section.label;
      const existingGroup = groups.find((group) => group.groupLabel === groupLabel);

      if (existingGroup) {
        existingGroup.sections.push(section);
        existingGroup.fieldsCount += section.fields.length;
        existingGroup.firstOrder = Math.min(existingGroup.firstOrder, section.order);
        return groups;
      }

      groups.push({
        groupLabel,
        sections: [section],
        fieldsCount: section.fields.length,
        firstOrder: section.order,
      });

      return groups;
    }, [])
    .sort((a, b) => a.firstOrder - b.firstOrder);

  return (
    <Card className="h-full flex flex-col border border-gray-200 overflow-hidden ">
      <div className="-mt-6 -mx-[24px]">
        <CardHeader className="bg-slate-900 px-5 py-3 border border-slate-700 shadow-md ">
          <div className="flex items-center gap-3 text-sm font-semibold text-white">
            <Layers className="w-4 h-4" />
            <span>Sections</span>
          </div>
        </CardHeader>
      </div>

      {screenName && (
        <div className="px-4 py-2 -mt-4 -mx-[24px] mb-2 bg-blue-50 border-b border-blue-200">
          <p className="text-xs text-blue-700 font-medium truncate">{screenName}</p>
        </div>
      )}

      <CardContent className="p-0 space-y-1.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] -mx-3 px-3">
        {groupedSections.map((group, index) => {
          const primarySection = group.sections[0];
          const isActive = group.sections.some((section) => section.id === selectedSectionId);
          const variantCount = group.sections.length;
          const descriptions = group.sections
            .map((section) => section.description)
            .filter(Boolean)
            .join(' • ');
          const tooltipContent = (
            <div className="space-y-1 text-left text-xs text-white">
              <p className="font-semibold">{group.groupLabel}</p>
              {primarySection.description && (
                <p className="text-[11px] text-white/80 leading-snug line-clamp-2">
                  {primarySection.description}
                </p>
              )}
              <p className="text-[10px] text-white/70 tracking-wide">
                {variantCount} variant{variantCount !== 1 ? 's' : ''} • {group.fieldsCount} fields
              </p>
              {primarySection.isCollapsible && (
                <p className="text-[10px] text-white/70">Collapsible</p>
              )}
              {variantCount > 1 && descriptions && (
                <p className="text-[10px] text-white/70 line-clamp-2">
                  Variants: {descriptions}
                </p>
              )}
            </div>
          );

          return (
            <Tooltip
              key={`${group.groupLabel}-${primarySection.id}`}
              content={tooltipContent}
              placement="right"
            >
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ x: 3 }}
                onClick={() => onSectionSelect(primarySection.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >


                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-white/20' : 'bg-purple-600'
                  }`}
                >
                  <span className="text-white text-xs font-bold">
                    {primarySection.order}
                  </span>
                </div>

                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p
                      className={`font-semibold text-xs truncate ${
                        isActive ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {group.groupLabel}
                    </p>
                    {primarySection.isActive ? (
                      <CheckCircle className={`w-3 h-3 flex-shrink-0 ${isActive ? 'text-green-300' : 'text-green-600'}`} />
                    ) : (
                      <XCircle className={`w-3 h-3 flex-shrink-0 ${isActive ? 'text-red-300' : 'text-red-600'}`} />
                    )}
                  </div>
                  {primarySection.description && (
                    <p
                      className={`text-[10px] mb-1 line-clamp-1 ${
                        isActive ? 'text-purple-100' : 'text-gray-500'
                      }`}
                    >
                      {variantCount > 1
                        ? `${primarySection.description} + ${variantCount - 1} more variants`
                        : primarySection.description}
                    </p>
                  )}
                  {variantCount > 1 && descriptions && (
                    <p
                      className={`text-[10px] mb-1 line-clamp-2 ${
                        isActive ? 'text-purple-100/90' : 'text-gray-500'
                      }`}
                    >
                      Variants: {descriptions}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-[10px]">
                    <Badge
                      size="sm"
                      variant="default"
                      className={
                        isActive
                          ? 'bg-white/20 text-white border-white/20'
                          : 'bg-purple-100 text-purple-700 border-purple-200'
                      }
                    >
                      {group.fieldsCount} fields
                    </Badge>
                    {primarySection.isCollapsible && (
                      <Badge
                        size="sm"
                        variant="outline"
                        className={
                          isActive
                            ? 'bg-white/10 text-white border-white/20'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }
                      >
                        Collapsible
                      </Badge>
                    )}
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}
                />
              </motion.button>
            </Tooltip>
          );
        })}

        {groupedSections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No sections yet</p>
            <button
              onClick={onAddSection}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Add first section
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export function SectionListWithSelection({
  sections,
  screenName,
}: SectionListShellProps) {
  const defaultSectionId = useMemo(() => sections[0]?.id ?? null, [sections]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(defaultSectionId);

  useEffect(() => {
    setSelectedSectionId(defaultSectionId);
  }, [defaultSectionId]);

  const handleSectionSelect = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
  }, []);

  const handleAddSection = useCallback(() => {
    if (typeof window !== 'undefined') {
      alert('Section management will be available in the next phase.');
    }
  }, []);

  return (
    <SectionList
      sections={sections}
      selectedSectionId={selectedSectionId}
      onSectionSelect={handleSectionSelect}
      onAddSection={handleAddSection}
      screenName={screenName}
    />
  );
}
