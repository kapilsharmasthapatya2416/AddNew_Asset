// Centralized Screen Configuration Local Storage Manager
// This utility handles all screen configuration storage operations

import { ScreenConfig } from '@/types/asset.types';
import { addAssetScreenConfig } from '@/components/modules/asset/mock/addAssetScreenConfig';
import { shopDetailScreenConfig } from '@/components/modules/asset/mock/shopDetailScreenConfig';
import { migrateAllScreenConfigs, needsMigration } from './fieldIdMigration';

const STORAGE_KEY = 'mc_ems_dynamic_screen_configs';
const MIGRATION_VERSION_KEY = 'mc_ems_field_id_migration_version';
const CURRENT_MIGRATION_VERSION = '1.0.0';
const LEGACY_LAND_PROPERTY_NUMBER_FIELDS = new Set([
  'name',
  'plotNumber',
  'ctsNumber',
  'totalArea',
]);

const LEGACY_OWNERSHIP_LOCATION_FIELDS = new Set([
  'pincode',
  'latitude',
  'longitude',
]);

const getFieldStorageKey = <T extends { id?: string; fieldName: string }>(field: T, index: number): string => {
  if (field.id) {
    return `id:${field.id}`;
  }

  return `name:${field.fieldName || 'field'}:${index}`;
};

const normalizeFields = <T extends { id?: string; fieldName: string; createdDate?: string; modifiedDate?: string }>(fields: T[]): T[] => {
  const ordered = new Map<string, { field: T; order: number; timestamp: number }>();

  fields.forEach((field, index) => {
    const key = getFieldStorageKey(field, index);
    const timestamp = new Date(field.modifiedDate || field.createdDate || 0).getTime() || 0;
    const existing = ordered.get(key);

    if (!existing) {
      ordered.set(key, { field, order: index, timestamp });
      return;
    }

    if (timestamp > existing.timestamp || (timestamp === existing.timestamp && index > existing.order)) {
      ordered.set(key, {
        field: { ...existing.field, ...field },
        order: existing.order,
        timestamp,
      });
    }
  });

  return Array.from(ordered.values())
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.field);
};

const normalizeScreenConfig = (config: ScreenConfig): ScreenConfig => ({
  ...config,
  sections: config.sections.map((section) => ({
    ...section,
    fields: normalizeFields(section.fields),
  })),
});

// Storage event for real-time sync across components
export const SCREEN_CONFIG_CHANGE_EVENT = 'screenConfigChange';

/**
 * Initialize storage with default configurations if empty
 */
export const initializeStorage = (): void => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const defaultConfigs: ScreenConfig[] = [
      addAssetScreenConfig,
      shopDetailScreenConfig,
    ];
    // Apply migration to default configs
    const migratedConfigs = migrateAllScreenConfigs(defaultConfigs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedConfigs));
    localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_MIGRATION_VERSION);
  }
};

const mergeDefaultConfigs = (storedConfigs: ScreenConfig[]): ScreenConfig[] => {
  const defaults: ScreenConfig[] = [addAssetScreenConfig, shopDetailScreenConfig];
  const byName = new Map<string, ScreenConfig>();

  const sanitizeAddAssetLandSection = (config: ScreenConfig): ScreenConfig => {
    if (config.screenName !== 'AddNewMunicipalAsset') {
      return config;
    }

    return {
      ...config,
      sections: config.sections.map(section => {
        if (section.sectionName !== 'propertyNumberDetails') {
          if (section.sectionName !== 'ownershipLocationDetails') {
            return section;
          }

          return {
            ...section,
            fields: normalizeFields(section.fields.filter(field => {
              if (LEGACY_OWNERSHIP_LOCATION_FIELDS.has(field.fieldName)) {
                return false;
              }

              if (field.id && LEGACY_OWNERSHIP_LOCATION_FIELDS.has(field.id)) {
                return false;
              }

              return true;
            })),
          };
        }

        return {
          ...section,
          fields: normalizeFields(section.fields.filter(field => {
            if (LEGACY_LAND_PROPERTY_NUMBER_FIELDS.has(field.fieldName)) {
              return false;
            }

            if (field.id && LEGACY_LAND_PROPERTY_NUMBER_FIELDS.has(field.id)) {
              return false;
            }

            return true;
          })),
        };
      }),
    };
  };

  storedConfigs.forEach(config => {
    byName.set(config.screenName, normalizeScreenConfig(sanitizeAddAssetLandSection(config)));
  });

  defaults.forEach(defaultConfig => {
    const sanitizedDefaultConfig = sanitizeAddAssetLandSection(defaultConfig);
    const existingConfig = byName.get(defaultConfig.screenName);

    if (!existingConfig) {
      byName.set(defaultConfig.screenName, {
        ...sanitizedDefaultConfig,
        sections: sanitizedDefaultConfig.sections.map(section => ({
          ...section,
          fields: normalizeFields(section.fields),
        })),
      });
      return;
    }

    const sectionsByName = new Map(existingConfig.sections.map(section => [section.sectionName, section]));

    sanitizedDefaultConfig.sections.forEach(defaultSection => {
      const existingSection = sectionsByName.get(defaultSection.sectionName);

      if (!existingSection) {
        sectionsByName.set(defaultSection.sectionName, defaultSection);
        return;
      }

      const existingFieldsByKey = new Map(
        existingSection.fields.map((field, index) => [getFieldStorageKey(field, index), field])
      );

      const mergedFields = defaultSection.fields.map((defaultField, defaultIndex) => {
        const existingField = existingFieldsByKey.get(getFieldStorageKey(defaultField, defaultIndex));
        if (!existingField) {
          return defaultField;
        }

        const mergedField = { ...defaultField, ...existingField };

        // Keep schema-driven metadata from the current default config when older
        // saved configs do not define it yet.
        Object.entries(defaultField).forEach(([key, value]) => {
          if (mergedField[key as keyof typeof mergedField] === undefined) {
            (mergedField as Record<string, unknown>)[key] = value;
          }
        });

        return mergedField;
      });

      existingSection.fields.forEach((existingField, existingIndex) => {
        const key = getFieldStorageKey(existingField, existingIndex);
        if (!defaultSection.fields.some((defaultField, defaultIndex) => getFieldStorageKey(defaultField, defaultIndex) === key)) {
          mergedFields.push(existingField);
        }
      });

      sectionsByName.set(defaultSection.sectionName, {
        ...defaultSection,
        ...existingSection,
        fields: normalizeFields(mergedFields),
      });
    });

    byName.set(defaultConfig.screenName, {
      ...sanitizedDefaultConfig,
      ...existingConfig,
      sections: Array.from(sectionsByName.values()).map(section => ({
        ...section,
        fields: normalizeFields(section.fields),
      })),
    });
  });

  return Array.from(byName.values());
};

/**
 * Load all screen configurations from local storage
 */
export const loadAllScreenConfigs = (): ScreenConfig[] => {
  try {
    initializeStorage();
    const stored = localStorage.getItem(STORAGE_KEY);
    const migrationVersion = localStorage.getItem(MIGRATION_VERSION_KEY);
    
    if (stored) {
      let configs = JSON.parse(stored);
      configs = mergeDefaultConfigs(configs);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
      
      // Check if migration is needed
      if (migrationVersion !== CURRENT_MIGRATION_VERSION || configs.some((c: ScreenConfig) => needsMigration(c))) {
        console.log('🔄 Migrating field IDs to descriptive format...');
        configs = migrateAllScreenConfigs(configs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
        localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_MIGRATION_VERSION);
        console.log('✅ Field ID migration completed successfully!');
      }
      
      return configs;
    }
  } catch (error) {
    console.error('Error loading screen configs:', error);
  }
  
  // Fallback with migration applied
  return migrateAllScreenConfigs([addAssetScreenConfig, shopDetailScreenConfig]);
};

/**
 * Save all screen configurations to local storage
 */
export const saveAllScreenConfigs = (configs: ScreenConfig[]): void => {
  try {
    const normalizedConfigs = configs.map((config) => normalizeScreenConfig(config));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedConfigs));
    // Dispatch custom event for real-time sync
    window.dispatchEvent(new CustomEvent(SCREEN_CONFIG_CHANGE_EVENT, { detail: normalizedConfigs }));
  } catch (error) {
    console.error('Error saving screen configs:', error);
  }
};

/**
 * Load a specific screen configuration by ID
 */
export const loadScreenConfigById = (screenId: string): ScreenConfig | null => {
  const allConfigs = loadAllScreenConfigs();
  return allConfigs.find(config => config.id === screenId) || null;
};

/**
 * Load a specific screen configuration by screen name
 */
export const loadScreenConfigByName = (screenName: string): ScreenConfig | null => {
  const allConfigs = loadAllScreenConfigs();
  return allConfigs.find(config => config.screenName === screenName) || null;
};

/**
 * Fetch the default screen configurations (used on the server before localStorage is available)
 */
export const getDefaultScreenConfigs = (): ScreenConfig[] => {
  return migrateAllScreenConfigs([addAssetScreenConfig, shopDetailScreenConfig]);
};

/**
 * Update a specific screen configuration
 */
export const updateScreenConfig = (screenId: string, updatedConfig: ScreenConfig): void => {
  const allConfigs = loadAllScreenConfigs();
  const index = allConfigs.findIndex(config => config.id === screenId);
  
  if (index !== -1) {
    allConfigs[index] = {
      ...updatedConfig,
      modifiedDate: new Date().toISOString(),
    };
    saveAllScreenConfigs(allConfigs);
  }
};

/**
 * Add a new screen configuration
 */
export const addScreenConfig = (newConfig: ScreenConfig): void => {
  const allConfigs = loadAllScreenConfigs();
  allConfigs.push({
    ...newConfig,
    createdDate: new Date().toISOString(),
  });
  saveAllScreenConfigs(allConfigs);
};

/**
 * Delete a screen configuration
 */
export const deleteScreenConfig = (screenId: string): void => {
  const allConfigs = loadAllScreenConfigs();
  const filtered = allConfigs.filter(config => config.id !== screenId);
  saveAllScreenConfigs(filtered);
};

/**
 * Subscribe to screen configuration changes
 */
export const subscribeToConfigChanges = (callback: (configs: ScreenConfig[]) => void): () => void => {
  const handler = (event: CustomEvent) => {
    callback(event.detail);
  };
  
  window.addEventListener(SCREEN_CONFIG_CHANGE_EVENT, handler as EventListener);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener(SCREEN_CONFIG_CHANGE_EVENT, handler as EventListener);
  };
};

/**
 * Reset storage to default configurations
 */
export const resetToDefaults = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  initializeStorage();
  const configs = loadAllScreenConfigs();
  window.dispatchEvent(new CustomEvent(SCREEN_CONFIG_CHANGE_EVENT, { detail: configs }));
};

/**
 * Export configurations as JSON (for backup)
 */
export const exportConfigs = (): string => {
  const configs = loadAllScreenConfigs();
  return JSON.stringify(configs, null, 2);
};

/**
 * Import configurations from JSON
 */
export const importConfigs = (jsonString: string): boolean => {
  try {
    const configs = JSON.parse(jsonString);
    if (Array.isArray(configs)) {
      saveAllScreenConfigs(configs);
      return true;
    }
  } catch (error) {
    console.error('Error importing configs:', error);
  }
  return false;
};
