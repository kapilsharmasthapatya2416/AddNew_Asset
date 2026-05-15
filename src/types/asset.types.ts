export interface AssetUser {
  id: string;
  name: string;
  role: string;
  accessibleScreenCodes?: string[];
  screenStates?: Record<string, boolean>;
}

export interface ScreenItem {
  screenCode: string;
  screenPath: string;
}

export interface AssetRequestItem {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface AssetSidebarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  isSidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

import React from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType; // Lucide icon component
  route: string;
}

export interface SidebarSection {
  id: string;
  label: string;
  icon: React.ElementType; // Lucide icon for the section header
  items: MenuItem[];
  colorClass: string; // Tailwind color class for the icon (e.g., 'text-yellow-400')
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'dropdown'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'multiselect'
  | 'button';

export type FieldOptionsSource = 'manual' | 'linkedMaster' | 'master';

export interface FieldOption {
  value: string;
  label: string;
}

export interface ConditionalRule {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'in';
  value: string | string[];
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
  value?: string | number;
  message: string;
}

export interface ScreenField {
  id: string;
  fieldName: string;
  label: string;
  placeholder?: string;
  fieldType: FieldType;
  required: boolean;
  options?: FieldOption[];
  optionsSource?: FieldOptionsSource;
  masterKey?: string;
  linkedMasterId?: string;
  linkedMasterLabel?: string;
  linkedMasterSection?: string;
  linkedMasterScreen?: string;
  dependsOnFieldId?: string;
  dependsOnFieldName?: string;
  conditionalDisplay?: ConditionalRule[];
  validationRules?: ValidationRule[];
  defaultValue?: string | number | boolean;
  helpText?: string;
  enablePropertyLookup?: boolean;
  allowMultiple?: boolean;
  accept?: string;
  buttonAction?: string;
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'danger';
  order: number;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
}

export interface ScreenSection {
  id: string;
  sectionName: string;
  label: string;
  description?: string;
  order: number;
  isCollapsible: boolean;
  isDefaultExpanded: boolean;
  isActive: boolean;
  conditionalDisplay?: ConditionalRule[];
  fields: ScreenField[];
  createdDate: string;
  modifiedDate?: string;
}

export interface ScreenConfig {
  id: string;
  screenName: string;
  displayName: string;
  description?: string;
  module: string;
  isActive: boolean;
  sections: ScreenSection[];
  createdDate: string;
  modifiedDate?: string;
}

// Helper utilities (previously in screenFields.ts)
export const generateFieldId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `field_${timestamp}_${random}`;
};

export const generateSectionId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `section_${timestamp}_${random}`;
};

export const generateScreenId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `screen_${timestamp}_${random}`;
};

export type AssetDocumentCategory = 'building' | 'land' | 'infrastructure';
export type AssetDocumentSectionKey = 'basicInfo' | 'legalSafety' | 'inventory' | 'valuation';
export type AssetDocumentIconKey = 'building' | 'shield' | 'inventory' | 'valuation';
export type AssetInventoryIconKey = 'package' | 'fileText' | 'camera' | 'truck';

export interface AssetDocumentFileDefinition {
  id: string;
  fieldName: string;
  documentName: string;
  stage: string;
  categories: AssetDocumentCategory[];
  fileNameFallback: string;
  iconKind: 'photo' | 'document';
  isArray?: boolean;
}

export interface AssetInventoryCollectionDefinition {
  id: string;
  collectionKey: 'furnitureItems' | 'itEquipmentItems' | 'electronicFixturesItems' | 'vehicleItems';
  itemType: string;
  itemIconKey: AssetInventoryIconKey;
  stage: string;
  categories: AssetDocumentCategory[];
  itemNameField: string;
  detailFieldName: string;
  quantityFieldName: string;
  detailMode: 'quantity' | 'registration';
  photoFieldName: string;
  invoiceIdFieldName: string;
  invoiceNumberFieldName: string;
  invoiceDateFieldName: string;
}

export interface AssetDocumentSectionDefinition {
  id: string;
  sectionKey: AssetDocumentSectionKey;
  label: string;
  description: string;
  iconKey: AssetDocumentIconKey;
  categories: AssetDocumentCategory[];
  emptyMessage: string;
  emptyDescription: string;
  fileDocuments: AssetDocumentFileDefinition[];
  inventoryDocuments?: AssetInventoryCollectionDefinition[];
}

export interface AddAssetFlowStepDefinition {
  id: number;
  name: string;
  iconKey: AssetDocumentIconKey | 'inventory';
}

export interface AddAssetFlowDefinition {
  category: 'building' | 'land' | 'infrastructure' | 'movable';
  steps: AddAssetFlowStepDefinition[];
}

export interface MasterDataRecord {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
  parentId?: string;
  parentCategory?: string;
  templateKey?: string;
  hiddenSectionKeys?: string;
  screenFieldSelectionsJson?: string;
}

export interface MasterDataConfig {
  assetCategory: MasterDataRecord[];
  assetType: MasterDataRecord[];
  zone: MasterDataRecord[];
  ward: MasterDataRecord[];
  propertyCategory: MasterDataRecord[];
  propertySubCategory: MasterDataRecord[];
  owningDepartment: MasterDataRecord[];
  ownershipType: MasterDataRecord[];
  maintainingDepartment: MasterDataRecord[];
  yesNo: MasterDataRecord[];
  landAreaUnit: MasterDataRecord[];
  landShape: MasterDataRecord[];
  encumbranceStatus: MasterDataRecord[];
  terrainType: MasterDataRecord[];
  approachRoadType: MasterDataRecord[];
  surroundingDevelopment: MasterDataRecord[];
  currentLandUsage: MasterDataRecord[];
  buildableStatus: MasterDataRecord[];
  floodProneArea: MasterDataRecord[];
  inventoryType: MasterDataRecord[];
  inventorySubType: MasterDataRecord[];
  furnitureItemName: MasterDataRecord[];
  furnitureTypeModel: MasterDataRecord[];
  equipmentName: MasterDataRecord[];
  equipmentBrandModel: MasterDataRecord[];
  inventoryCondition: MasterDataRecord[];
  equipmentStatus: MasterDataRecord[];
  rentFrequency: MasterDataRecord[];
  depositType: MasterDataRecord[];
  landClassification: MasterDataRecord[];
  plotBoundaryType: MasterDataRecord[];
  condition: MasterDataRecord[];
  roadCategory: MasterDataRecord[];
  roadClass: MasterDataRecord[];
  numberOfLanes: MasterDataRecord[];
  surfaceType: MasterDataRecord[];
  trafficFlow: MasterDataRecord[];
  medianType: MasterDataRecord[];
  footpathAvailability: MasterDataRecord[];
  drainageSystem: MasterDataRecord[];
  streetLighting: MasterDataRecord[];
  roadMarking: MasterDataRecord[];
  trafficSignals: MasterDataRecord[];
  parkingFacility: MasterDataRecord[];
}

export interface LinkedFieldMasterBucket {
  id: string;
  fieldId: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  screenName: string;
  sectionId: string;
  sectionLabel: string;
  masterKey?: string;
  dependsOnFieldId?: string;
  parentBucketId?: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
  records: MasterDataRecord[];
}

export interface LinkedFieldMasterMeta {
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
}

export interface ConfigurationMasterContextType {
  masterData: MasterDataConfig;
  linkedFieldMasters: LinkedFieldMasterBucket[];
  getMasterDataByKey: (key: keyof MasterDataConfig) => MasterDataRecord[];
  getActiveDataByKey: (key: keyof MasterDataConfig) => MasterDataRecord[];
  getDependentData: (key: keyof MasterDataConfig, parentId: string) => MasterDataRecord[];
  addMasterData: (key: keyof MasterDataConfig, record: Omit<MasterDataRecord, 'id' | 'createdDate'>) => void;
  updateMasterData: (key: keyof MasterDataConfig, id: number, record: Partial<MasterDataRecord>) => void;
  deleteMasterData: (key: keyof MasterDataConfig, id: number) => void;
  toggleActiveStatus: (key: keyof MasterDataConfig, id: number) => void;
  refreshMasterData: () => void;
  ensureLinkedFieldMaster: (meta: LinkedFieldMasterMeta) => LinkedFieldMasterBucket;
  ensureLinkedFieldMasters: (metas: LinkedFieldMasterMeta[]) => LinkedFieldMasterBucket[];
  getLinkedFieldMasterByFieldId: (fieldId: string) => LinkedFieldMasterBucket | null;
  getLinkedFieldMasterById: (bucketId: string) => LinkedFieldMasterBucket | null;
  getLinkedFieldMasterRecords: (bucketId: string) => MasterDataRecord[];
  addLinkedFieldMasterRecord: (bucketId: string, record: Omit<MasterDataRecord, 'id' | 'createdDate'>) => void;
  updateLinkedFieldMasterRecord: (bucketId: string, id: number, record: Partial<MasterDataRecord>) => void;
  deleteLinkedFieldMasterRecord: (bucketId: string, id: number) => void;
  toggleLinkedFieldMasterRecordStatus: (bucketId: string, id: number) => void;
  toggleLinkedFieldMasterStatus: (bucketId: string) => void;
  deleteLinkedFieldMaster: (bucketId: string) => void;
  getOrphanMasterIds: () => string[];
}

export interface MasterConfig {
  id: keyof MasterDataConfig | 'inventoryMaster';
  label: string;
  icon: React.ElementType;
  color: string;
  fields: FieldConfig[];
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
}

export interface ConfigurationMasterProps {
  initialScreenConfigs?: ScreenConfig[];
}

export type GroupedScreenField = ScreenField & {
  sourceSectionId?: string;
  sourceSectionLabel?: string;
  sourceScreenName?: string;
  sourceScreenId?: string;
};

export type FieldRow = ScreenField & {
  sourceSectionId?: string;
  sourceSectionLabel?: string;
  sourceScreenName?: string;
  sourceScreenId?: string;
};

export interface ScreenFieldsMasterProps {
  onManageData?: (field: GroupedScreenField) => void;
  initialScreenConfigs?: ScreenConfig[];
  ensureLinkedFieldMasters: (metas: LinkedFieldMasterMeta[]) => LinkedFieldMasterBucket[];
  deleteLinkedFieldMaster: (bucketId: string) => void;
  getLinkedFieldMasterByFieldId: (fieldId: string) => LinkedFieldMasterBucket | null;
}

export interface FieldListProps {
  fields: FieldRow[];
  groupedFieldCount?: number;
  variantCount?: number;
  onAddField: () => void;
  onEditField: (field: FieldRow) => void;
  onDeleteField: (fieldId: string, sourceSectionId?: string) => void;
  onToggleFieldStatus: (fieldId: string, sourceSectionId?: string) => void;
  onReorderField: (fieldId: string, direction: 'up' | 'down', sourceSectionId?: string) => void;
  onManageData?: (field: FieldRow) => void;
  sectionName?: string;
}

export interface ScreenListProps {
  screens: ScreenConfig[];
  selectedScreenId: string | null;
  onScreenSelect: (screenId: string) => void;
}

export interface SectionListProps {
  sections: ScreenSection[];
  selectedSectionId: string | null;
  onSectionSelect: (sectionId: string) => void;
  onAddSection: () => void;
  screenName?: string;
}

export interface SectionGroup {
  groupLabel: string;
  sections: ScreenSection[];
  fieldsCount: number;
  firstOrder: number;
}

export interface InlineMultiSelectOption {
  label: string;
  value: string;
}

export interface InlineMultiSelectProps {
  label?: string;
  options: InlineMultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export interface FieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: ScreenField) => void;
  existingField?: ScreenField | null;
  maxOrder: number;
  availableFields?: ScreenField[];
  onManageData?: (field: ScreenField) => void;
}
