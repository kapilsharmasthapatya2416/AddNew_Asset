"use client";

import React from "react";
import { Select, ToggleSwitch, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { Gavel, ShieldAlert } from "lucide-react";

interface LegalComplianceProps {
  formData: any;
  onToggle: (name: string, checked: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function LegalCompliance({ formData, onToggle, onChange }: LegalComplianceProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-red-100 mt-4">
      <CardHeader className="flex items-center gap-2 border-b border-red-50 pb-3 mb-4">
        <div className="bg-red-600 p-1.5 rounded-lg">
          <ShieldAlert className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          C) Encroachment, Litigation & Safety
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Encroachment */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">Encroachment Identified?</span>
            <ToggleSwitch
              checked={formData.encroachmentIdentified}
              onChange={(checked) => onToggle("encroachmentIdentified", checked)}
              size="sm"
            />
          </div>
          <Select
            label="Encroachment Status"
            name="encroachmentStatus"
            value={formData.encroachmentStatus}
            onChange={onChange}
            disabled={!formData.encroachmentIdentified}
            options={[
              { label: "Partial Encroachment", value: "partial" },
              { label: "Full Encroachment", value: "full" },
              { label: "Temporary Encroachment", value: "temporary" },
              { label: "Legalized / Compromised", value: "legalized" },
            ]}
          />
        </div>

        {/* Litigation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter flex items-center gap-1.5">
              <Gavel className="size-3.5 text-red-500" />
              Litigation / Court Case?
            </span>
            <ToggleSwitch
              checked={formData.litigationCourtCase}
              onChange={(checked) => onToggle("litigationCourtCase", checked)}
              size="sm"
            />
          </div>
          <Select
            label="Case Status"
            name="courtCaseStatus"
            value={formData.courtCaseStatus}
            onChange={onChange}
            disabled={!formData.litigationCourtCase}
            options={[
              { label: "Pending in High Court", value: "high_court" },
              { label: "Pending in Supreme Court", value: "supreme_court" },
              { label: "Stay Order Obtained", value: "stay_order" },
              { label: "Under Arbitration", value: "arbitration" },
            ]}
          />
        </div>

        {/* Safety */}
        <div className="space-y-4">
           <Select
            label="Structural Condition"
            name="structuralCondition"
            value={formData.structuralCondition}
            onChange={onChange}
            required
            options={[
              { label: "Excellent (New / Recently Audited)", value: "excellent" },
              { label: "Good (Maintenance required)", value: "good" },
              { label: "Average (Structural audit pending)", value: "average" },
              { label: "Poor (Immediate attention)", value: "poor" },
              { label: "Dangerous (Evacuation required)", value: "dangerous" },
            ]}
          />
           <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">Safety Risk Identified?</span>
            <ToggleSwitch
              checked={formData.safetyRiskIdentified}
              onChange={(checked) => onToggle("safetyRiskIdentified", checked)}
              size="sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
