"use client";

import React from "react";
import { Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { Landmark } from "lucide-react";

interface AssetJurisdictionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function AssetJurisdiction({ formData, onChange }: AssetJurisdictionProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-emerald-100 mt-4">
      <CardHeader className="flex items-center gap-2 border-b border-emerald-50 pb-3 mb-4">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <Landmark className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          B) Jurisdiction & Administration
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Select
          label="Zone"
          name="zone"
          value={formData.zone}
          onChange={onChange}
          required
          options={[
            { label: "Zone 1 - Central", value: "zone1" },
            { label: "Zone 2 - North", value: "zone2" },
            { label: "Zone 3 - South", value: "zone3" },
            { label: "Zone 4 - East", value: "zone4" },
            { label: "Zone 5 - West", value: "zone5" },
          ]}
        />
        <Select
          label="Ward Number"
          name="ward"
          value={formData.ward}
          onChange={onChange}
          required
          options={Array.from({ length: 20 }, (_, i) => ({
            label: `Ward ${i + 1}`,
            value: `${i + 1}`,
          }))}
        />
        <Select
          label="Owning Department"
          name="department"
          value={formData.department}
          onChange={onChange}
          required
          options={[
            { label: "Public Works (PWD)", value: "pwd" },
            { label: "Health & Sanitation", value: "health" },
            { label: "Education", value: "education" },
            { label: "Water Supply", value: "water" },
            { label: "Administration", value: "admin" },
          ]}
        />
        <Select
          label="Current Status"
          name="status"
          value={formData.status}
          onChange={onChange}
          options={[
            { label: "Active / Functional", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Under Maintenance", value: "maintenance" },
            { label: "Proposed", value: "proposed" },
          ]}
        />
        <Select
          label="Operational Control"
          name="operationalControl"
          value={formData.operationalControl}
          onChange={onChange}
          options={[
            { label: "Self Managed", value: "self" },
            { label: "Outsourced", value: "outsourced" },
            { label: "PPP Model", value: "ppp" },
          ]}
        />
        <Input
          label="Last Maintenance Date"
          name="lastMaintenanceDate"
          value={formData.lastMaintenanceDate}
          onChange={onChange}
          type="date"
        />
        <Input
          label="Next Scheduled Maintenance"
          name="nextMaintenanceDate"
          value={formData.nextMaintenanceDate}
          onChange={onChange}
          type="date"
        />
      </CardContent>
    </Card>
  );
}
