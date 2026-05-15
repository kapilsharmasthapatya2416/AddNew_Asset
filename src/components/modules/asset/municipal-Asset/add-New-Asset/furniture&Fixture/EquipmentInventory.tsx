"use client";

import React from "react";
import { Input, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { Monitor } from "lucide-react";

interface EquipmentInventoryProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function EquipmentInventory({ formData, onChange }: EquipmentInventoryProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-violet-100 mt-4">
      <CardHeader className="flex items-center gap-2 border-b border-violet-50 pb-3 mb-4">
        <div className="bg-violet-600 p-1.5 rounded-lg">
          <Monitor className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          B) IT & Electrical Equipment
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[
          { label: "Computers / Laptops", name: "computersCount" },
          { label: "Printers / Scanners", name: "printersCount" },
          { label: "AC Units", name: "acUnitsCount" },
          { label: "Ceiling Fans", name: "ceilingFansCount" },
          { label: "UPS / Inverters", name: "upsCount" },
          { label: "LED Screens / TVs", name: "ledScreensCount" },
          { label: "Water Coolers", name: "waterCoolersCount" },
          { label: "Exhaust Fans", name: "exhaustFansCount" },
          { label: "Bio-metric Device", name: "biometricDevices" },
          { label: "Public Address Sys", name: "paSystemsCount" },
        ].map((item) => (
          <Input
            key={item.name}
            label={item.label}
            name={item.name}
            value={formData[item.name]}
            onChange={onChange}
            type="number"
            min="0"
            className="h-8 text-xs"
          />
        ))}
      </CardContent>
    </Card>
  );
}
