"use client";

import React from "react";
import { Select, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { ClipboardList, Search } from "lucide-react";

interface AssetCategoryTypeProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function AssetCategoryType({ formData, onChange }: AssetCategoryTypeProps) {
  const categoryToTypes: Record<string, { label: string; value: string }[]> = {
    building: [
      { label: "Municipal Office", value: "Municipal Office" },
      { label: "Health Facility", value: "Health Facility" },
      { label: "Educational", value: "Educational" },
      { label: "Public Service", value: "Public Service" },
    ],
    land: [
      { label: "Open Space", value: "open_space" },
      { label: "Park / Garden", value: "park" },
      { label: "Playground", value: "playground" },
      { label: "Parking Lot", value: "parking" },
    ],
    infrastructure: [
      { label: "Road / Bridge", value: "road" },
      { label: "Water Tank", value: "water_tank" },
      { label: "Sewerage Plant", value: "sewerage" },
      { label: "Street Lighting", value: "lighting" },
    ],
    movable: [
      { label: "Vehicle", value: "vehicle" },
      { label: "Machinery", value: "machinery" },
      { label: "IT Equipment", value: "it_equip" },
    ],
  };

  const typeOptions = categoryToTypes[formData.category] || [];

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
            options={[
                { label: "Building", value: "building" },
                { label: "Land", value: "land" },
                { label: "Infrastructure", value: "infrastructure" },
                { label: "Movable", value: "movable" },
            ]}
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
    </Card>
  );
}
