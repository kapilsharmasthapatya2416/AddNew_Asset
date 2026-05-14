import type { MasterDataRecord } from '@/types/asset.types';

export const inferAssetTypeCategory = (
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
