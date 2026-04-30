"use client";

import { Building2 } from "lucide-react";
import { Drawer } from "@/components/common/Drawer";
import { CancelButton, SaveButton } from "@/components/common";
import { StatusToggleSection } from "./components/StatusToggleSection";
import { FormFieldsSection } from "./components/FormFieldsSection";
import { ValidationSection } from "./components/ValidationSection";
import { TypeOfUseSection } from "./components/TypeOfUseSection";
import { toast } from "sonner";

import { PropertyType } from "@/types/property-type.types";
import { PropertyTypeCategory } from "@/types/property-type-category.types";
import { UseType } from "@/types/typeOfUse.types";
import { usePropertyTypeForm } from "@/hooks/usePropertyTypeForm";
import { updatePropertyTypeValidationsAction, fetchPropertyTypePagedServerAction } from "@/app/[locale]/property-tax/propertytype/action";
import React from "react";

export interface PropertyTypeFormProps {
  id: number | null;
  initialData?: PropertyType;
  categories: PropertyTypeCategory[];
  typeOfUseList: UseType[];
  initialTypeOfUseIds?: number[];
}

export default function PropertyTypeForm({
  id,
  initialData,
  categories,
  typeOfUseList,
  initialTypeOfUseIds = [],
}: PropertyTypeFormProps) {
  const {
    formData,
    searchSequenceValue,
    errors,
    isSubmitting,
    isActive,
    open,
    handleChange,
    handleBlur,
    handleCategoryChange,
    handleSubmit: originalHandleSubmit,
    handleToggleStatus,
    handleCancel,
    refreshAndClose,
    showError,
    t,
    tCommon,
    isEdit,
  } = usePropertyTypeForm({
    id,
    initialData,
    onSuccess: () => { },
    onCancel: () => { },
  });

  // --- TypeOfUse selection state ---
  const [selectedTypeOfUseIds, setSelectedTypeOfUseIds] = React.useState<Set<number>>(
    new Set(initialTypeOfUseIds)
  );

  // Handler for toggling selection
  const toggleTypeOfUse = (touId: number) => {
    setSelectedTypeOfUseIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(touId)) {
        newSet.delete(touId);
      } else {
        if (newSet.size >= 30) {
          toast.error(t("form.typeOfUseSection.maxSelection"));
          return prev;
        }
        newSet.add(touId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const newSet = new Set(selectedTypeOfUseIds);
    let attemptedToAdd = false;
    let hitCap = false;

    for (const item of typeOfUseList) {
      if (!newSet.has(item.typeOfUseId)) {
        attemptedToAdd = true;
        if (newSet.size >= 30) {
          hitCap = true;
          break;
        }
        newSet.add(item.typeOfUseId);
      }
    }

    if (attemptedToAdd && hitCap) {
      toast.warning(t("form.typeOfUseSection.selectionLimited"));
    }

    setSelectedTypeOfUseIds(newSet);
  };

  const handleClearAll = () => {
    setSelectedTypeOfUseIds(new Set());
  };

  // Enhanced submit handler that also saves type of use validations
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Submit the main property type form
    const { success } = await originalHandleSubmit(e);
    if (!success) return; // Validation failed or API error — don't proceed

    // 2. Determine the property type ID for saving validations
    let propertyTypeId = id; // For edit mode, we already have the ID

    if (!propertyTypeId) {
      // Add mode — look up the newly created record by description + type
      try {
        const searchRes = await fetchPropertyTypePagedServerAction(1, 50, formData.propertyDescription);
        const match = searchRes.items.find(
          (item) =>
            item.propertyDescription === formData.propertyDescription &&
            item.type === formData.type
        );
        if (match) {
          propertyTypeId = match.id;
        }
      } catch (err) {
        console.error("Failed to fetch new property type ID:", err);
      }
    }

    // 3. Save type of use validations
    if (propertyTypeId && selectedTypeOfUseIds.size > 0) {
      try {
        const result = await updatePropertyTypeValidationsAction(
          propertyTypeId,
          Array.from(selectedTypeOfUseIds)
        );
        if (!result.success) {
          toast.error(result.message || "Failed to save type of use validations");
        }
      } catch (error) {
        console.error("Error saving type of use validations:", error);
        toast.error("Failed to save type of use validations");
      }
    }

    // 4. Navigate away after everything is saved
    refreshAndClose();
  };

  return (
    <Drawer
      open={open}
      onClose={handleCancel}
      className="border-l-4 border-[#4F6A94]"
      width="lg"
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-linear-to-br from-blue-500 to-blue-600 rounded-lg text-white">
            <Building2 size={20} />
          </div>
          <div>
            <div className="text-lg font-bold text-blue-900">
              {isEdit ? t("form.editTitle") : t("form.addTitle")}
            </div>
            <div className="text-sm text-slate-500">
              {isEdit ? t("form.editSubtitle") : t("form.subtitle")}
            </div>
          </div>
        </div>
      }
      footer={
        <>
          <CancelButton
            label={tCommon("buttons.cancel")}
            onClick={handleCancel}
            disabled={isSubmitting}
          />
          <SaveButton
            label={isEdit ? t("form.actions.update") : t("form.actions.save")}
            type="submit"
            form="property-type-form"
            isLoading={isSubmitting}
          />
        </>
      }
    >
      <form id="property-type-form" onSubmit={handleSubmit} className="flex flex-col gap-6 h-full p-5 bg-[#F8FAFF]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1">

          {/* ================= LEFT COLUMN ================= */}
          <div className="flex flex-col gap-4 h-full">
            <StatusToggleSection
              isEdit={isEdit}
              isActive={isActive}
              handleToggleStatus={handleToggleStatus}
              error={errors.isActive}
              t={t}
              tCommon={tCommon}
            />
            <FormFieldsSection
              formData={formData}
              searchSequenceValue={searchSequenceValue}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleCategoryChange={handleCategoryChange}
              errors={errors}
              showError={showError}
              categories={categories}
              t={t}
            />
            <ValidationSection tCommon={tCommon} />
          </div>

          {/* ================= RIGHT COLUMN (Type of Use List) ================= */}
          <TypeOfUseSection
            typeOfUseList={typeOfUseList}
            selectedTypeOfUseIds={selectedTypeOfUseIds}
            onToggle={toggleTypeOfUse}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
            t={t}
          />
        </div>
      </form>
    </Drawer>
  );
}
