'use client';

import { useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FieldList } from './FieldList';
import type { FieldListShellProps } from '@/types/asset.types';

function notifyAction(action: string) {
  if (typeof window !== 'undefined') {
    alert(`${action} should be performed from the Screen Fields Master UI.`);
  }
}

export function FieldListShell({ sections, sectionName, screenId }: FieldListShellProps) {
  const router = useRouter();
  const params = useParams();
  const activeSection = sections[0];
  const fields = activeSection?.fields || [];
  const groupedFieldCount = fields.length;
  const variantCount = sections.length;
  const localePrefix = params?.locale ? `/${params.locale}` : '';
  const fieldFormBase = `${localePrefix}/asset/configuration/field-form`;

  const handleAddField = useCallback(() => {
    if (!screenId || !activeSection?.id) {
      notifyAction('Adding a field');
      return;
    }
    const search = new URLSearchParams({
      screenId,
      sectionId: activeSection.id,
    });
    router.push(`${fieldFormBase}?${search.toString()}`);
  }, [router, fieldFormBase, screenId, activeSection]);

  const handleEditField = () => notifyAction('Editing a field');
  const handleDeleteField = () => notifyAction('Deleting a field');
  const handleToggleFieldStatus = () => notifyAction('Toggling field status');
  const handleReorderField = () => notifyAction('Reordering fields');
  const handleManageData = () => notifyAction('Managing field data');

  return (
    <FieldList
      fields={fields}
      groupedFieldCount={groupedFieldCount}
      variantCount={variantCount}
      onAddField={handleAddField}
      onEditField={handleEditField}
      onDeleteField={handleDeleteField}
      onToggleFieldStatus={handleToggleFieldStatus}
      onReorderField={handleReorderField}
      onManageData={handleManageData}
      sectionName={sectionName}
    />
  );
}
