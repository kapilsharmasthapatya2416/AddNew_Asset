import { useState } from 'react';
import { PropertyBasicDetailsApiItem } from '@/types/property-basic-details.types';
import { PropertySocietyDetailsApiItem } from '@/types/property-society-details.types';

export const usePropertyFormState = (propertyData: PropertyBasicDetailsApiItem | null, propertySocietyDetails: PropertySocietyDetailsApiItem | null) => {
    const [propertyTypeId, setPropertyTypeId] = useState(propertyData?.propertyTypeId?.toString() ?? '');
    const [categoryId, setCategoryId] = useState(propertyData?.categoryId?.toString() ?? '');

    const initialWingId = (propertyData?.wingId && propertyData.wingId !== 0)
        ? propertyData.wingId.toString()
        : (propertySocietyDetails?.wingId?.toString() ?? '');

    const initialWingName = (propertyData?.wingName && propertyData.wingName.trim() !== "")
        ? propertyData.wingName
        : (propertySocietyDetails?.wingName ?? '');

    const [wingId, setWingId] = useState(initialWingId);
    const [wingName, setWingName] = useState(initialWingName);
    const [hasChanges, setHasChanges] = useState(false);

    return {
        propertyTypeId,
        setPropertyTypeId,
        categoryId,
        setCategoryId,
        wingId,
        setWingId,
        wingName,
        setWingName,
        hasChanges,
        setHasChanges,
        initialWingId,
    };
};
