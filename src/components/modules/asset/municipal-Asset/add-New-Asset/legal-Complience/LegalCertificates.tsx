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
        {/* Certificate Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CertificateEntry
            title="Title Deed Available?"
            toggleName="titleDeedAvailable"
            noName="titleDeedNo"
            dateName="titleDeedDate"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
          />
          <CertificateEntry
            title="Possession Certificate?"
            toggleName="possessionCertAvailable"
            noName="possessionCertNo"
            dateName="possessionCertDate"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
          />
          <CertificateEntry
            title="NA Order Available?"
            toggleName="naOrderAvailable"
            noName="naOrderNo"
            dateName="naOrderDate"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
          />
        </div>

        {/* Certificate Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
           <CertificateEntry
            title="7/12 Extract Available?"
            toggleName="extract712Available"
            noName="extract712No"
            dateName="extract712Date"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
          />
          <CertificateEntry
            title="Property Card?"
            toggleName="propertyCardAvailable"
            noName="propertyCardNo"
            dateName="propertyCardDate"
            formData={formData}
            onToggle={onToggle}
            onChange={onChange}
          />
           <CertificateEntry
            title="Gazette Notification?"
            toggleName="gazetteAvailable"
            noName="gazetteNo"
            dateName="gazetteDate"
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
  title, toggleName, noName, dateName, formData, onToggle, onChange 
}: any) {
  const isAvailable = formData[toggleName];
  
  return (
    <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100 transition-all hover:bg-white hover:shadow-md">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{title}</span>
        <ToggleSwitch
          checked={isAvailable}
          onChange={(checked) => onToggle(toggleName, checked)}
          size="sm"
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
          label="Date"
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
