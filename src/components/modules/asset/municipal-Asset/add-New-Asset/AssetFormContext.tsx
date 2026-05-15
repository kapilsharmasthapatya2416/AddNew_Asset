"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

import { AssetFormData, AssetFormContextType } from "@/types/asset-wizard.types";

import { useSearchParams } from "next/navigation";

const AssetFormContext = createContext<AssetFormContextType | undefined>(undefined);

export function AssetFormProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState<AssetFormData>(() => {
    const category = searchParams.get("category") || "building";
    const assetType = searchParams.get("assetType") || "";
    
    return {
      category,
      assetType,
      assetName: "",
      assetCode: "BLD-2024-001",
      propertyNumber: "",
      upicId: "",
      zone: "",
      ward: "",
      department: "",
      status: "active",
      operationalControl: "self",
      inChargeName: "",
      inChargeDesignation: "",
      inChargeMobile: "",
      inChargeEmail: "",
      officeExtension: "",
      fullAddress: "",
      locality: "",
      landmark: "",
      pinCode: "",
      latitude: "",
      longitude: "",
      // Legal
      ownershipType: "municipal",
      acquisitionMethod: "purchase",
      possessionDate: "",
      agreementNumber: "",
      // Furniture (initialize common ones)
      officeTables: 0,
      executiveChairs: 0,
      // Valuation
      landValue: 0,
      buildingValue: 0,
      totalValue: 0,
    };
  });

  const updateFormData = (data: Partial<AssetFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Reset assetType if category changes to keep state consistent
      if (name === "category") {
        newData.assetType = "";
      }
      
      return newData;
    });
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <AssetFormContext.Provider value={{ formData, updateFormData, handleInputChange, handleToggleChange }}>
      {children}
    </AssetFormContext.Provider>
  );
}

export function useAssetForm() {
  const context = useContext(AssetFormContext);
  if (context === undefined) {
    throw new Error("useAssetForm must be used within an AssetFormProvider");
  }
  return context;
}
