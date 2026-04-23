import { useCallback, useEffect, RefObject } from 'react';
import { PropertyBasicDetailsApiItem } from '@/types/property-basic-details.types';

interface UsePropertyChangesProps {
    formRef: RefObject<HTMLFormElement | null>;
    categoryId: string;
    propertyTypeId: string;
    wingId: string;
    initialWingId: string;
    propertyData: PropertyBasicDetailsApiItem | null;
    setHasChanges: (value: boolean) => void;
}

export const usePropertyChanges = ({
    formRef,
    categoryId,
    propertyTypeId,
    wingId,
    initialWingId,
    propertyData,
    setHasChanges,
}: UsePropertyChangesProps) => {
    
    const parseOptionalNumber = (value: FormDataEntryValue | null): number | null => {
        const normalized = typeof value === "string" ? value.trim() : value;
        if (normalized === null || normalized === "") return null;
        const parsed = Number(normalized);
        return Number.isNaN(parsed) ? null : parsed;
    };

    const checkFormChanges = useCallback(() => {
        if (!formRef.current) return;
        const formData = new FormData(formRef.current);
        const residentialToilets = parseOptionalNumber(formData.get("noOfResidentialToilets"));
        const commercialToilets = parseOptionalNumber(formData.get("noOfCommercialToilets"));
        const plotArea = parseOptionalNumber(formData.get("plotArea"));

        const isChanged =
            String(formData.get("plotNo") ?? "").trim() !== (propertyData?.plotNo ?? "") ||
            String(formData.get("flatOrShopNo") ?? "").trim() !== (propertyData?.flatOrShopNo ?? "") ||
            String(formData.get("surveyNo") ?? "").trim() !== (propertyData?.surveyNo ?? "") ||
            String(formData.get("subZoneNo") ?? "").trim() !== (propertyData?.subZoneNo ?? "") ||
            residentialToilets !== (propertyData?.noOfResidentialToilets ?? null) ||
            commercialToilets !== (propertyData?.noOfCommercialToilets ?? null) ||
            plotArea !== (propertyData?.plotArea ?? null) ||
            categoryId !== (propertyData?.categoryId?.toString() ?? '') ||
            propertyTypeId !== (propertyData?.propertyTypeId?.toString() ?? '') ||
            wingId !== initialWingId;

        setHasChanges(isChanged);
    }, [categoryId, propertyTypeId, wingId, initialWingId, propertyData, formRef, setHasChanges]);

    useEffect(() => {
        checkFormChanges();
    }, [checkFormChanges]);

    return { checkFormChanges };
};
