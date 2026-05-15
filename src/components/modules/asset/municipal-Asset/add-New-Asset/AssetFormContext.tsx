"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

import { AssetFormData, AssetFormContextType } from "@/types/asset-wizard.types";

import { useSearchParams } from "next/navigation";

const AssetFormContext = createContext<AssetFormContextType | undefined>(undefined);

export function AssetFormProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState<AssetFormData>(() => {
    const category = searchParams.get("category") || "BUILDING";
    const assetType = searchParams.get("assetType") || "";
    
    return {
      category,
      assetType,
      attributes: {},
      documents: [],
      assetName: "",
      assetCode: "BLD-2024-001",
      propertyNumber: "",
      zone: "",
      ward: "",
      department: "",
      status: "Active",
      condition: "Good",
      isRevenueGenerating: "No",
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
    setFormData((prev) => {
      const newData = { ...prev, [name]: checked };
      
      // Inheritance logic
      if (name === "inheritLocation" && checked && prev.parentAssetId) {
        // Simulated parent data retrieval
        newData.fullAddress = "Main Municipal Building, Administrative Block, Zone 4";
        newData.locality = "Civil Lines";
        newData.landmark = "Opposite District Court";
        newData.pinCode = "400001";
        newData.latitude = "19.0760";
        newData.longitude = "72.8777";
      }
      
      return newData;
    });
  };

  const handleAttributeChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: value,
      },
    }));
  };

  return (
    <AssetFormContext.Provider value={{ formData, updateFormData, handleInputChange, handleToggleChange, handleAttributeChange }}>
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
