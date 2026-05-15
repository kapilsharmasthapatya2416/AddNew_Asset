"use client";

import React from "react";
import { Input, ToggleSwitch, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { FileCheck } from "lucide-react";

interface LegalCertificatesProps {
  formData: any;
  onToggle: (name: string, checked: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function LegalCertificates({ formData, onToggle, onChange }: LegalCertificatesProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-emerald-100 mt-4">
      <CardHeader className="flex items-center gap-2 border-b border-emerald-50 pb-3 mb-4">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <FileCheck className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          B) Legal Documents & Certificates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Row 1: Building & Completion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CertificateEntry
            title="Building Plan Approval?"
            toggleName="hasBuildingPlan"
            noName="buildingPlanNo"
            dateName="buildingPlanDate"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
          />
          <CertificateEntry
            title="Completion Certificate?"
            toggleName="hasCompletionCertificate"
            noName="completionCertificateNo"
            dateName="completionCertificateDate"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
          />
          <CertificateEntry
            title="Fire Safety Certificate?"
            toggleName="hasFireSafety"
            noName="fireSafetyCertificateNo"
            dateName="fireSafetyValidTill"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
            isDateValidTill={true}
          />
        </div>

        {/* Row 2: Lift, Insurance, Lease */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
           <CertificateEntry
            title="Lift License Available?"
            toggleName="hasLift"
            noName="liftLicenseNo"
            dateName="liftLicenseValidTill"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
            isDateValidTill={true}
          />
          <CertificateEntry
            title="Asset Insurance?"
            toggleName="hasInsurance"
            noName="insurancePolicyNo"
            dateName="insuranceValidTill"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
            isDateValidTill={true}
          />
           <CertificateEntry
            title="Lease Agreement?"
            toggleName="hasLeaseAgreement"
            noName="leaseAgreementNo"
            dateName="leaseAgreementDate"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function CertificateEntry({ 
  title, toggleName, noName, dateName, formData, onToggle, onChange, isDateValidTill 
}: any) {
  const isAvailable = formData[toggleName];
  
  return (
    <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100 transition-all hover:bg-white hover:shadow-md">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{title}</span>
        <ToggleSwitch
          checked={isAvailable}
          onChange={(checked) => onToggle(toggleName, checked)}

        />
      </div>
      <div className={`grid grid-cols-2 gap-2 transition-opacity duration-300 ${isAvailable ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
        <Input
          label="Cert. No."
          name={noName}
          value={formData[noName]}
          onChange={onChange}
          placeholder="No."
          className="h-7 text-[10px]"
          disabled={!isAvailable}
        />
        <Input
          label={isDateValidTill ? "Valid Till" : "Date"}
          name={dateName}
          value={formData[dateName]}
          onChange={onChange}
          type="date"
          className="h-7 text-[10px]"
          disabled={!isAvailable}
        />
      </div>
    </div>
  );
}
