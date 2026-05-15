"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Select, Button } from "@/components/common";
import { FileText, ChevronRight } from "lucide-react";

const assetCategoryOptions = [
  { label: "Building Asset", value: "building_asset" },
  { label: "Land Asset", value: "land_asset" },
  { label: "Infrastructure Asset", value: "infrastructure_asset" },
];

const assetTypeOptionsByCategory = {
  building_asset: [
    { label: "Municipal Office", value: "municipal_office" },
    { label: "Hospital", value: "hospital" },
    { label: "School/Educational Institution", value: "school_educational" },
    { label: "Dispensary", value: "dispensary" },
    
  ],
  land_asset: [
    { label: "Open Plot", value: "open_plot" },
    { label: "Vacant Land", value: "vacant_land" },
    { label: "Playground / Open Ground", value: "playground_open_ground" },
    { label: "Reserved Land", value: "reserved_land" },
    { label: "Parking Plot", value: "parking_plot" },
    { label: "Public Park / Garden", value: "public_park_garden" },
  ],
  infrastructure_asset: [
    { label: "Road", value: "road" },
    { label: "Bridge", value: "bridge" },
    { label: "Water Supply", value: "water_supply" },
  ],
};

function SectionHeader({ title, badge }: { title: string; badge: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {badge}
      </span>
      <span>{title}</span>
    </div>
  );
}

export default function BasicInfoDetails({ locale }: { locale: string }): React.ReactElement {
  const router = useRouter();
  const [assetCategory, setAssetCategory] = useState("building_asset");
  const [assetType, setAssetType] = useState("municipal_office");

  const assetTypeOptionsMemo = useMemo(() => {
    return assetTypeOptionsByCategory[assetCategory as keyof typeof assetTypeOptionsByCategory] || [];
  }, [assetCategory]);

  const handleNext = () => {
    router.push(
      `/${locale}/asset-management/legal-safety/${assetCategory}/${assetType}`
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-gray-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <FileText className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold">Basic Information</h1>
      </div>

      <Card variant="bordered" padding="sm" className="border-blue-200 rounded-2xl shadow-sm">
        <SectionHeader title="Property Number Details" badge="A" />

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Select
            label="Asset Category"
            options={assetCategoryOptions}
            value={assetCategory}
            onChange={setAssetCategory}
          />

          <Select
            label="Asset Type"
            options={assetTypeOptionsMemo}
            value={assetType}
            onChange={setAssetType}
          />
        </div>
      </Card>

      <div className="mt-8 flex justify-end">
        <Button
          variant="primary"
          icon={ChevronRight}
          iconPosition="right"
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
