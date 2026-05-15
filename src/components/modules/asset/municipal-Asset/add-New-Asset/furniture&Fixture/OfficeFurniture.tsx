"use client";

import React from "react";
import { Input, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { Armchair } from "lucide-react";

interface OfficeFurnitureProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function OfficeFurniture({ formData, onChange }: OfficeFurnitureProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-blue-100">
      <CardHeader className="flex items-center gap-2 border-b border-blue-50 pb-3 mb-4">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Armchair className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          A) Office Furniture Inventory
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[
          { label: "Office Tables", name: "officeTables" },
          { label: "Executive Chairs", name: "executiveChairs" },
          { label: "Visitor Chairs", name: "visitorChairs" },
          { label: "Steel Cupboards", name: "steelCupboards" },
          { label: "File Racks", name: "fileRacks" },
          { label: "Wooden Benches", name: "woodenBenches" },
          { label: "Sofas", name: "sofaSets" },
          { label: "Stools", name: "stoolsCount" },
          { label: "Reception Desks", name: "receptionDesks" },
          { label: "Meeting Tables", name: "meetingTables" },
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
