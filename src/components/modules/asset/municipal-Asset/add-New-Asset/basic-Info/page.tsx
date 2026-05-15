"use client";

import React from "react";
import { AssetIdentity } from "./AssetIdentity";
import { AssetJurisdiction } from "./AssetJurisdiction";
import { AssetContact } from "./AssetContact";
import { AssetLocationDetails } from "./AssetLocationDetails";
import { useAssetForm } from "../AssetFormContext";

export default function BasicInfoPage() {
  const { formData, handleInputChange } = useAssetForm();

  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AssetIdentity formData={formData} onChange={handleInputChange} />
      <AssetJurisdiction formData={formData} onChange={handleInputChange} />
      <AssetContact formData={formData} onChange={handleInputChange} />
      <AssetLocationDetails formData={formData} onChange={handleInputChange} />
      
      <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-3">
        <div className="bg-blue-600 size-2 rounded-full animate-pulse" />
        <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">
          Validation: 85% of mandatory basic fields completed
        </p>
      </div>
    </div>
  );
}