"use client";

import { BuildingIcon } from "lucide-react";
import { CancelButton, SaveButton, Input, Select, TextArea, Drawer } from "@/components/common";
// We reuse the basic components from construction-type-master where appropriate, or we can inline standard sections since we're replicating.
// Actually, let's just write them inline or reference simple custom components to keep it precise.
import { StatusToggleSection } from "../../property-tax/construction-type-master/components/StatusToggleSection";
import { ValidationSection } from "../../property-tax/construction-type-master/components/ValidationSection";
import { Office } from "@/types/office.types";
import { useOfficeForm } from "@/hooks/useOfficeForm";

export interface OfficeFormProps {
  officeId: number | null;
  initialData?: Office;
}

export default function OfficeForm({
  officeId,
  initialData,
}: OfficeFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    isActive,
    open,
    handleChange,
    handleBlur,
    handleSubmit,
    handleToggleStatus,
    handleCancel,
    showError,
    t,
    tCommon,
    isEdit,
  } = useOfficeForm({
    officeId,
    initialData,
    onSuccess: () => {},
    onCancel: () => {},
  });

  return (
    <Drawer
      open={open}
      onClose={handleCancel}
      className="border-l-4 border-[#4F6A94]"
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-linear-to-br from-blue-500 to-blue-600 rounded-lg text-white">
            <BuildingIcon size={20} />
          </div>
          <div>
            <div className="text-lg font-bold text-blue-900">
              {isEdit ? t("form.editTitle") || "Edit Office" : t("form.addTitle") || "Add Office"}
            </div>
            <div className="text-sm text-slate-500">
              {isEdit ? t("form.editSubtitle") || "Update details" : t("form.subtitle") || "Create a new office"}
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
            label={isEdit ? t("form.actions.update") || "Update" : t("form.actions.save") || "Save"}
            type="submit"
            form="form"
            isLoading={isSubmitting}
          />
        </>
      }
    >
      <form id="form" onSubmit={handleSubmit} className="space-y-6 bg-[#F8FAFF] p-5">
        <StatusToggleSection
          isEdit={isEdit}
          isActive={isActive}
          handleToggleStatus={handleToggleStatus}
          error={errors.isActive}
          t={t as (key: string) => string}
          tCommon={tCommon as (key: string) => string}
        />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 dark:bg-slate-800/10 dark:border-slate-800">
            <h3 className="font-semibold text-slate-800">{t("form.detailsSection") || "Office Details"}</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Office Code"
                required
                name="officeCode"
                value={formData.officeCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={showError("officeCode") ? errors.officeCode : undefined}
                placeholder="e.g. ZON01"
              />

              <Input
                label="Office Name"
                required
                name="officeName"
                value={formData.officeName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={showError("officeName") ? errors.officeName : undefined}
                placeholder="Enter office name"
              />

              <Select
                label="Type"
                value={formData.type || ""}
                onChange={(value) => handleChange({ target: { name: "type", value } } as React.ChangeEvent<HTMLSelectElement>)}
                options={[
                  { label: "Main Office", value: "Main Office" },
                  { label: "Zonal Office", value: "Zonal Office" },
                  { label: "Department Office", value: "Department Office" },
                  { label: "Ward Office", value: "Ward Office" },
                  { label: "Sub Office", value: "Sub Office" },
                  { label: "Head Office", value: "Head Office" },
                ]}
                placeholder="Select Type"
              />

              <Input
                type="email"
                label="Email ID"
                name="emailId"
                value={formData.emailId || ""}
                onChange={handleChange}
                placeholder="test@example.com"
              />

              <Input
                type="tel"
                label="Phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Phone number"
              />
              
              <Input
                label="City"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                placeholder="Enter city"
              />

              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode || ""}
                onChange={handleChange}
                placeholder="6-digit pincode"
              />

              <Input
                type="date"
                label="Established Date"
                name="establishedDate"
                value={formData.establishedDate ? formData.establishedDate.split("T")[0] : ""}
                onChange={handleChange}
              />

              <Input
                type="number"
                label={t("form.fields.officeIncharge.label") || "Office Incharge"}
                name="officeIncharge"
                value={formData.officeIncharge ? String(formData.officeIncharge) : ""}
                onChange={handleChange}
                placeholder={t("form.fields.officeIncharge.placeholder") || "Enter Incharge ID"}
              />

              <Input
                type="number"
                label={t("form.fields.designationMasterId.label") || "Designation"}
                name="designationMasterId"
                value={formData.designationMasterId ? String(formData.designationMasterId) : ""}
                onChange={handleChange}
                placeholder={t("form.fields.designationMasterId.placeholder") || "Enter Designation ID"}
              />
            </div>

            <TextArea
              label="Address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Full office address..."
              rows={3}
            />
          </div>
        </div>

        <ValidationSection tCommon={tCommon as (key: string) => string} />
      </form>
    </Drawer>
  );
}
