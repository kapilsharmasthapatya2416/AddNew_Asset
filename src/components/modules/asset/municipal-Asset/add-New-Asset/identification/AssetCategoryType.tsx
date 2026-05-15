"use client";

import React from "react";
import { Select, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { ClipboardList, Search } from "lucide-react";

import { AssetWizardStepProps } from "@/types/asset-wizard.types";
import { HARDCODED_ASSET_DATA } from "../constants";

export function AssetCategoryType({ formData, onChange }: AssetWizardStepProps) {
  const categoryOptions = Object.entries(HARDCODED_ASSET_DATA).map(([key, data]: [string, any]) => ({
    label: data.label,
    value: key,
  }));

  const typeOptions = formData.category && HARDCODED_ASSET_DATA[formData.category]
    ? Object.entries(HARDCODED_ASSET_DATA[formData.category].types).map(([key, data]: [string, any]) => ({
        label: data.label,
        value: key,
      }))
    : [];

  return (
    <Card variant="bordered" padding="md" className="shadow-lg border-blue-200 bg-white max-w-4xl mx-auto mt-10">
      <CardHeader className="flex flex-col items-center gap-4 text-center border-b border-blue-50 pb-6 mb-8">
        <div className="bg-blue-600 p-4 rounded-full shadow-md">
          <Search className="size-8 text-white" />
        </div>
        <div>
          <CardTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Asset Identification
          </CardTitle>
          <p className="text-slate-500 text-sm mt-1">Select the asset category and type to begin the registration process.</p>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 pb-4">
        <div className="space-y-4">
            <Select
            label="Asset Category"
            name="category"
            value={formData.category}
            onChange={onChange}
            required
            className="h-12"
            options={categoryOptions}
            />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest px-1">Primary Classification</p>
        </div>
        
        <div className="space-y-4">
            <Select
            label="Asset Type"
            name="assetType"
            value={formData.assetType}
            onChange={onChange}
            required
            className="h-12"
            options={typeOptions}
            placeholder={typeOptions.length ? "Select Type..." : "Select Category First"}
            disabled={!typeOptions.length}
            />
             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest px-1">Specialized Sub-Type</p>
        </div>
      </CardContent>

      {/* Validation Message */}
      <div className="px-8 pb-6">
        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
          formData.category && formData.assetType 
            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
            : "bg-amber-50 border-amber-100 text-amber-800"
        }`}>
          <div className={`size-2 rounded-full ${
            formData.category && formData.assetType ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
          }`} />
          <p className="text-[10px] font-black uppercase tracking-widest">
            {formData.category && formData.assetType 
              ? "Selection Complete: You can now proceed to Basic Info" 
              : "Action Required: Select Category and Type to unlock registration steps"}
          </p>
        </div>
      </div>
    </Card>
  );
}
