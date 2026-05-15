"use client";

import React from "react";
import { AssetCategoryType } from "./AssetCategoryType";
import { useAssetForm } from "../AssetFormContext";

export default function IdentificationPage() {
  const { formData, handleInputChange } = useAssetForm();

  return (
    <div className="flex items-center justify-center min-h-[50vh] animate-in fade-in zoom-in duration-500">
      <AssetCategoryType formData={formData} onChange={handleInputChange} />
    </div>
  );
}
