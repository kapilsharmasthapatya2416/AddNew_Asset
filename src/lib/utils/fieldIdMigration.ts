// Field ID Migration Utility
// Converts old numbered field IDs (field_a_001) to descriptive IDs (field_category)

import { ScreenConfig } from '../data/types/screenFields';

/**
 * Migrates field IDs from old numbered format to new descriptive format
 * Old: field_a_001, field_b_002, etc.
 * New: field_category, field_assetType, etc. (based on fieldName)
 */
export const migrateFieldIds = (screenConfig: ScreenConfig): ScreenConfig => {
  // Create a mapping of old IDs to new IDs
  const idMapping: Record<string, string> = {};

  // First pass: Create the mapping
  screenConfig.sections.forEach((section) => {
    section.fields.forEach((field) => {
      const newId = `field_${field.fieldName}`;
      idMapping[field.id] = newId;
    });
  });

  // Second pass: Update all field IDs and conditional display references
  const migratedConfig: ScreenConfig = {
    ...screenConfig,
    sections: screenConfig.sections.map((section) => ({
      ...section,
      // Update conditional display in sections
      conditionalDisplay: section.conditionalDisplay?.map((rule) => ({
        ...rule,
        fieldId: idMapping[rule.fieldId] || rule.fieldId,
      })),
      fields: section.fields.map((field) => ({
        ...field,
        // Update field ID
        id: idMapping[field.id] || field.id,
        // Update conditional display in fields
        conditionalDisplay: field.conditionalDisplay?.map((rule) => ({
          ...rule,
          fieldId: idMapping[rule.fieldId] || rule.fieldId,
        })),
      })),
    })),
  };

  return migratedConfig;
};

/**
 * Check if a screen config uses old numbered IDs
 */
export const needsMigration = (screenConfig: ScreenConfig): boolean => {
  return screenConfig.sections.some((section) =>
    section.fields.some((field) => {
      // Check if ID follows old pattern (field_a_001, field_b_002, etc.)
      return /^field_[a-z]+_\d+[a-z]?$/.test(field.id);
    })
  );
};

/**
 * Migrate all screen configurations
 */
export const migrateAllScreenConfigs = (
  configs: ScreenConfig[]
): ScreenConfig[] => {
  return configs.map((config) => {
    if (needsMigration(config)) {
      console.log(`Migrating screen config: ${config.displayName}`);
      return migrateFieldIds(config);
    }
    return config;
  });
};
