"use client";

import React from "react";
import { Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { ClipboardList } from "lucide-react";

interface AssetIdentityProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function AssetIdentity({ formData, onChange }: AssetIdentityProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-blue-100">
      <CardHeader className="flex items-center gap-2 border-b border-blue-50 pb-3 mb-4">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <ClipboardList className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          A) Asset Identity Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Input
          label="Asset Name"
          name="assetName"
          value={formData.assetName}
          onChange={onChange}
          placeholder="e.g. Town Hall Headquarters"
          required
        />
        <Input
          label="Asset Code / ID"
          name="assetCode"
          value={formData.assetCode}
          onChange={onChange}
          placeholder="Auto-generated"
          disabled
        />
        <Input
          label="Property Number"
          name="propertyNumber"
          value={formData.propertyNumber}
          onChange={onChange}
          placeholder="e.g. MC/W12/P45"
        />
        <Input
          label="UPIC ID"
          name="upicId"
          value={formData.upicId}
          onChange={onChange}
          placeholder="Unified Property ID"
        />
      </CardContent>

      {/* Dynamic Category Specifications */}
      {(formData.category === "building" || formData.category === "movable" || formData.category === "infrastructure") && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          {formData.category === "building" && (
            <>
              <Input
                label="Built-up Area (Sq. Ft)"
                name="builtUpArea"
                value={formData.builtUpArea}
                onChange={onChange}
                type="number"
                required
              />
              <Input
                label="Total Floors"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={onChange}
                type="number"
                required
              />
              <Input
                label="Year of Construction"
                name="constructionYear"
                value={formData.constructionYear}
                onChange={onChange}
                placeholder="YYYY"
                maxLength={4}
              />
            </>
          )}
          {formData.category === "movable" && (
            <>
              <Input
                label="Make / Manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={onChange}
                placeholder="e.g. Toyota, Dell"
              />
              <Input
                label="Model Number"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={onChange}
                placeholder="e.g. Inspiron 5000"
              />
              <Input
                label="Serial / Chassis Number"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={onChange}
                placeholder="Unique ID"
                required
              />
            </>
          )}
          {formData.category === "infrastructure" && (
            <>
               <Input
                label="Infrastructure Material"
                name="infraMaterial"
                value={formData.infraMaterial}
                onChange={onChange}
                placeholder="e.g. RCC, Bitumen, Steel"
              />
               <Input
                label="Installation Year"
                name="installationYear"
                value={formData.installationYear}
                onChange={onChange}
                placeholder="YYYY"
              />
               <Input
                label="System Capacity"
                name="systemCapacity"
                value={formData.systemCapacity}
                onChange={onChange}
                placeholder="e.g. 500 KL, 100 KVA"
              />
            </>
          )}
        </div>
      )}
    </Card>
  );
}
