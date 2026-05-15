"use client";

import React, { useEffect } from "react";
import { AssetValuation } from "./AssetValuation";
import { TaxationDetails } from "./TaxationDetails";
import { useAssetForm } from "../AssetFormContext";

export default function ValuationPage() {
  const { formData, handleInputChange, updateFormData } = useAssetForm();

  useEffect(() => {
    // For new registrations, we initialize Capital Value with Gross Value
    if (formData.grossValue && formData.grossValue !== formData.capitalValue) {
      updateFormData({ capitalValue: formData.grossValue });
    }
  }, [formData.grossValue, formData.capitalValue, updateFormData]);

  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AssetValuation formData={formData} onChange={handleInputChange} />
      < TaxationDetails formData={formData} onChange={handleInputChange} />
      
      <div className="mt-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center gap-3">
        <div className="bg-emerald-600 size-2 rounded-full animate-pulse" />
        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">
          Financial Summary: Total capital value calculated based on current market rates
        </p>
      </div>
    </div>
  );
}
