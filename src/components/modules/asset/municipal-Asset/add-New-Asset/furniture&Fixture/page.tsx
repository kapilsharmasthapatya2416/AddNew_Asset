"use client";

import React from "react";
import { Armchair } from "lucide-react";
import { OfficeFurniture } from "./OfficeFurniture";
import { EquipmentInventory } from "./EquipmentInventory";
import { SafetyInfrastructure } from "./SafetyInfrastructure";
import { useAssetForm } from "../AssetFormContext";

export default function FurnitureFixturePage() {
  const { formData, handleInputChange, handleToggleChange } = useAssetForm();

  const isLand = formData.category === "land";
  const isMovable = formData.category === "movable";
  const isBuilding = formData.category === "building" || formData.category === "infrastructure";

  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isBuilding && (
        <>
          <OfficeFurniture formData={formData} onChange={handleInputChange} />
          <EquipmentInventory formData={formData} onChange={handleInputChange} />
        </>
      )}

      {isMovable && (
         <EquipmentInventory formData={formData} onChange={handleInputChange} />
      )}

      {isLand && (
        <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
           <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Armchair className="size-8 text-slate-300" />
           </div>
           <h3 className="text-lg font-bold text-slate-700">No Furniture Required</h3>
           <p className="text-sm text-slate-500 max-w-xs mt-2">
             Inventory tracking for furniture and fixtures is typically not required for land assets.
           </p>
        </div>
      )}

      <SafetyInfrastructure formData={formData} onToggle={handleToggleChange} onChange={handleInputChange} />
      
      <div className="mt-8 p-4 bg-violet-50/50 rounded-xl border border-violet-100 flex items-center gap-3">
        <div className="bg-violet-600 size-2 rounded-full animate-pulse" />
        <p className="text-[10px] font-black text-violet-800 uppercase tracking-widest">
          Dynamic Inventory: Showing fields relevant to {formData.category.toUpperCase()} category
        </p>
      </div>
    </div>
  );
}
