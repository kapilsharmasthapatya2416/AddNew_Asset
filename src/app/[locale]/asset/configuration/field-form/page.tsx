'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { FieldFormModal } from '@/components/modules/asset/configurationMaster/screenFieldsMasterComponents/FieldFormModal';
import { useConfigurationMasterState } from '@/components/modules/asset/configurationMaster/ConfigurationMasterContext';
import {
  loadAllScreenConfigs,
  saveAllScreenConfigs,
} from '@/lib/utils/screenConfigStorage';
import type { ScreenConfig, ScreenField } from '@/types/asset.types';

const selectableFieldTypes = new Set(['dropdown', 'select', 'radio', 'multiselect']);

export default function FieldFormPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const screenIdParam = searchParams.get('screenId');
  const sectionIdParam = searchParams.get('sectionId');
  const fieldIdParam = searchParams.get('fieldId');

  const { ensureLinkedFieldMaster } = useConfigurationMasterState();

  const [screenConfigs, setScreenConfigs] = useState<ScreenConfig[]>([]);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  useEffect(() => {
    const configs = loadAllScreenConfigs();
    setScreenConfigs(configs);
  }, []);

  useEffect(() => {
    if (screenConfigs.length === 0) {
      return;
    }

    const resolvedScreen =
      screenConfigs.find((screen) => screen.id === screenIdParam) || screenConfigs[0];
    setSelectedScreenId(resolvedScreen.id);

    const resolvedSection =
      resolvedScreen.sections.find((section) => section.id === sectionIdParam) ||
      resolvedScreen.sections[0] ||
      null;
    setSelectedSectionId(resolvedSection?.id || null);
  }, [screenConfigs, screenIdParam, sectionIdParam]);

  const selectedScreen = screenConfigs.find((screen) => screen.id === selectedScreenId) || null;
  const selectedSection =
    selectedScreen?.sections.find((section) => section.id === selectedSectionId) || null;

  const findFieldById = (id: string | null) => {
    if (!id) return null;
    for (const screen of screenConfigs) {
      for (const section of screen.sections) {
        const field = section.fields.find((f) => f.id === id);
        if (field) {
          return field;
        }
      }
    }
    return null;
  };

  const existingField = useMemo(() => findFieldById(fieldIdParam), [fieldIdParam, screenConfigs]);

  const availableFields = useMemo(() => selectedSection?.fields || [], [selectedSection]);
  const maxFieldOrder = useMemo(() => {
    if (!selectedSection) return 0;
    return Math.max(...selectedSection.fields.map((field) => field.order), 0);
  }, [selectedSection]);

  const basePath = params?.locale ? `/${params.locale}` : '';
  const configurationPath = `${basePath}/asset/configuration`;

  const handleSaveField = (field: ScreenField) => {
    if (!selectedScreen || !selectedSection) {
      toast.error('Unable to determine screen or section for the field.');
      return;
    }

    const isSelectableField = selectableFieldTypes.has(field.fieldType);
    const linkedMaster =
      isSelectableField && !field.masterKey && field.optionsSource === 'linkedMaster'
        ? ensureLinkedFieldMaster({
            fieldId: field.id,
            fieldName: field.fieldName,
            fieldLabel: field.label,
            fieldType: field.fieldType,
            screenName: selectedScreen.displayName || selectedScreen.screenName || 'Field Form',
            sectionId: selectedSection.id,
            sectionLabel: selectedSection.label,
            dependsOnFieldId: field.dependsOnFieldId,
            seedOptions: field.options || [],
          })
        : null;

    const normalizedField: ScreenField = {
      ...field,
      modifiedDate: new Date().toISOString(),
      optionsSource: field.masterKey
        ? 'master'
        : isSelectableField && field.optionsSource === 'linkedMaster'
        ? 'linkedMaster'
        : field.optionsSource,
      linkedMasterId: field.masterKey ? undefined : linkedMaster?.id || field.linkedMasterId,
      linkedMasterLabel:
        field.masterKey ? undefined : linkedMaster?.fieldLabel || field.linkedMasterLabel,
      linkedMasterSection:
        field.masterKey ? undefined : linkedMaster?.sectionLabel || field.linkedMasterSection,
      linkedMasterScreen:
        field.masterKey ? undefined : linkedMaster?.screenName || field.linkedMasterScreen,
      options: field.options || [],
    };

    const updatedConfigs = screenConfigs.map((screen) => {
      if (screen.id !== selectedScreen.id) {
        return screen;
      }

      return {
        ...screen,
        sections: screen.sections.map((section) => {
          if (section.id !== selectedSection.id) {
            return section;
          }

          const existingIndex = section.fields.findIndex((f) => f.id === field.id);
          if (existingIndex >= 0) {
            const updatedFields = [...section.fields];
            updatedFields[existingIndex] = normalizedField;
            return { ...section, fields: updatedFields };
          }

          return { ...section, fields: [...section.fields, normalizedField] };
        }),
        modifiedDate: new Date().toISOString(),
      };
    });

    setScreenConfigs(updatedConfigs);
    saveAllScreenConfigs(updatedConfigs);
    toast.success(`Field "${field.label}" ${existingField ? 'updated' : 'created'} successfully.`);
    router.push(configurationPath);
  };

  const handleClose = () => {
    router.push(configurationPath);
  };

  const isReady = Boolean(selectedSection);

  return (
    <div className="min-h-screen bg-slate-50">
      {isReady ? (
        <FieldFormModal
          isOpen
          onClose={handleClose}
          onSave={handleSaveField}
          existingField={existingField || undefined}
          maxOrder={maxFieldOrder}
          availableFields={availableFields}
        />
      ) : (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-sm text-slate-500">
            Field metadata is not available yet. Please create screens/sections from the configuration dashboard
            before using this route.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded border border-slate-300 bg-white hover:bg-slate-50 transition"
          >
            Back to Configuration
          </button>
        </div>
      )}
    </div>
  );
}
