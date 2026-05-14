import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { ScreenList } from './screenFieldsMasterComponents/ScreenList';
import { SectionList } from './screenFieldsMasterComponents/SectionList';
import { FieldList } from './screenFieldsMasterComponents/FieldList';
import { FieldFormModal } from './screenFieldsMasterComponents/FieldFormModal';
import { useConfigurationMasterState } from './ConfigurationMasterContext';
import { ScreenConfig, ScreenField, type ScreenFieldsMasterProps } from '@/types/asset.types';
import { loadAllScreenConfigs, saveAllScreenConfigs, subscribeToConfigChanges } from '@/lib/utils/screenConfigStorage';

type GroupedScreenField = ScreenField & {
  sourceSectionId?: string;
  sourceSectionLabel?: string;
  sourceScreenName?: string;
  sourceScreenId?: string;
};

export function ScreenFieldsMaster({ onManageData }: ScreenFieldsMasterProps) {
  const {
    ensureLinkedFieldMaster,
    ensureLinkedFieldMasters,
    deleteLinkedFieldMaster,
    getLinkedFieldMasterByFieldId,
  } = useConfigurationMasterState();
  const [screenConfigs, setScreenConfigs] = useState<ScreenConfig[]>([]);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editingField, setEditingField] = useState<ScreenField | null>(null);
  const [editingFieldSourceSectionId, setEditingFieldSourceSectionId] = useState<string | null>(null);

  // Load configurations on mount
  useEffect(() => {
    const configs = loadAllScreenConfigs();
    setScreenConfigs(configs);
    if (configs.length > 0) {
      setSelectedScreenId(configs[0].id);
      if (configs[0].sections.length > 0) {
        setSelectedSectionId(configs[0].sections[0].id);
      }
    }
  }, []);

  // Reset the fields grid to the first page whenever the selection changes.
  // This prevents "No fields found" states when switching to a section with fewer rows.
  useEffect(() => {
    const pageResetEvent = new CustomEvent('screenFieldsMasterResetPage');
    window.dispatchEvent(pageResetEvent);
  }, [selectedScreenId, selectedSectionId]);

  // Subscribe to real-time configuration changes
  useEffect(() => {
    const unsubscribe = subscribeToConfigChanges((updatedConfigs) => {
      setScreenConfigs(updatedConfigs);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Auto-link selectable fields to linked masters so the mapping is permanent
  useEffect(() => {
    if (screenConfigs.length === 0) return;

    let changed = false;
    const selectableFieldTypes = new Set(['dropdown', 'select', 'radio', 'multiselect']);
    const pendingMetas: Array<{
      fieldId: string;
      fieldName: string;
      fieldLabel: string;
      fieldType: string;
      screenName: string;
      sectionId: string;
      sectionLabel: string;
      masterKey?: string;
      dependsOnFieldId?: string;
      seedOptions?: Array<{ value: string; label: string }>;
    }> = [];
    const staleDynamicBucketIds = new Set<string>();

    const updatedConfigs = screenConfigs.map((screen) => ({
      ...screen,
      sections: screen.sections.map((section) => ({
        ...section,
        fields: section.fields.map((field) => {
          if (!selectableFieldTypes.has(field.fieldType)) {
            return field;
          }

          if (field.masterKey) {
            if (
              field.optionsSource !== 'master' ||
              field.linkedMasterId !== undefined ||
              field.linkedMasterLabel !== undefined ||
              field.linkedMasterSection !== undefined ||
              field.linkedMasterScreen !== undefined
            ) {
              changed = true;
            }

            return {
              ...field,
              optionsSource: 'master',
              linkedMasterId: undefined,
              linkedMasterLabel: undefined,
              linkedMasterSection: undefined,
              linkedMasterScreen: undefined,
            };
          }

          if (field.optionsSource === 'linkedMaster') {
            const existingLinkedId = field.linkedMasterId || `linked_${field.id}`;
            const nextField: ScreenField = {
              ...field,
              optionsSource: 'linkedMaster',
              linkedMasterId: existingLinkedId,
              linkedMasterLabel: field.label,
              linkedMasterSection: section.label,
              linkedMasterScreen: screen.displayName || screen.screenName,
            };

            pendingMetas.push({
              fieldId: field.id,
              fieldName: field.fieldName,
              fieldLabel: field.label,
              fieldType: field.fieldType,
              screenName: screen.displayName || screen.screenName,
              sectionId: section.id,
              sectionLabel: section.label,
              seedOptions: field.options || [],
              dependsOnFieldId: field.dependsOnFieldId,
            });

            if (
              field.optionsSource !== nextField.optionsSource ||
              field.linkedMasterId !== nextField.linkedMasterId ||
              field.linkedMasterLabel !== nextField.linkedMasterLabel ||
              field.linkedMasterSection !== nextField.linkedMasterSection ||
              field.linkedMasterScreen !== nextField.linkedMasterScreen ||
              field.dependsOnFieldId !== nextField.dependsOnFieldId
            ) {
              changed = true;
            }

            return nextField;
          }

          if (field.linkedMasterId || field.linkedMasterLabel || field.linkedMasterSection || field.linkedMasterScreen) {
            const linkedBucket = getLinkedFieldMasterByFieldId(field.id);
            if (linkedBucket) {
              staleDynamicBucketIds.add(linkedBucket.id);
            }
            changed = true;
            return {
              ...field,
              optionsSource: 'manual' as any,
              linkedMasterId: undefined,
              linkedMasterLabel: undefined,
              linkedMasterSection: undefined,
              linkedMasterScreen: undefined,
            };
          }

          return field;
        }),
      })),
    }));

    if (pendingMetas.length > 0) {
      ensureLinkedFieldMasters(pendingMetas);
    }

    if (staleDynamicBucketIds.size > 0) {
      staleDynamicBucketIds.forEach((bucketId) => deleteLinkedFieldMaster(bucketId));
    }

    if (changed) {
      setScreenConfigs(updatedConfigs);
      saveAllScreenConfigs(updatedConfigs);
    }
  }, [screenConfigs, ensureLinkedFieldMasters, deleteLinkedFieldMaster, getLinkedFieldMasterByFieldId]);

  // Get current selections
  const selectedScreen = screenConfigs.find((s) => s.id === selectedScreenId);
  const selectedSection = selectedScreen?.sections.find(
    (s) => s.id === selectedSectionId
  );
  const selectedSectionGroup = selectedScreen?.sections.filter(
    (section) => section.label === selectedSection?.label
  ) || [];
  const groupedFieldCount = selectedSection?.fields.length || 0;
  const groupedFields: GroupedScreenField[] = selectedSection
    ? selectedSection.fields.map((field) => ({
        ...field,
        sourceSectionId: selectedSection.id,
        sourceSectionLabel: selectedSection.label,
        sourceScreenName: selectedScreen?.displayName || selectedScreen?.screenName,
        sourceScreenId: selectedScreen?.id,
      }))
    : [];
  const selectableFieldTypes = new Set(['dropdown', 'select', 'radio', 'multiselect']);

  // Handle screen selection
  const handleScreenSelect = (screenId: string) => {
    setSelectedScreenId(screenId);
    const screen = screenConfigs.find((s) => s.id === screenId);
    if (screen && screen.sections.length > 0) {
      setSelectedSectionId(screen.sections[0].id);
    } else {
      setSelectedSectionId(null);
    }
  };

  // Handle section selection
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId);
  };

  // Handle add section
  const handleAddSection = () => {
    toast.info('Add Section', {
      description:
        'Section management will be available in the next phase. Currently, you can manage fields within existing sections.',
    });
  };

  // Handle add field
  const handleAddField = () => {
    if (!selectedSectionId) {
      toast.error('No Section Selected', {
        description: 'Please select a section first.',
      });
      return;
    }
    setEditingField(null);
    setEditingFieldSourceSectionId(selectedSectionId);
    setShowFieldModal(true);
  };

  // Handle edit field
  const handleEditField = (field: GroupedScreenField) => {
    setEditingField(field);
    setEditingFieldSourceSectionId(field.sourceSectionId ?? null);
    setShowFieldModal(true);
  };

  // Handle save field
  const handleSaveField = (field: ScreenField) => {
    const targetSectionId = editingFieldSourceSectionId || selectedSectionId;
    if (!selectedScreenId || !targetSectionId) return;

    const targetScreen = selectedScreen || null;
    const targetSection = targetScreen?.sections.find((section) => section.id === targetSectionId) || null;
    const isSelectableField = selectableFieldTypes.has(field.fieldType);
    const linkedMaster = isSelectableField && !field.masterKey && field.optionsSource === 'linkedMaster'
      ? ensureLinkedFieldMaster({
          fieldId: field.id,
          fieldName: field.fieldName,
          fieldLabel: field.label,
          fieldType: field.fieldType,
          screenName: targetScreen?.displayName || targetScreen?.screenName || 'Add Asset',
          sectionId: targetSection?.id || targetSectionId,
          sectionLabel: targetSection?.label || targetSection?.sectionName || 'Unknown Section',
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
      linkedMasterLabel: field.masterKey ? undefined : linkedMaster?.fieldLabel || field.linkedMasterLabel,
      linkedMasterSection: field.masterKey ? undefined : linkedMaster?.sectionLabel || field.linkedMasterSection,
      linkedMasterScreen: field.masterKey ? undefined : linkedMaster?.screenName || field.linkedMasterScreen,
      options: field.options || [],
    };

    const updatedConfigs = screenConfigs.map((screen) => {
      if (screen.id !== selectedScreenId) return screen;

      return {
        ...screen,
        sections: screen.sections.map((section) => {
          if (section.id !== targetSectionId) return section;

          const existingFieldIndex = section.fields.findIndex(
            (f) => f.id === field.id
          );

          if (existingFieldIndex >= 0) {
            // Update existing field
            const updatedFields = [...section.fields];
            updatedFields[existingFieldIndex] = normalizedField;
            return { ...section, fields: updatedFields };
          } else {
            // Add new field
            return { ...section, fields: [...section.fields, normalizedField] };
          }
        }),
        modifiedDate: new Date().toISOString(),
      };
    });

    setScreenConfigs(updatedConfigs);
    saveAllScreenConfigs(updatedConfigs);
    setEditingFieldSourceSectionId(null);
    toast.success('Field Saved', {
      description: `Field "${field.label}" has been ${editingField ? 'updated' : 'created'} successfully.`,
    });
  };

  // Handle delete field
  const handleDeleteField = (fieldId: string, sourceSectionId?: string) => {
    const targetSectionId = sourceSectionId || selectedSectionId;
    if (!selectedScreenId || !targetSectionId) return;

    const field = selectedScreen?.sections
      .find((section) => section.id === targetSectionId)
      ?.fields.find((f) => f.id === fieldId);
    if (!field) return;

    if (
      !confirm(
        `Are you sure you want to delete the field "${field.label}"?\n\nThis action cannot be undone.`
      )
    ) {
      return;
    }

    const updatedConfigs = screenConfigs.map((screen) => {
      if (screen.id !== selectedScreenId) return screen;

      return {
        ...screen,
        sections: screen.sections.map((section) => {
          if (section.id !== targetSectionId) return section;

          return {
            ...section,
            fields: section.fields.filter((f) => f.id !== fieldId),
          };
        }),
        modifiedDate: new Date().toISOString(),
      };
    });

    setScreenConfigs(updatedConfigs);
    saveAllScreenConfigs(updatedConfigs);
    toast.success(`Field "${field.label}" has been deleted.`);
  };

  // Handle toggle field status
  const handleToggleFieldStatus = (fieldId: string, sourceSectionId?: string) => {
    const targetSectionId = sourceSectionId || selectedSectionId;
    if (!selectedScreenId || !targetSectionId) return;

    const updatedConfigs = screenConfigs.map((screen) => {
      if (screen.id !== selectedScreenId) return screen;

      return {
        ...screen,
        sections: screen.sections.map((section) => {
          if (section.id !== targetSectionId) return section;

          return {
            ...section,
            fields: section.fields.map((field) => {
              if (field.id !== fieldId) return field;
              return { ...field, isActive: !field.isActive, modifiedDate: new Date().toISOString() };
            }),
          };
        }),
        modifiedDate: new Date().toISOString(),
      };
    });

    setScreenConfigs(updatedConfigs);
    saveAllScreenConfigs(updatedConfigs);
  };

  // Handle reorder field
  const handleReorderField = (fieldId: string, direction: 'up' | 'down', sourceSectionId?: string) => {
    const targetSectionId = sourceSectionId || selectedSectionId;
    if (!selectedScreenId || !targetSectionId) return;

    const updatedConfigs = screenConfigs.map((screen) => {
      if (screen.id !== selectedScreenId) return screen;

      return {
        ...screen,
        sections: screen.sections.map((section) => {
          if (section.id !== targetSectionId) return section;

          const fields = [...section.fields].sort((a, b) => a.order - b.order);
          const fieldIndex = fields.findIndex((f) => f.id === fieldId);

          if (fieldIndex === -1) return section;

          if (direction === 'up' && fieldIndex > 0) {
            // Swap with previous field
            const temp = fields[fieldIndex].order;
            fields[fieldIndex].order = fields[fieldIndex - 1].order;
            fields[fieldIndex - 1].order = temp;
          } else if (direction === 'down' && fieldIndex < fields.length - 1) {
            // Swap with next field
            const temp = fields[fieldIndex].order;
            fields[fieldIndex].order = fields[fieldIndex + 1].order;
            fields[fieldIndex + 1].order = temp;
          }

          return { ...section, fields };
        }),
        modifiedDate: new Date().toISOString(),
      };
    });

    setScreenConfigs(updatedConfigs);
    saveAllScreenConfigs(updatedConfigs);
  };

  const maxFieldOrder = selectedSection
    ? Math.max(...groupedFields.map((f) => f.order), 0)
    : 0;

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Dynamic Field Master System</p>
            <p className="text-xs text-blue-700">
              All changes are automatically saved to local storage and will instantly appear in related screens (Add Asset Modal, Shop Detail Modal, etc.)
            </p>
          </div>
        </div>
      </div>
       
      {/* Three Column Layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* Column 1: Screens (3 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-3"
        >
          <ScreenList
            screens={screenConfigs}
            selectedScreenId={selectedScreenId}
            onScreenSelect={handleScreenSelect}
          />
        </motion.div>

        {/* Column 2: Sections (3 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-3"
        >
          {selectedScreen ? (
            <SectionList
              sections={selectedScreen.sections}
              selectedSectionId={selectedSectionId}
              onSectionSelect={handleSectionSelect}
              onAddSection={handleAddSection}
              screenName={selectedScreen.displayName}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">Select a screen first</p>
            </div>
          )}
        </motion.div>

        {/* Column 3: Fields (6 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="col-span-6"
        >
          {selectedSection ? (
            <FieldList
              fields={groupedFields}
              groupedFieldCount={groupedFieldCount}
              variantCount={selectedSectionGroup.length}
              onAddField={handleAddField}
              onEditField={handleEditField}
              onDeleteField={handleDeleteField}
              onToggleFieldStatus={handleToggleFieldStatus}
              onReorderField={handleReorderField}
              onManageData={onManageData}
              sectionName={selectedSection.label}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center h-full flex items-center justify-center">
              <div>
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">Select a section to view fields</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Field Form Modal */}
      <FieldFormModal
        isOpen={showFieldModal}
        onClose={() => {
          setShowFieldModal(false);
          setEditingField(null);
          setEditingFieldSourceSectionId(null);
        }}
        onSave={handleSaveField}
        existingField={editingField}
        maxOrder={maxFieldOrder}
        availableFields={groupedFields}
        onManageData={onManageData}
      />
    </div>
  );
}
