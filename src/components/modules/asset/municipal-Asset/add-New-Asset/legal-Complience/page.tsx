"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { OwnershipDetails } from "./OwnershipDetails";
import { LegalCertificates } from "./LegalCertificates";
import { LegalCompliance } from "./LegalCompliance";
import { useAssetForm } from "../AssetFormContext";

export default function LegalCompliancePage() {
  const { formData, handleInputChange, handleToggleChange } = useAssetForm();

  const isBuilding = formData.category === "BUILDING";
  const isMovable = formData.category === "MOVABLE";

  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {formData.category === "INFRASTRUCTURE" && (
        <div className="p-4 bg-blue-600 rounded-xl mb-4 flex items-center justify-between text-white shadow-lg shadow-blue-200">
          <div>
            <h4 className="font-bold uppercase tracking-tight text-sm">Specialized Infrastructure Compliance</h4>
            <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Additional utility clearances required</p>
          </div>
          <div className="bg-white/20 p-2 rounded-lg">
             <ShieldCheck className="size-5" />
          </div>
        </div>
      )}

      {!isMovable && <OwnershipDetails formData={formData} onChange={handleInputChange} />}
      
      {isBuilding && (
        <>
          <LegalCertificates formData={formData} onToggle={handleToggleChange} onChange={handleInputChange} />
          <LegalCompliance formData={formData} onToggle={handleToggleChange} onChange={handleInputChange} />
        </>
      )}

      {isMovable && (
        <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <ShieldCheck className="size-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Building Compliance Required</h3>
            <p className="text-sm text-slate-500 max-w-xs mt-2 uppercase tracking-tight font-medium">
              Legal and safety certifications like building plans and fire NOCs are not applicable for movable assets.
            </p>
            <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-black">
              Please proceed to Valuation step
            </p>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center gap-3">
        <div className="bg-emerald-600 size-2 rounded-full animate-pulse" />
        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">
          Compliance Check: All mandatory legal documents flagged for verification
        </p>
      </div>
    </div>
  );
}
