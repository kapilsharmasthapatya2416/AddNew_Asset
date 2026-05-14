/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useMemo, useState } from 'react';
import { Database, Plus } from 'lucide-react';
import { useConfigurationMasterState } from '@/components/modules/asset/configurationMaster/ConfigurationMasterContext';
import {
  ConditionalRule,
  FieldType,
  generateFieldId,
  ScreenField,
  type MasterDataConfig,
  type FieldFormModalProps,
} from '@/types/asset.types';

const fieldTypes: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number Input' },
  { value: 'email', label: 'Email Input' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'date', label: 'Date Picker' },
  { value: 'dropdown', label: 'Dropdown Select' },
  { value: 'select', label: 'Select Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file', label: 'File Upload' },
  { value: 'multiselect', label: 'Multi-Select' },
];

const optionsSourceSelectOptions = [
  { value: 'manual', label: 'Manual Options' },
  { value: 'master', label: 'Configuration Master' },
  { value: 'linkedMaster', label: 'Linked Field Master' },
];

const masterSourceOptions: Array<{ group: string; options: Array<{ value: keyof MasterDataConfig; label: string }> }> = [
  {
    group: 'Business Masters',
    options: [
      { value: 'assetCategory', label: 'Asset Category' },
      { value: 'assetType', label: 'Asset Type' },
      { value: 'zone', label: 'Zone' },
      { value: 'ward', label: 'Ward' },
      { value: 'propertyCategory', label: 'Property Category' },
      { value: 'propertySubCategory', label: 'Property Sub-Category' },
      { value: 'owningDepartment', label: 'Owning Department' },
      { value: 'ownershipType', label: 'Ownership Type' },
      { value: 'maintainingDepartment', label: 'Maintaining Department' },
      { value: 'inventoryType', label: 'Inventory Type' },
      { value: 'inventorySubType', label: 'Inventory Sub-Type' },
      { value: 'furnitureItemName', label: 'Furniture Item Name' },
      { value: 'furnitureTypeModel', label: 'Furniture Type / Model' },
      { value: 'equipmentName', label: 'Equipment Name' },
      { value: 'equipmentBrandModel', label: 'Equipment Brand / Model' },
      { value: 'inventoryCondition', label: 'Inventory Condition' },
      { value: 'equipmentStatus', label: 'Equipment Status' },
    ],
  },
  {
    group: 'Code-Backed Option Sets',
    options: [
      { value: 'yesNo', label: 'Yes / No' },
      { value: 'landAreaUnit', label: 'Land Area Unit' },
      { value: 'landShape', label: 'Land Shape' },
      { value: 'encumbranceStatus', label: 'Encumbrance Status' },
      { value: 'terrainType', label: 'Terrain Type' },
      { value: 'approachRoadType', label: 'Approach Road Type' },
      { value: 'surroundingDevelopment', label: 'Surrounding Development' },
      { value: 'currentLandUsage', label: 'Current Land Usage' },
      { value: 'buildableStatus', label: 'Buildable Status' },
      { value: 'floodProneArea', label: 'Flood Prone Area' },
      { value: 'landClassification', label: 'Land Classification' },
      { value: 'plotBoundaryType', label: 'Plot Boundary Type' },
      { value: 'condition', label: 'Condition' },
      { value: 'rentFrequency', label: 'Rent Frequency' },
      { value: 'depositType', label: 'Deposit Type' },
      { value: 'roadCategory', label: 'Road Category' },
      { value: 'roadClass', label: 'Road Class' },
      { value: 'numberOfLanes', label: 'Number of Lanes' },
      { value: 'surfaceType', label: 'Surface Type' },
      { value: 'trafficFlow', label: 'Traffic Flow' },
      { value: 'medianType', label: 'Median Type' },
      { value: 'footpathAvailability', label: 'Footpath Availability' },
      { value: 'drainageSystem', label: 'Drainage System' },
      { value: 'streetLighting', label: 'Street Lighting' },
      { value: 'roadMarking', label: 'Road Marking' },
      { value: 'trafficSignals', label: 'Traffic Signals' },
      { value: 'parkingFacility', label: 'Parking Facility' },
    ],
  },
];

const masterKeyOptions = masterSourceOptions.flatMap((group) =>
  group.options.map((option) => ({
    label: `${group.group} • ${option.label}`,
    value: option.value,
  }))
);

const selectableFieldTypes = new Set<FieldType>(['dropdown', 'select', 'radio', 'multiselect', 'checkbox']);

const normalizeValue = (value: string | string[] | undefined | null) =>
  Array.isArray(value)
    ? value.map((item) => String(item).trim().toLowerCase())
    : [String(value || '').trim().toLowerCase()];

export function useFieldFormModalController({
  existingField,
  maxOrder,
  availableFields = [],
  onSave,
  onClose,
  onManageData,
}: FieldFormModalProps) {
  const configMaster = useConfigurationMasterState();

  const [formData, setFormData] = useState<Partial<ScreenField>>({
    id: '',
    fieldName: '',
    label: '',
    placeholder: '',
    fieldType: 'text',
    required: false,
    order: maxOrder + 1,
    isActive: true,
    options: [],
    optionsSource: 'manual',
    conditionalDisplay: [],
    validationRules: [],
  });
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newRuleFieldId, setNewRuleFieldId] = useState('');
  const [newRuleValues, setNewRuleValues] = useState<string[]>([]);
  const [newRuleSubValues, setNewRuleSubValues] = useState<string[]>([]);

  useEffect(() => {
    if (existingField) {
      setFormData({
        ...existingField,
        optionsSource: existingField.masterKey ? 'master' : existingField.optionsSource || 'manual',
      });
      return;
    }

    setNewRuleFieldId('');
    setNewRuleValues([]);
    setNewRuleSubValues([]);
    setNewOptionValue('');
    setFormData({
      id: generateFieldId(),
      fieldName: '',
      label: '',
      placeholder: '',
      fieldType: 'text',
      required: false,
      order: maxOrder + 1,
      isActive: true,
      options: [],
      optionsSource: 'manual',
      conditionalDisplay: [],
      validationRules: [],
      createdDate: new Date().toISOString(),
    });
  }, [existingField, maxOrder]);

  const selectedRuleField = useMemo(
    () => availableFields.find((field) => field.id === newRuleFieldId),
    [availableFields, newRuleFieldId]
  );

  const parentFieldOptions = useMemo(() => {
    if (!selectedRuleField) return [];

    if (
      (selectedRuleField.optionsSource === 'manual' || !selectedRuleField.masterKey) &&
      selectedRuleField.options &&
      selectedRuleField.options.length > 0
    ) {
      return selectedRuleField.options.map((option) => ({
        label: option.label,
        value: option.value,
      }));
    }

    if (selectedRuleField.optionsSource === 'linkedMaster' && selectedRuleField.linkedMasterId) {
      return configMaster
        .getLinkedFieldMasterRecords(selectedRuleField.linkedMasterId)
        .filter((record) => record.isActive)
        .map((record) => ({
          label: record.name,
          value: record.code || record.name,
        }));
    }

    if (selectedRuleField.masterKey) {
      let masterData = configMaster.getActiveDataByKey(selectedRuleField.masterKey as keyof MasterDataConfig);

      if (selectedRuleField.masterKey === 'assetType') {
        const categoryField = availableFields.find((field) => field.masterKey === 'assetCategory');
        if (categoryField) {
          const appliedCategories = (formData.conditionalDisplay || [])
            .filter((rule) => rule.fieldId === categoryField.id)
            .flatMap((rule) => normalizeValue(rule.value))
            .filter(Boolean);

          if (appliedCategories.length > 0) {
            masterData = masterData.filter((record) =>
              appliedCategories.includes(String(record.parentCategory || '').trim().toLowerCase())
            );
          }
        }
      }

      if (selectedRuleField.masterKey === 'propertySubCategory') {
        const assetTypeField = availableFields.find((field) => field.masterKey === 'assetType');
        if (assetTypeField) {
          const appliedTypes = (formData.conditionalDisplay || [])
            .filter((rule) => rule.fieldId === assetTypeField.id)
            .flatMap((rule) => normalizeValue(rule.value))
            .filter(Boolean);

          if (appliedTypes.length > 0) {
            masterData = masterData.filter((record) =>
              appliedTypes.includes(String(record.parentCategory || '').trim().toLowerCase())
            );
          }
        }
      }

      return masterData.map((record) => ({
        label: record.name,
        value: record.templateKey || record.name,
      }));
    }

    return [];
  }, [availableFields, configMaster, formData.conditionalDisplay, selectedRuleField]);

  const activeSubCategoryOptions = useMemo(() => {
    if (!selectedRuleField) return [];

    const isAssetTypeField =
      selectedRuleField.fieldName === 'assetType' ||
      selectedRuleField.masterKey === 'assetType' ||
      String(selectedRuleField.masterKey || '').includes('assetType');

    if (!isAssetTypeField) return [];

    const isShoppingComplexSelected = newRuleValues.some((value) =>
      value.toLowerCase().includes('shopping complex')
    );

    if (!isShoppingComplexSelected) return [];

    return configMaster
      .getActiveDataByKey('propertySubCategory')
      .filter(
        (record) =>
          record.isActive &&
          String(record.parentCategory || '').toLowerCase().includes('shopping complex')
      )
      .map((record) => ({
        label: record.name,
        value: record.templateKey || record.name,
      }));
  }, [configMaster, newRuleValues, selectedRuleField]);

  const subCategoryFieldId = useMemo(
    () => availableFields.find((field) => field.masterKey === 'propertySubCategory')?.id || 'subCategory',
    [availableFields]
  );

  const selectedFieldOptions = useMemo(
    () =>
      availableFields
        .filter(
          (field) =>
            field.id !== formData.id &&
            selectableFieldTypes.has(field.fieldType) &&
            field.id !== newRuleFieldId
        )
        .map((field) => ({
          label: `${field.label} (${field.fieldName})`,
          value: field.id,
        })),
    [availableFields, formData.id, newRuleFieldId]
  );

  const activeConditionalRules = formData.conditionalDisplay || [];
  const isOptionField = ['dropdown', 'select', 'multiselect', 'radio', 'checkbox'].includes(
    formData.fieldType || ''
  );

  const handleSave = () => {
    const rawFieldName = String(formData.fieldName || '').trim();
    if (!rawFieldName || !formData.label) {
      alert('Field Name and Label are required');
      return;
    }

    const currentFieldId = existingField?.id;
    const siblingFieldNames = new Set(
      availableFields
        .filter((field) => field.id !== currentFieldId)
        .map((field) => String(field.fieldName || '').trim())
        .filter(Boolean)
    );

    let uniqueFieldName = rawFieldName;
    let suffix = 2;
    while (siblingFieldNames.has(uniqueFieldName)) {
      uniqueFieldName = `${rawFieldName}_${suffix}`;
      suffix += 1;
    }

    const fieldToSave: ScreenField = {
      ...(formData as ScreenField),
      fieldName: uniqueFieldName,
      modifiedDate: existingField ? new Date().toISOString() : undefined,
    };

    onSave(fieldToSave);
    onClose();
  };

  const handleAddOption = () => {
    const trimmedValue = newOptionValue.trim();
    if (!trimmedValue) return;

    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), { label: trimmedValue, value: trimmedValue }],
    }));
    setNewOptionValue('');
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.filter((_, optionIndex) => optionIndex !== index),
    }));
  };

  const handleApplyConditionalRules = () => {
    if (!newRuleFieldId || newRuleValues.length === 0) return;

    const newRules: ConditionalRule[] = newRuleValues.map((value) => ({
      fieldId: newRuleFieldId,
      value,
      operator: 'equals',
    }));

    const subRules: ConditionalRule[] = newRuleSubValues.map((value) => ({
      fieldId: subCategoryFieldId,
      value,
      operator: 'equals',
    }));

    setFormData((prev) => {
      const nextRules = [...(prev.conditionalDisplay || [])];
      [...newRules, ...subRules].forEach((rule) => {
        const exists = nextRules.some(
          (existingRule) =>
            existingRule.fieldId === rule.fieldId &&
            existingRule.operator === rule.operator &&
            String(existingRule.value) === String(rule.value)
        );
        if (!exists) {
          nextRules.push(rule);
        }
      });

      return {
        ...prev,
        conditionalDisplay: nextRules,
      };
    });

    setNewRuleValues([]);
    setNewRuleSubValues([]);
  };

  const handleConditionalFieldChange = (fieldId: string) => {
    setNewRuleFieldId(fieldId);
    setNewRuleValues([]);
    setNewRuleSubValues([]);
  };

  const handleConditionalValueToggle = (value: string) => {
    setNewRuleValues((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubValueToggle = (value: string) => {
    setNewRuleSubValues((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleManageData = () => {
    if (!onManageData) return;
    const fieldToSave: ScreenField = {
      ...(formData as ScreenField),
      modifiedDate: existingField ? new Date().toISOString() : undefined,
    };
    onSave(fieldToSave);
    onManageData(fieldToSave);
  };

  return {
    fieldTypes,
    fieldTypeOptions: fieldTypes.map((type) => ({
      value: type.value,
      label: type.label,
    })),
    optionsSourceSelectOptions,
    masterKeyOptions,
    formData,
    setFormData,
    newOptionValue,
    setNewOptionValue,
    newRuleFieldId,
    newRuleValues,
    newRuleSubValues,
    isOptionField,
    selectedRuleField,
    parentFieldOptions,
    activeSubCategoryOptions,
    activeConditionalRules,
    selectedFieldOptions,
    handleSave,
    handleAddOption,
    handleRemoveOption,
    handleApplyConditionalRules,
    handleConditionalFieldChange,
    handleConditionalValueToggle,
    handleSubValueToggle,
    handleManageData,
    DatabaseIcon: Database,
    PlusIcon: Plus,
  };
}
