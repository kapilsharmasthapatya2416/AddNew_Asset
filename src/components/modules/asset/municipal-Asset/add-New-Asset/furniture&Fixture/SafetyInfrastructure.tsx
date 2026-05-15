"use client";

import React from "react";
import { Input, ToggleSwitch, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { ShieldCheck } from "lucide-react";

interface SafetyInfrastructureProps {
  formData: any;
  onToggle: (name: string, checked: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function SafetyInfrastructure({ formData, onToggle, onChange }: SafetyInfrastructureProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-emerald-100 mt-4">
      <CardHeader className="flex items-center gap-2 border-b border-emerald-50 pb-3 mb-4">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <ShieldCheck className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          C) Safety & Security Infrastructure
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Fire Extinguishers", name: "fireExtinguishersCount", toggle: "fireExtinguishersAvailable" },
          { label: "CCTV Cameras", name: "cctvCamerasCount", toggle: "cctvAvailable" },
          { label: "Smoke Detectors", name: "smokeDetectorsCount", toggle: "smokeDetectorsAvailable" },
          { label: "Emergency Exits", name: "emergencyExitsCount", toggle: "emergencyExitsAvailable" },
          { label: "Security Personnel", name: "securityStaffCount", toggle: "securityStaffAvailable" },
          { label: "First Aid Kits", name: "firstAidKitsCount", toggle: "firstAidAvailable" },
        ].map((item) => (
          <div key={item.toggle} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{item.label}?</span>
              <ToggleSwitch
                checked={formData[item.toggle]}
                onChange={(checked) => onToggle(item.toggle, checked)}

              />
            </div>
            <Input
              label="Quantity"
              name={item.name}
              value={formData[item.name]}
              onChange={onChange}
              type="number"
              min="0"
              disabled={!formData[item.toggle]}
              className="h-7 text-xs"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
