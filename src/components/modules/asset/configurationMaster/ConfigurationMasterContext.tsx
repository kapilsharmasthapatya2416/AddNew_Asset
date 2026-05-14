'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { loadAllScreenConfigs, saveAllScreenConfigs } from '@/lib/utils/screenConfigStorage';
import {
  STATIC_SUPPORT_MASTER_DATA,
  STATIC_SUPPORT_MASTER_KEYS,
  getDefaultMasterData,
} from '@/components/modules/asset/mock/masterData';
import type {
  MasterDataConfig,
  MasterDataRecord,
  LinkedFieldMasterBucket,
  LinkedFieldMasterMeta,
  ConfigurationMasterContextType,
} from '@/types/asset.types';

const STORAGE_KEY = 'mc_ems_configuration_master_data';
const CHANGE_EVENT = 'configurationMasterChange';
const LINKED_FIELD_MASTERS_STORAGE_KEY = 'mc_ems_linked_field_masters';
const LINKED_FIELD_MASTERS_CHANGE_EVENT = 'linkedFieldMastersChange';

const inferAssetTypeCategory = (
  record: Pick<MasterDataRecord, 'name' | 'description'>,
  availableCategories: string[]
): string | undefined => {
  const searchable = `${record.name} ${record.description || ''}`.toLowerCase();
  const categoryKeywordMap: Array<{ category: string; keywords: string[] }> = [
    {
      category: 'Building',
      keywords: [
        'building',
        'office',
        'complex',
        'market',
        'quarters',
        'housing',
        'hall',
        'school',
        'hospital',
        'ward office',
        'library',
        'fire station',
        'sports complex',
        'toilet',
        'residential',
        'commercial building',
        'public housing',
        'community hall',
      ],
    },
    {
      category: 'Land',
      keywords: [
        'land',
        'plot',
        'garden',
        'park',
        'vacant',
        'playground',
        'open ground',
        'reserved',
        'parking plot',
        'burial',
        'crematorium',
      ],
    },
    {
      category: 'Infrastructure',
      keywords: [
        'road',
        'bridge',
        'water tank',
        'drainage',
        'street light',
        'water supply',
        'supply line',
        'sewage',
        'well',
        'bus stop',
        'shelter',
        'subway',
        'utility',
        'infrastructure',
      ],
    },
    {
      category: 'Movable',
      keywords: [
        'vehicle',
        'machinery',
        'equipment',
        'furniture',
        'computer',
        'tool',
        'it equipment',
        'monitor',
        'generator',
        'mobile',
        'movable',
      ],
    },
  ];

  for (const { category, keywords } of categoryKeywordMap) {
    if (availableCategories.includes(category) && keywords.some((keyword) => searchable.includes(keyword))) {
      return category;
    }
  }

  const exactCategoryName = availableCategories.find((category) => category.toLowerCase() === record.name.toLowerCase());
  return exactCategoryName;
};

const normalizeAssetTypeMappings = (data: MasterDataConfig): MasterDataConfig => {
  const availableCategories = (data.assetCategory || []).map((category) => category.name);
  let changed = false;

  const assetType = (data.assetType || []).map((record) => {
    const hasValidMapping = record.parentCategory && availableCategories.includes(record.parentCategory);
    if (hasValidMapping) {
      return record;
    }

    const inferredCategory = inferAssetTypeCategory(record, availableCategories);
    if (!inferredCategory) {
      return record;
    }

    changed = true;
    return {
      ...record,
      parentCategory: inferredCategory,
      modifiedDate: new Date().toISOString(),
    };
  });

  return changed ? { ...data, assetType } : data;
};

const mergeWithDefaultMasterData = (storedData: Partial<MasterDataConfig>): MasterDataConfig => {
  const defaults = getDefaultMasterData();
  return Object.keys(defaults).reduce((acc, key) => {
    const typedKey = key as keyof MasterDataConfig;
    const storedValue = storedData[typedKey];
    acc[typedKey] = Array.isArray(storedValue) && storedValue.length > 0 ? storedValue : defaults[typedKey];
    return acc;
  }, {} as MasterDataConfig);
};

const stripStaticSupportMasters = (data: MasterDataConfig): MasterDataConfig => {
  const sanitized = { ...data };
  STATIC_SUPPORT_MASTER_KEYS.forEach((key) => {
    sanitized[key] = [];
  });
  return sanitized;
};

const normalizeLinkedFieldMasters = (buckets: LinkedFieldMasterBucket[]): LinkedFieldMasterBucket[] =>
  (buckets || []).map((bucket) => ({
    ...bucket,
    isActive: bucket.isActive ?? true,
    records: Array.isArray(bucket.records) ? bucket.records : [],
  }));

const loadMasterData = (): MasterDataConfig => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaults = stripStaticSupportMasters(getDefaultMasterData());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  try {
    const parsed = mergeWithDefaultMasterData(JSON.parse(stored) as Partial<MasterDataConfig>);
    const normalized = stripStaticSupportMasters(normalizeAssetTypeMappings(parsed));
    if (JSON.stringify(normalized) !== stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch (error) {
    console.error('Error loading master data:', error);
    const defaults = stripStaticSupportMasters(getDefaultMasterData());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
};

const persistMasterData = (data: MasterDataConfig): MasterDataConfig => {
  const sanitized = stripStaticSupportMasters(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: sanitized }));
  return sanitized;
};

const loadLinkedFieldMasters = (): LinkedFieldMasterBucket[] => {
  try {
    const stored = localStorage.getItem(LINKED_FIELD_MASTERS_STORAGE_KEY);
    if (!stored) return [];
    return normalizeLinkedFieldMasters(JSON.parse(stored) as LinkedFieldMasterBucket[]);
  } catch (error) {
    console.error('Error loading linked field masters:', error);
    return [];
  }
};

const persistLinkedFieldMasters = (buckets: LinkedFieldMasterBucket[]): LinkedFieldMasterBucket[] => {
  const normalized = normalizeLinkedFieldMasters(buckets);
  localStorage.setItem(LINKED_FIELD_MASTERS_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(LINKED_FIELD_MASTERS_CHANGE_EVENT, { detail: normalized }));
  return normalized;
};

export const useConfigurationMasterState = (): ConfigurationMasterContextType => {
  const [masterData, setMasterData] = useState<MasterDataConfig>(stripStaticSupportMasters(getDefaultMasterData()));
  const [linkedFieldMasters, setLinkedFieldMasters] = useState<LinkedFieldMasterBucket[]>([]);
  const linkedRef = useRef(linkedFieldMasters);

  useEffect(() => {
    setMasterData(loadMasterData());
  }, []);

  useEffect(() => {
    setLinkedFieldMasters(loadLinkedFieldMasters());
  }, []);

  useEffect(() => {
    linkedRef.current = linkedFieldMasters;
  }, [linkedFieldMasters]);

  useEffect(() => {
    const handler = (event: CustomEvent) => {
      setMasterData(stripStaticSupportMasters(event.detail as MasterDataConfig));
    };
    const bucketHandler = (event: CustomEvent) => {
      setLinkedFieldMasters(normalizeLinkedFieldMasters(event.detail as LinkedFieldMasterBucket[]));
    };
    window.addEventListener(CHANGE_EVENT, handler as EventListener);
    window.addEventListener(LINKED_FIELD_MASTERS_CHANGE_EVENT, bucketHandler as EventListener);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler as EventListener);
      window.removeEventListener(LINKED_FIELD_MASTERS_CHANGE_EVENT, bucketHandler as EventListener);
    };
  }, []);

  const getMasterDataByKey = useCallback(
    (key: keyof MasterDataConfig): MasterDataRecord[] => {
      if (STATIC_SUPPORT_MASTER_KEYS.has(key)) {
        return (STATIC_SUPPORT_MASTER_DATA[key] || []) as MasterDataRecord[];
      }
      return masterData[key] || [];
    },
    [masterData]
  );

  const getActiveDataByKey = useCallback(
    (key: keyof MasterDataConfig): MasterDataRecord[] => {
      return getMasterDataByKey(key).filter((item) => item.isActive);
    },
    [getMasterDataByKey]
  );

  const getDependentData = useCallback(
    (key: keyof MasterDataConfig, parentId: string) => {
      return getMasterDataByKey(key).filter((item) => item.parentCategory === parentId && item.isActive);
    },
    [getMasterDataByKey]
  );

  const addMasterData = useCallback(
    (key: keyof MasterDataConfig, record: Omit<MasterDataRecord, 'id' | 'createdDate'>) => {
      if (STATIC_SUPPORT_MASTER_KEYS.has(key)) return;
      setMasterData((prev) => {
        const current = prev[key] || [];
        const maxId = current.reduce((max, item) => Math.max(max, item.id), 0);
        const normalizedParent = key === 'assetType' ? record.parentCategory || inferAssetTypeCategory(record, prev.assetCategory.map((cat) => cat.name)) : record.parentCategory;
        const next: MasterDataRecord = {
          ...record,
          parentCategory: normalizedParent,
          id: maxId + 1,
          createdDate: new Date().toISOString(),
        };
        const updated = {
          ...prev,
          [key]: [...current, next],
        };
        return persistMasterData(updated);
      });
    },
    []
  );

  const updateMasterData = useCallback(
    (key: keyof MasterDataConfig, id: number, record: Partial<MasterDataRecord>) => {
      if (STATIC_SUPPORT_MASTER_KEYS.has(key)) return;
      setMasterData((prev) => {
        const current = prev[key] || [];
        const updated = {
          ...prev,
          [key]: current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...record,
                  parentCategory: key === 'assetType' ? record.parentCategory || item.parentCategory || inferAssetTypeCategory({ name: item.name, description: item.description }, prev.assetCategory.map((cat) => cat.name)) : item.parentCategory,
                  modifiedDate: new Date().toISOString(),
                }
              : item
          ),
        };
        return persistMasterData(updated);
      });
    },
    []
  );

  const deleteMasterData = useCallback(
    (key: keyof MasterDataConfig, id: number) => {
      if (STATIC_SUPPORT_MASTER_KEYS.has(key)) return;
      setMasterData((prev) => {
        const updated = {
          ...prev,
          [key]: (prev[key] || []).filter((item) => item.id !== id),
        };
        return persistMasterData(updated);
      });
    },
    []
  );

  const toggleActiveStatus = useCallback(
    (key: keyof MasterDataConfig, id: number) => {
      if (STATIC_SUPPORT_MASTER_KEYS.has(key)) return;
      setMasterData((prev) => {
        const updated = {
          ...prev,
          [key]: (prev[key] || []).map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive, modifiedDate: new Date().toISOString() } : item
          ),
        };
        return persistMasterData(updated);
      });
    },
    []
  );

  const refreshMasterData = useCallback(() => {
    setMasterData(loadMasterData());
  }, []);

  const getLinkedFieldMasterByFieldId = useCallback(
    (fieldId: string) => linkedFieldMasters.find((bucket) => bucket.fieldId === fieldId) || null,
    [linkedFieldMasters]
  );

  const getLinkedFieldMasterById = useCallback(
    (id: string) => linkedFieldMasters.find((bucket) => bucket.id === id) || null,
    [linkedFieldMasters]
  );

  const commitLinkedFieldMasters = useCallback((buckets: LinkedFieldMasterBucket[]) => {
    const normalized = persistLinkedFieldMasters(buckets);
    setLinkedFieldMasters(normalized);
    return normalized;
  }, []);

  const ensureLinkedFieldMasters = useCallback(
    (metas: LinkedFieldMasterMeta[]) => {
      let updated = [...linkedFieldMasters];
      let changed = false;
      metas.forEach((meta) => {
        const existing = updated.find((bucket) => bucket.fieldId === meta.fieldId);
        if (existing) return;
        const newBucket: LinkedFieldMasterBucket = {
          id: `linked_${meta.fieldId}`,
          fieldId: meta.fieldId,
          fieldName: meta.fieldName,
          fieldLabel: meta.fieldLabel,
          fieldType: meta.fieldType,
          screenName: meta.screenName,
          sectionId: meta.sectionId,
          sectionLabel: meta.sectionLabel,
          masterKey: meta.masterKey,
          dependsOnFieldId: meta.dependsOnFieldId,
          parentBucketId: undefined,
          records: (meta.seedOptions || []).map((opt, idx) => ({
            id: Date.now() + idx,
            code: opt.value,
            name: opt.label,
            description: opt.label,
            isActive: true,
            createdDate: new Date().toISOString(),
          })),
          isActive: true,
          createdDate: new Date().toISOString(),
        };
        updated.push(newBucket);
        changed = true;
      });
      if (changed) {
        return commitLinkedFieldMasters(updated);
      }
      return updated;
    },
    [linkedFieldMasters, commitLinkedFieldMasters]
  );

  const ensureLinkedFieldMaster = useCallback(
    (meta: LinkedFieldMasterMeta) => {
      const existing = linkedFieldMasters.find((bucket) => bucket.fieldId === meta.fieldId);
      if (existing) return existing;
      const updated = [
        ...linkedFieldMasters,
        {
          id: `linked_${meta.fieldId}`,
          fieldId: meta.fieldId,
          fieldName: meta.fieldName,
          fieldLabel: meta.fieldLabel,
          fieldType: meta.fieldType,
          screenName: meta.screenName,
          sectionId: meta.sectionId,
          sectionLabel: meta.sectionLabel,
          masterKey: meta.masterKey,
          dependsOnFieldId: meta.dependsOnFieldId,
          parentBucketId: undefined,
          records: (meta.seedOptions || []).map((opt, idx) => ({
            id: Date.now() + idx,
            code: opt.value,
            name: opt.label,
            description: opt.label,
            isActive: true,
            createdDate: new Date().toISOString(),
          })),
          isActive: true,
          createdDate: new Date().toISOString(),
        },
      ];
      const normalized = commitLinkedFieldMasters(updated);
      return normalized.find((bucket) => bucket.fieldId === meta.fieldId)!;
    },
    [linkedFieldMasters, commitLinkedFieldMasters]
  );

  const getLinkedFieldMasterRecords = useCallback(
    (bucketId: string) => getLinkedFieldMasterById(bucketId)?.records || [],
    [getLinkedFieldMasterById]
  );

  const updateBucketRecords = useCallback(
    (bucketId: string, updater: (bucket: LinkedFieldMasterBucket) => LinkedFieldMasterBucket) => {
      const updated = linkedFieldMasters.map((bucket) => (bucket.id === bucketId ? updater(bucket) : bucket));
      return commitLinkedFieldMasters(updated);
    },
    [linkedFieldMasters, commitLinkedFieldMasters]
  );

  const addLinkedFieldMasterRecord = useCallback(
    (bucketId: string, record: Omit<MasterDataRecord, 'id' | 'createdDate'>) => {
      updateBucketRecords(bucketId, (bucket) => {
        const maxId = Math.max(0, ...bucket.records.map((item) => item.id));
        return {
          ...bucket,
          records: [
            ...bucket.records,
            {
              ...record,
              id: maxId + 1,
              createdDate: new Date().toISOString(),
            },
          ],
          modifiedDate: new Date().toISOString(),
        };
      });
    },
    [updateBucketRecords]
  );

  const updateLinkedFieldMasterRecord = useCallback(
    (bucketId: string, id: number, record: Partial<MasterDataRecord>) => {
      updateBucketRecords(bucketId, (bucket) => ({
        ...bucket,
        records: bucket.records.map((item) =>
          item.id === id ? { ...item, ...record, modifiedDate: new Date().toISOString() } : item
        ),
        modifiedDate: new Date().toISOString(),
      }));
    },
    [updateBucketRecords]
  );

  const deleteLinkedFieldMasterRecord = useCallback(
    (bucketId: string, id: number) => {
      updateBucketRecords(bucketId, (bucket) => ({
        ...bucket,
        records: bucket.records.filter((item) => item.id !== id),
        modifiedDate: new Date().toISOString(),
      }));
    },
    [updateBucketRecords]
  );

  const toggleLinkedFieldMasterRecordStatus = useCallback(
    (bucketId: string, id: number) => {
      updateBucketRecords(bucketId, (bucket) => ({
        ...bucket,
        records: bucket.records.map((item) =>
          item.id === id ? { ...item, isActive: !item.isActive, modifiedDate: new Date().toISOString() } : item
        ),
        modifiedDate: new Date().toISOString(),
      }));
    },
    [updateBucketRecords]
  );

  const toggleLinkedFieldMasterStatus = useCallback(
    (bucketId: string) => {
      updateBucketRecords(bucketId, (bucket) => ({
        ...bucket,
        isActive: !bucket.isActive,
        modifiedDate: new Date().toISOString(),
      }));
      setTimeout(() => {
        try {
          const configs = loadAllScreenConfigs();
          const updatedConfigs = configs.map((screen) => ({
            ...screen,
            sections: screen.sections.map((section) => ({
              ...section,
              fields: section.fields.map((field) =>
                field.linkedMasterId === bucketId ? { ...field, isActive: !field.isActive } : field
              ),
            })),
          }));
          saveAllScreenConfigs(updatedConfigs);
        } catch (error) {
          console.error('Error syncing linked master status', error);
        }
      }, 0);
    },
    [updateBucketRecords]
  );

  const deleteLinkedFieldMaster = useCallback(
    (bucketId: string) => {
      const updated = linkedFieldMasters.filter((bucket) => bucket.id !== bucketId);
      commitLinkedFieldMasters(updated);
      setTimeout(() => {
        try {
          const configs = loadAllScreenConfigs();
          const updatedConfigs = configs.map((screen) => ({
            ...screen,
            sections: screen.sections.map((section) => ({
              ...section,
              fields: section.fields.filter((field) => field.linkedMasterId !== bucketId),
            })),
          }));
          saveAllScreenConfigs(updatedConfigs);
        } catch (error) {
          console.error('Error syncing linked master delete', error);
        }
      }, 0);
    },
    [linkedFieldMasters, commitLinkedFieldMasters]
  );

  const getOrphanMasterIds = useCallback(() => {
    const activeIds = new Set<string>();
    loadAllScreenConfigs().forEach((screen) => {
      screen.sections.forEach((section) => {
        section.fields.forEach((field) => {
          if (['dropdown', 'select', 'radio', 'multiselect'].includes(field.fieldType)) {
            activeIds.add(field.id);
          }
        });
      });
    });
    return linkedFieldMasters.filter((bucket) => !activeIds.has(bucket.fieldId)).map((bucket) => bucket.id);
  }, [linkedFieldMasters]);

  const contextValue = useMemo(
    () => ({
      masterData,
      linkedFieldMasters,
      getMasterDataByKey,
      getActiveDataByKey,
      getDependentData,
      addMasterData,
      updateMasterData,
      deleteMasterData,
      toggleActiveStatus,
      refreshMasterData,
      ensureLinkedFieldMaster,
      ensureLinkedFieldMasters,
      getLinkedFieldMasterByFieldId,
      getLinkedFieldMasterById,
      getLinkedFieldMasterRecords,
      addLinkedFieldMasterRecord,
      updateLinkedFieldMasterRecord,
      deleteLinkedFieldMasterRecord,
      toggleLinkedFieldMasterRecordStatus,
      toggleLinkedFieldMasterStatus,
      deleteLinkedFieldMaster,
      getOrphanMasterIds,
    }),
    [
      masterData,
      linkedFieldMasters,
      getMasterDataByKey,
      getActiveDataByKey,
      getDependentData,
      addMasterData,
      updateMasterData,
      deleteMasterData,
      toggleActiveStatus,
      refreshMasterData,
      ensureLinkedFieldMaster,
      ensureLinkedFieldMasters,
      getLinkedFieldMasterByFieldId,
      getLinkedFieldMasterById,
      getLinkedFieldMasterRecords,
      addLinkedFieldMasterRecord,
      updateLinkedFieldMasterRecord,
      deleteLinkedFieldMasterRecord,
      toggleLinkedFieldMasterRecordStatus,
      toggleLinkedFieldMasterStatus,
      deleteLinkedFieldMaster,
      getOrphanMasterIds,
    ]
  );

  return contextValue;
};
