'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Settings, 
  Database,
  Search,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  AlertCircle,
  ChevronRight,
  Layers,
  List,
  Grid3x3,
  Box,
  Package,
  Shield,
  Tag,
  Monitor,
  ChevronDown,
  Map as MapIcon,
  Square,
  TreeDeciduous,
  Home,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
//import Swal from 'sweetalert2';
//import { ScreenMaster } from '../components/ScreenMaster';
import { ScreenFieldsMaster } from './ScreenFieldsMaster';
import { useConfigurationMasterState } from './ConfigurationMasterContext';
import { masterConfigs } from '@/components/modules/asset/mock/configurationMasterData';
import { loadAllScreenConfigs, saveAllScreenConfigs, subscribeToConfigChanges } from '@/lib/utils/screenConfigStorage';
import type {
  MasterConfig,
  FieldConfig,
  MasterDataConfig,
  MasterDataRecord,
  LinkedFieldMasterBucket,
  ConfigurationMasterProps,
  ScreenConfig,
  ScreenField,
  ScreenSection,
} from '@/types/asset.types';

type InventoryMasterKey =
  | 'inventoryType'
  | 'inventorySubType'
  | 'furnitureItemName'
  | 'furnitureTypeModel'
  | 'equipmentName'
  | 'equipmentBrandModel'
  | 'inventoryCondition'
  | 'equipmentStatus';

type InventoryGroup = {
  label: string;
  childMasters: Array<{
    id: InventoryMasterKey;
    label: string;
  }>;
};

type MasterNavId = keyof MasterDataConfig | 'inventoryMaster' | 'linkedFieldMaster';

const inventoryChildMasterIds: InventoryMasterKey[] = [
  'inventoryType',
  'inventorySubType',
  'furnitureItemName',
  'furnitureTypeModel',
  'equipmentName',
  'equipmentBrandModel',
  'inventoryCondition',
  'equipmentStatus',
];

const mainMasterIds = new Set<keyof MasterDataConfig>([
  'assetCategory',
  'assetType',
  'zone',
  'ward',
  'propertyCategory',
  'propertySubCategory',
  'owningDepartment',
  'ownershipType',
  'maintainingDepartment',
  'inventoryType',
  'inventorySubType',
  'furnitureItemName',
  'furnitureTypeModel',
  'equipmentName',
  'equipmentBrandModel',
  'inventoryCondition',
  'equipmentStatus',
]);

const inventoryGroups: InventoryGroup[] = [
  {
    label: 'Inventory Setup',
    childMasters: [
      { id: 'inventoryType', label: 'Inventory Type Master' },
      { id: 'inventorySubType', label: 'Inventory Sub-Type Master' },
    ],
  },
  {
    label: 'Furniture',
    childMasters: [
      { id: 'furnitureItemName', label: 'Furniture Item Name Master' },
      { id: 'furnitureTypeModel', label: 'Furniture Type / Model Master' },
    ],
  },
  {
    label: 'Equipment',
    childMasters: [
      { id: 'equipmentName', label: 'Equipment Name Master' },
      { id: 'equipmentBrandModel', label: 'Equipment Brand / Model Master' },
    ],
  },
  {
    label: 'Condition / Status',
    childMasters: [
      { id: 'inventoryCondition', label: 'Inventory Condition Master' },
      { id: 'equipmentStatus', label: 'Equipment Status Master' },
    ],
  },
];

const ADD_ASSET_SCREEN_NAME = 'AddNewMunicipalAsset';

const parseFieldSelectionMap = (value?: string): Record<string, string[]> => {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return Object.entries(parsed as Record<string, unknown>).reduce((acc, [screenName, ids]) => {
      acc[screenName] = Array.isArray(ids) ? ids.map((id) => String(id)).filter(Boolean) : [];
      return acc;
    }, {} as Record<string, string[]>);
  } catch {
    return {};
  }
};

const stringifyFieldSelectionMap = (screenName: string, fieldIds: string[]): string =>
  JSON.stringify({ [screenName]: fieldIds });

const isInventoryChildMaster = (masterId: keyof MasterDataConfig) =>
  inventoryChildMasterIds.includes(masterId as InventoryMasterKey);

const buildMasterTypeNav = (configs: MasterConfig[]) => {
  const visible: MasterConfig[] = [];

  configs.forEach((config) => {
    if (isInventoryChildMaster(config.id as keyof MasterDataConfig)) {
      return;
    }

    if (!mainMasterIds.has(config.id as keyof MasterDataConfig)) {
      return;
    }

    visible.push(config);

    if (config.id === 'maintainingDepartment') {
      visible.push({
        id: 'inventoryMaster',
        label: 'Inventory Master',
        icon: Package,
        color: 'blue',
        fields: [],
      });
    }
  });

  return visible;
};

type ScreenFieldWithSource = ScreenField & {
  sourceSectionId?: string;
  sourceSectionLabel?: string;
  sourceScreenName?: string;
  sectionId?: string;
};

export function ConfigurationMaster({ initialScreenConfigs = [] }: ConfigurationMasterProps) {
  const {
    getMasterDataByKey,
    addMasterData,
    updateMasterData,
    deleteMasterData,
    toggleActiveStatus,
    linkedFieldMasters,
    addLinkedFieldMasterRecord,
    updateLinkedFieldMasterRecord,
    deleteLinkedFieldMasterRecord,
    toggleLinkedFieldMasterRecordStatus,
    getLinkedFieldMasterById,
    ensureLinkedFieldMaster,
    ensureLinkedFieldMasters,
    deleteLinkedFieldMaster,
    getOrphanMasterIds,
    getLinkedFieldMasterByFieldId,
  } = useConfigurationMasterState();
  const [selectedMaster, setSelectedMaster] = useState<keyof MasterDataConfig>('assetCategory');
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<MasterNavId>('assetCategory');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MasterDataRecord | null>(null);
  const [formData, setFormData] = useState<Partial<MasterDataRecord>>({});
  const [screenConfigs, setScreenConfigs] = useState<ScreenConfig[]>(() => initialScreenConfigs);
  const [selectedLinkedBucketId, setSelectedLinkedBucketId] = useState<string | null>(null);
  const [editingLinkedRecord, setEditingLinkedRecord] = useState<MasterDataRecord | null>(null);
  const [linkedFormData, setLinkedFormData] = useState<Partial<MasterDataRecord>>({});
  const [expandedScreens, setExpandedScreens] = useState<Record<string, boolean>>({});
  const [dynamicSearchTerm, setDynamicSearchTerm] = useState('');
  const orphanIds = useMemo(() => getOrphanMasterIds(), [linkedFieldMasters, getOrphanMasterIds]);

  const currentConfig = masterConfigs.find(m => m.id === selectedMaster);
  const currentData = getMasterDataByKey(selectedMaster);
  const [masterRecordsPage, setMasterRecordsPage] = useState(1);
  const RECORDS_PER_PAGE = 6;
  const addAssetScreenConfig = useMemo(
    () => screenConfigs.find((screen) => screen.screenName === ADD_ASSET_SCREEN_NAME) || null,
    [screenConfigs]
  );
  const addAssetScreenSections = useMemo(
    () => addAssetScreenConfig?.sections.filter((section) => section.isActive) || [],
    [addAssetScreenConfig]
  );
  const addAssetSectionGroups = useMemo(() => {
    const groups = new Map<string, {
      id: string;
      label: string;
      order: number;
      fields: Array<ScreenField & {
        sourceSectionId: string;
        sourceSectionLabel: string;
        sourceSectionName: string;
      }>;
      sourceSectionNames: string[];
    }>();

    addAssetScreenSections.forEach((section) => {
      const groupKey = section.label.trim().toLowerCase();
      const group = groups.get(groupKey);
      const sectionFields = section.fields
        .filter((field) => field.isActive)
        .map((field) => ({
          ...field,
          sourceSectionId: section.id,
          sourceSectionLabel: section.label,
          sourceSectionName: section.sectionName,
        }));

      if (!group) {
        groups.set(groupKey, {
          id: groupKey,
          label: section.label,
          order: section.order,
          fields: [...sectionFields],
          sourceSectionNames: [section.sectionName],
        });
        return;
      }

      group.fields.push(...sectionFields);
      group.sourceSectionNames.push(section.sectionName);
      group.order = Math.min(group.order, section.order);
    });

    return Array.from(groups.values())
      .sort((a, b) => a.order - b.order)
      .map((group) => ({
        ...group,
        fields: group.fields.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label)),
      }));
  }, [addAssetScreenSections]);
  const addAssetFieldItems = useMemo(() => {
    return addAssetSectionGroups.flatMap((section) => section.fields);
  }, [addAssetSectionGroups]);
  const defaultAddAssetSelectionJson = useMemo(
    () => stringifyFieldSelectionMap(ADD_ASSET_SCREEN_NAME, addAssetFieldItems.map((field) => field.id)),
    [addAssetFieldItems]
  );
  const parseSelection = (value?: string) => parseFieldSelectionMap(value);
  const currentCategorySelectionMap = useMemo(
    () => parseSelection(formData.screenFieldSelectionsJson || editingRecord?.screenFieldSelectionsJson),
    [formData.screenFieldSelectionsJson, editingRecord?.screenFieldSelectionsJson]
  );
  const currentCategorySelectedFieldIds = useMemo(() => {
    if (Object.prototype.hasOwnProperty.call(currentCategorySelectionMap, ADD_ASSET_SCREEN_NAME)) {
      return new Set(currentCategorySelectionMap[ADD_ASSET_SCREEN_NAME] || []);
    }
    return new Set(addAssetFieldItems.map((field) => field.id));
  }, [addAssetFieldItems, currentCategorySelectionMap]);

  const updateCategoryFieldSelection = (fieldIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      screenFieldSelectionsJson: stringifyFieldSelectionMap(ADD_ASSET_SCREEN_NAME, fieldIds),
    }));
  };

  const toggleCategoryField = (fieldId: string) => {
    const next = new Set(currentCategorySelectedFieldIds);
    if (next.has(fieldId)) {
      next.delete(fieldId);
    } else {
      next.add(fieldId);
    }
    updateCategoryFieldSelection(Array.from(next));
  };

  const setSectionFieldSelection = (section: ScreenSection, checked: boolean) => {
    const sectionFieldIds = section.fields
      .filter((field) => field.isActive)
      .map((field) => field.id);
    const next = new Set(currentCategorySelectedFieldIds);
    sectionFieldIds.forEach((id) => {
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
    });
    updateCategoryFieldSelection(Array.from(next));
  };

  const selectAllCategoryFields = () => updateCategoryFieldSelection(addAssetFieldItems.map((field) => field.id));

  const clearCategoryFields = () => updateCategoryFieldSelection([]);
  const visibleMasterTypes = buildMasterTypeNav(masterConfigs);
  const selectedLinkedBucket = linkedFieldMasters.find((bucket) => bucket.id === selectedLinkedBucketId) || null;
  const getDefaultLinkedParentSelection = (
    bucket: LinkedFieldMasterBucket | null,
    preferred?: string | null
  ) => {
    if (preferred) return preferred;
    if (!bucket?.parentBucketId) return null;

    const parentRecords = resolveParentRecordsForBucket(bucket.parentBucketId).filter((record) => record.isActive);
    return parentRecords[0]?.name || parentRecords[0]?.code || null;
  };

  useEffect(() => {
    const configs = loadAllScreenConfigs();
    setScreenConfigs(configs);

    const unsubscribe = subscribeToConfigChanges((updatedConfigs) => {
      setScreenConfigs(updatedConfigs);
    });

    return () => unsubscribe();
  }, []);

  // Derived parent categories for the middle column
  const parentCategoryType = currentConfig?.fields.find(f => f.name === 'parentCategory')?.placeholder?.includes('Zone') 
      ? 'zone' 
      : currentConfig?.fields.find(f => f.name === 'parentCategory')?.placeholder?.includes('Asset Category') 
        ? 'assetCategory'
      : currentConfig?.fields.find(f => f.name === 'parentCategory')?.placeholder?.includes('Asset Type')
        ? 'assetType'
      : currentConfig?.fields.find(f => f.name === 'parentCategory')?.placeholder?.includes('Property Category')
        ? 'propertyCategory'
      : currentConfig?.fields.find(f => f.name === 'parentCategory')?.placeholder?.includes('Furniture Item')
          ? 'furnitureItemName'
          : currentConfig?.fields.find(f => f.name === 'parentCategory')?.placeholder?.includes('Equipment Name')
            ? 'equipmentName'
        : currentConfig?.fields.find(f => f.name === 'parentCategory')?.placeholder?.includes('Parent Type')
          ? 'inventoryType'
          : null;

  const parentRecords = parentCategoryType ? getMasterDataByKey(parentCategoryType as keyof MasterDataConfig) : [];
  useEffect(() => {
    if (!selectedLinkedBucketId && linkedFieldMasters.length > 0) {
      setSelectedLinkedBucketId(linkedFieldMasters[0].id);
    }
  }, [linkedFieldMasters, selectedLinkedBucketId]);

  const resolveDefaultParentSelection = (field: ScreenFieldWithSource): string | null => {
    const fieldName = String(field.fieldName || '').trim().toLowerCase();
    const shouldInferFromCategory =
      field.masterKey === 'assetType' ||
      fieldName === 'assettype' ||
      fieldName === 'buildingtype' ||
      fieldName === 'landtype' ||
      fieldName === 'infrastructuretype' ||
      fieldName === 'movabletype';

    if (!shouldInferFromCategory) {
      return null;
    }

    const categoryRule = field.conditionalDisplay?.find((rule) =>
      rule.fieldId === 'category' ||
      rule.fieldId === 'assetCategory' ||
      rule.fieldId === 'field_a_001'
    );

    if (!categoryRule) {
      return null;
    }

    const rawValue = Array.isArray(categoryRule.value) ? categoryRule.value[0] : categoryRule.value;
    if (!rawValue) {
      return null;
    }

    const normalizedValue = String(rawValue).trim().toLowerCase();
    const assetCategoryRecord = getMasterDataByKey('assetCategory').find((record) => {
      const name = record.name.trim().toLowerCase();
      const code = String(record.code || '').trim().toLowerCase();
      const templateKey = String(record.templateKey || '').trim().toLowerCase();
      return normalizedValue === name || normalizedValue === code || normalizedValue === templateKey;
    });

    return assetCategoryRecord?.name || String(rawValue);
  };

  const normalizeLookupValue = (value?: string | null) => String(value || '').trim().toLowerCase();

  const resolveParentRecordsForBucket = (bucketId?: string | null) => {
    if (!bucketId) return [];
    if (bucketId.startsWith('linked_')) {
      return getLinkedFieldMasterById(bucketId)?.records || [];
    }
    return getMasterDataByKey(bucketId as keyof MasterDataConfig);
  };

  const resolveParentDisplayLabel = (value?: string | null, bucketId?: string | null) => {
    if (!value) return 'All';

    const normalized = normalizeLookupValue(value);
    const records = resolveParentRecordsForBucket(bucketId);
    const match = records.find((record) => {
      const name = normalizeLookupValue(record.name);
      const code = normalizeLookupValue(record.code);
      return normalized === name || normalized === code;
    });

    return match?.name || value;
  };

  const parentValueMatchesSelection = (
    recordParent: string | null | undefined,
    selectedParent: string | null,
    bucketId?: string | null
  ) => {
    if (!selectedParent) return true;

    const normalizedSelected = normalizeLookupValue(selectedParent);
    const normalizedRecord = normalizeLookupValue(recordParent);
    if (normalizedSelected === normalizedRecord) return true;

    const records = resolveParentRecordsForBucket(bucketId);
    const selectedRecord = records.find((record) => {
      const name = normalizeLookupValue(record.name);
      const code = normalizeLookupValue(record.code);
      return normalizedSelected === name || normalizedSelected === code;
    });

    if (!selectedRecord) {
      return false;
    }

    const selectedName = normalizeLookupValue(selectedRecord.name);
    const selectedCode = normalizeLookupValue(selectedRecord.code);
    return normalizedRecord === selectedName || normalizedRecord === selectedCode;
  };

  const ensureLinkedFieldConfig = (field: ScreenFieldWithSource): ScreenFieldWithSource => {
    if (
      (field.optionsSource === 'linkedMaster' && field.linkedMasterId) ||
      !(field as any).sourceScreenId ||
      !(field as any).sourceSectionId
    ) {
      return field;
    }

    let resolvedScreenName = field.linkedMasterScreen || field.sourceScreenName || 'Linked Field Screen';
    let resolvedSectionLabel = field.linkedMasterSection || field.sourceSectionLabel || 'Linked Field Section';
    const linkedId = field.linkedMasterId || `linked_${field.id}`;
    let updated = false;

    const updatedConfigs = screenConfigs.map((screen) => {
      if (screen.id !== (field as any).sourceScreenId) return screen;
      const screenName = screen.displayName || screen.screenName || resolvedScreenName;
      return {
        ...screen,
        sections: screen.sections.map((section) => {
          if (section.id !== field.sourceSectionId) return section;
          const sectionLabel = section.label || resolvedSectionLabel;
          const updatedFields = section.fields.map((f) => {
            if (f.id !== field.id) return f;
            updated = true;
            resolvedScreenName = screenName;
            resolvedSectionLabel = sectionLabel;
            return {
              ...f,
              optionsSource: 'linkedMaster' as any,
              linkedMasterId: linkedId,
              linkedMasterLabel: f.label,
              linkedMasterSection: sectionLabel,
              linkedMasterScreen: screenName,
            };
          });
          return { ...section, fields: updatedFields };
        }),
      };
    });

    if (updated) {
      setScreenConfigs(updatedConfigs);
      saveAllScreenConfigs(updatedConfigs);
      return {
        ...field,
        optionsSource: 'linkedMaster',
        linkedMasterId: linkedId,
        linkedMasterLabel: field.label,
        linkedMasterSection: resolvedSectionLabel,
        linkedMasterScreen: resolvedScreenName,
      };
    }

    return field;
  };
  
  const currentLinkedRecords = selectedLinkedBucket?.records || [];
  
  const filteredData = (selectedMasterCategory === 'linkedFieldMaster' ? currentLinkedRecords : currentData).filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.code && record.code.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Only filter by parent if selectedParentId is set
    const parentBucketId = selectedLinkedBucket?.parentBucketId || parentCategoryType || null;
    const matchesParent = parentValueMatchesSelection(record.parentCategory, selectedParentId, parentBucketId);

    return matchesSearch && matchesParent;
  });


  const handleAdd = () => {
    setEditingRecord(null);
    setFormData(
      selectedMaster === 'assetCategory'
        ? { 
            isActive: true, 
            screenFieldSelectionsJson: defaultAddAssetSelectionJson,
            // Pre-select parent category from sidebar filter if active
            parentCategory: selectedParentId || undefined
          }
        : { 
            isActive: true,
            // Pre-select parent category from sidebar filter if active
            parentCategory: selectedParentId || undefined
          }
    );
    setShowAddEdit(true);
  };

  const handleEdit = (record: MasterDataRecord) => {
    setEditingRecord(record);
    setFormData(
      selectedMaster === 'assetCategory'
        ? {
            ...record,
            screenFieldSelectionsJson: record.screenFieldSelectionsJson || defaultAddAssetSelectionJson,
          }
        : { ...record }
    );
    setShowAddEdit(true);
  };

  const handleSave = () => {
    // Validation
    if (!formData.name || !formData.code) {
      toast.error('Please fill all required fields');
      return;
    }

    const normalizedFormData: Partial<MasterDataRecord> = selectedMaster === 'assetCategory'
      ? {
          ...formData,
          screenFieldSelectionsJson: formData.screenFieldSelectionsJson || defaultAddAssetSelectionJson,
        }
      : { ...formData };

    if (editingRecord) {
      // Update existing
      updateMasterData(selectedMaster, editingRecord.id, normalizedFormData);
      toast.success(`${currentConfig?.label} updated successfully`);
      setShowAddEdit(false);
      setFormData({});
    } else {
      // Add new
      addMasterData(selectedMaster, {
        code: normalizedFormData.code!,
        name: normalizedFormData.name!,
        description: normalizedFormData.description,
        isActive: normalizedFormData.isActive ?? true,
        parentCategory: normalizedFormData.parentCategory,
        templateKey: normalizedFormData.templateKey,
        hiddenSectionKeys: normalizedFormData.hiddenSectionKeys,
        screenFieldSelectionsJson: normalizedFormData.screenFieldSelectionsJson,
      });
      toast.success(`${currentConfig?.label} added successfully`);
      
      // FOR MULTIPLE ADD: Keep modal open and preserve parentCategory
      const parentCategory = formData.parentCategory;
      setFormData({ 
        isActive: true, 
        parentCategory,
        // Reset field assignment for assetCategory if needed
        screenFieldSelectionsJson: selectedMaster === 'assetCategory' ? defaultAddAssetSelectionJson : undefined
      });
    }
  };

  const handleDelete = (record: MasterDataRecord) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMasterData(selectedMaster, record.id);
        toast.success(`${currentConfig?.label} deleted successfully`);
      }
    });
  };

  const handleToggleStatus = (record: MasterDataRecord) => {
    toggleActiveStatus(selectedMaster, record.id);
    toast.success(`Status updated successfully`);
  };

  // Handle clicking "Manage Data" from a dynamic field in screen fields master
  const handleManageData = (field: ScreenFieldWithSource) => {
    if (field.masterKey) {
      setSelectedMasterCategory(field.masterKey as MasterNavId);
      setSelectedMaster(field.masterKey as keyof MasterDataConfig);
      // Temporarily keep screen fields tab active
      setSelectedParentId(resolveDefaultParentSelection(field));
      return;
    }

    const managedField = ensureLinkedFieldConfig(field);
    const bucketId = managedField.linkedMasterId || `linked_${managedField.id}`;
    let bucket = linkedFieldMasters.find((b) => b.id === bucketId);

    if (!bucket) {
      const screenName =
        managedField.linkedMasterScreen ||
        managedField.sourceScreenName ||
        managedField.sourceSectionLabel ||
        'Linked Field Screen';
      const sectionId =
        managedField.sourceSectionId || managedField.sectionId || `section_${managedField.id}`;
      const sectionLabel =
        managedField.linkedMasterSection ||
        managedField.sourceSectionLabel ||
        'Linked Field Section';

      bucket = ensureLinkedFieldMaster({
        fieldId: managedField.id,
        fieldName: managedField.fieldName,
        fieldLabel: managedField.label,
        fieldType: managedField.fieldType,
        screenName,
        sectionId,
        sectionLabel,
        dependsOnFieldId: managedField.dependsOnFieldId,
        seedOptions: managedField.options,
      });
    }

    if (bucket) {
      setSelectedMasterCategory('linkedFieldMaster');
      setSelectedLinkedBucketId(bucket.id);
      // Temporarily keep screen fields tab active
      setSelectedParentId(getDefaultLinkedParentSelection(bucket, resolveDefaultParentSelection(managedField)));
      // Automatically expand the screen group
      setExpandedScreens(prev => ({ ...prev, [bucket.screenName]: true }));
    } else {
      toast.error('Could not find data master for this field');
    }
  };

  const handleDeleteLinkedRecord = async (bucketId: string, id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      deleteLinkedFieldMasterRecord(bucketId, id);
      toast.success('Record deleted successfully');
    }
  };

  const handleSaveLinkedRecord = () => {
    if (!selectedLinkedBucket) {
      toast.error('Please select a linked master first');
      return;
    }
    if (!linkedFormData.name || !linkedFormData.code) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingLinkedRecord) {
      updateLinkedFieldMasterRecord(selectedLinkedBucket.id, editingLinkedRecord.id, linkedFormData);
      toast.success(`${selectedLinkedBucket.fieldLabel} updated successfully`);
      setShowAddEdit(false);
      setEditingLinkedRecord(null);
      setLinkedFormData({ isActive: true });
    } else {
      addLinkedFieldMasterRecord(selectedLinkedBucket.id, {
        code: linkedFormData.code!,
        name: linkedFormData.name!,
        description: linkedFormData.description,
        isActive: linkedFormData.isActive ?? true,
        parentCategory: linkedFormData.parentCategory,
      });
      toast.success(`${selectedLinkedBucket.fieldLabel} value added successfully`);
      
      // FOR MULTIPLE ADD: Keep modal open and preserve parentCategory
      const parentCategory = linkedFormData.parentCategory;
      setEditingLinkedRecord(null);
      setLinkedFormData({ 
        isActive: true,
        parentCategory 
      });
    }
  };

  const openLinkedMasterEditor = (record?: MasterDataRecord | null) => {
    const defaultParent = getDefaultLinkedParentSelection(selectedLinkedBucket, selectedParentId);

    setEditingLinkedRecord(record || null);
    setLinkedFormData(
      record
        ? {
            ...record,
            parentCategory: record.parentCategory
              ? resolveParentDisplayLabel(record.parentCategory, selectedLinkedBucket?.parentBucketId)
              : defaultParent || undefined,
          }
        : {
            isActive: true,
            parentCategory: defaultParent || undefined,
          }
    );
    if (!selectedParentId && defaultParent) {
      setSelectedParentId(defaultParent);
    }
    setShowAddEdit(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1600px] mx-auto"
      >
        {/* Professional Header - Government Style */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <div className=" shadow-md   overflow-hidden">
            <div className="  px-6 py-4 flex items-center justify-between  ">
              <div className="flex items-center gap-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm flex items-center justify-center border border-blue-200 shadow-sm"
                >
                  <Settings className="w-6 h-6 text-blue-600" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Configuration Master</h1>
                  <p className="text-gray-600 text-sm">Centralized Master Data Management System</p>
                </div>
              </div>
              
              {/* Compact Stats - Glassmorphism Cards */}
              <div className="flex gap-3">
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                  <p className="text-gray-600 text-xs font-medium mb-0.5">Total Masters</p>
                  <p className="text-xl font-bold text-gray-800">{visibleMasterTypes.length}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                  <p className="text-xl font-bold text-gray-800">{currentData.filter(r => r.isActive).length}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        {/*
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-4"
        >
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-1 inline-flex gap-1">
            <button
              onClick={() => setActiveTab('masters')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'masters'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Database className="w-4 h-4" />
              Master Data
            </button>
            <button
              onClick={() => setActiveTab('screens')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'screens'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Screen Master
            </button>
            <button
              onClick={() => setActiveTab('screenFields')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'screenFields'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              Screen Fields Master
            </button>
          </div>
        </motion.div>
        */}

        {/* Conditional Tab Content */}
        <ScreenFieldsMaster
          onManageData={handleManageData}
          initialScreenConfigs={initialScreenConfigs}
          ensureLinkedFieldMasters={ensureLinkedFieldMasters}
          deleteLinkedFieldMaster={deleteLinkedFieldMaster}
          getLinkedFieldMasterByFieldId={getLinkedFieldMasterByFieldId}
        />
        {/* Professional Add/Edit Modal */}
        <AnimatePresence>
          {showAddEdit && (currentConfig || selectedMasterCategory === 'linkedFieldMaster') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddEdit(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden border border-gray-200"
              >
                {/* Modal Header */}
                <div className={`${selectedMasterCategory === 'linkedFieldMaster' ? 'bg-indigo-700' : 'bg-[#1e3a8a]'} px-6 py-4 flex items-center justify-between border-b border-blue-900`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      {selectedMasterCategory === 'linkedFieldMaster' ? <Box className="w-5 h-5 text-white" /> : <currentConfig.icon className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {selectedMasterCategory === 'linkedFieldMaster' 
                          ? `${editingLinkedRecord ? 'Edit' : 'Add New'} Option` 
                          : `${editingRecord ? 'Edit' : 'Add New'} ${currentConfig.label}`}
                      </h3>
                      <p className="text-blue-100 text-xs">
                        {selectedMasterCategory === 'linkedFieldMaster' 
                          ? `Value management for ${selectedLinkedBucket?.fieldLabel}` 
                          : `${editingRecord ? 'Update existing record' : 'Create new master record'}`}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddEdit(false)}
                    className="text-white hover:bg-white/10 rounded-md p-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto bg-gray-50">
                  {selectedMasterCategory === 'linkedFieldMaster' ? (
                    <>
                      {/* Parent Record Selector for Dependent Dropdowns */}
                      {selectedLinkedBucket?.parentBucketId && (
                        <div>
                          <label className="block text-xs font-semibold text-indigo-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            Parent {getLinkedFieldMasterById(selectedLinkedBucket.parentBucketId)?.fieldLabel || 
                                   masterConfigs.find(m => m.id === selectedLinkedBucket.parentBucketId)?.label || 
                                   'Record'} <span className="text-red-600 ml-1">*</span>
                          </label>
                          <select
                            value={linkedFormData.parentCategory || ''}
                            onChange={(e) => setLinkedFormData({ ...linkedFormData, parentCategory: e.target.value })}
                            className="w-full px-4 py-2 bg-indigo-50/50 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm font-semibold text-indigo-900"
                          >
                            <option value="">-- Select Parent --</option>
                            {/* Try Linked Master first, then Standard Master */}
                            {(getLinkedFieldMasterById(selectedLinkedBucket.parentBucketId)?.records ||
                              getMasterDataByKey(selectedLinkedBucket.parentBucketId as keyof MasterDataConfig) || [])
                              .filter(r => r.isActive)
                              .map(record => {
                                const parentValue = record.name || record.code || '';
                                return (
                                  <option key={record.id} value={parentValue}>
                                    {record.name} {record.code ? `(${record.code})` : ''}
                                  </option>
                                );
                              })
                            }
                          </select>
                          <p className="text-[10px] text-indigo-500 mt-1">
                            This option will only appear when the selected parent is chosen in the form.
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Option Code <span className="text-red-600 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={linkedFormData.code || ''}
                          onChange={(e) => setLinkedFormData({ ...linkedFormData, code: e.target.value })}
                          placeholder="e.g., option_1"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Option Display Label <span className="text-red-600 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={linkedFormData.name || ''}
                          onChange={(e) => setLinkedFormData({ ...linkedFormData, name: e.target.value })}
                          placeholder="e.g., Option One"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Description
                        </label>
                        <textarea
                          value={linkedFormData.description || ''}
                          onChange={(e) => setLinkedFormData({ ...linkedFormData, description: e.target.value })}
                          placeholder="Optional details"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all min-h-[80px] text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    currentConfig.fields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                          {field.label}
                          {field.required && <span className="text-red-600 ml-1">*</span>}
                        </label>
                          {field.type === 'select' ? (
                            <div className="relative">
                              <select
                                value={formData[field.name as keyof MasterDataRecord] as string || ''}
                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                required={field.required}
                                className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-gray-700 appearance-none"
                              >
                                <option value="">{field.placeholder}</option>
                                {(field.name === 'parentCategory'
                                  ? (
                                      field.placeholder?.includes('Asset Category') ? getMasterDataByKey('assetCategory') :
                                    field.placeholder?.includes('Asset Type') ? getMasterDataByKey('assetType') :
                                    field.placeholder?.includes('Zone') ? getMasterDataByKey('zone') :
                                   field.placeholder?.includes('Property Category') ? getMasterDataByKey('propertyCategory') :
                                    field.placeholder?.includes('Furniture Item') ? getMasterDataByKey('furnitureItemName') :
                                      field.placeholder?.includes('Equipment Name') ? getMasterDataByKey('equipmentName') :
                                      field.placeholder?.includes('Inventory Type') ? getMasterDataByKey('inventoryType') :
                                      []
                                    )
                                  : []).map(option => (
                                  <option key={option.id} value={option.name}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                <ChevronRight className="w-4 h-4 rotate-90" />
                              </div>
                            </div>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              value={formData[field.name as keyof MasterDataRecord] as string || ''}
                              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                              placeholder={field.placeholder}
                              required={field.required}
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all min-h-[100px] text-sm"
                            />
                          ) : (
                            <input
                              type="text"
                              value={formData[field.name as keyof MasterDataRecord] as string || ''}
                              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                              placeholder={field.placeholder}
                              required={field.required}
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm"
                            />
                          )}
                      </div>
                    ))
                  )}

                  {selectedMaster === 'assetCategory' && (
                    <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">Field Assignment</h4>
                          <p className="text-xs text-slate-500">
                            Choose which Add Asset fields this category should display.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={selectAllCategoryFields}
                            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={clearCategoryFields}
                            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>

                      {!addAssetScreenConfig ? (
                        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                          Add Asset screen configuration is not available yet.
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                          {addAssetSectionGroups.map((section) => {
                            const seenFieldNames = new Set<string>();
                            const uniqueActiveSectionFields = section.fields.filter((field) => {
                              if (!field.isActive) return false;
                              if (seenFieldNames.has(field.fieldName)) return false;
                              seenFieldNames.add(field.fieldName);
                              return true;
                            });
                            const sectionFieldIds = uniqueActiveSectionFields.map((field) => field.id);
                            const selectedCount = sectionFieldIds.filter((id) => currentCategorySelectedFieldIds.has(id)).length;
                            const allSelected = sectionFieldIds.length > 0 && selectedCount === sectionFieldIds.length;
                            const someSelected = selectedCount > 0 && !allSelected;

                            return (
                              <div key={section.id} className="rounded-lg border border-slate-200 bg-slate-50/60">
                                <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-slate-200 bg-white rounded-t-lg">
                                  <div>
                                    <p className="text-xs font-semibold text-slate-800">{section.label}</p>
                                    <p className="text-[10px] text-slate-500">{selectedCount} selected</p>
                                    {section.sourceSectionNames.length > 1 && (
                                      <p className="text-[10px] text-slate-400">
                                        Variants: {section.sourceSectionNames.join(', ')}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setSectionFieldSelection(section as any, !allSelected || someSelected)}
                                    className={`px-2.5 py-1 text-[10px] font-semibold rounded-md border ${
                                      allSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-slate-700 border-slate-300'
                                    }`}
                                  >
                                    {allSelected ? 'Unselect Section' : 'Select Section'}
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
                                  {uniqueActiveSectionFields.map((field) => {
                                    const checked = currentCategorySelectedFieldIds.has(field.id);
                                    return (
                                      <label
                                        key={`${section.id}_${field.id}`}
                                        className={`flex items-start gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
                                          checked
                                            ? 'border-blue-300 bg-blue-50'
                                            : 'border-slate-200 bg-white hover:bg-slate-50'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() => toggleCategoryField(field.id)}
                                          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="min-w-0">
                                          <p className="text-xs font-semibold text-slate-800 truncate">
                                            {field.label}
                                          </p>
                                          <p className="text-[10px] text-slate-500 truncate">
                                            {field.fieldName} · {field.fieldType}
                                          </p>
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(selectedMasterCategory === 'linkedFieldMaster' ? linkedFormData.isActive : formData.isActive) ?? true}
                        onChange={(e) => {
                          if (selectedMasterCategory === 'linkedFieldMaster') {
                            setLinkedFormData({ ...linkedFormData, isActive: e.target.checked });
                          } else {
                            setFormData({ ...formData, isActive: e.target.checked });
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Active Status
                      </span>
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex items-center justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddEdit(false)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (selectedMasterCategory === 'linkedFieldMaster') {
                        handleSaveLinkedRecord();
                      } else {
                        handleSave();
                      }
                    }}
                    className={`px-4 py-2 ${selectedMasterCategory === 'linkedFieldMaster' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition-colors text-sm font-semibold flex items-center gap-2 shadow-sm`}
                  >
                    <Save className="w-4 h-4" />
                    {(selectedMasterCategory === 'linkedFieldMaster' ? editingLinkedRecord : editingRecord) ? 'Update' : 'Save'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
