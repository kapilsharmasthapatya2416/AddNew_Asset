"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AssetStepper } from "@/components/modules/asset/municipal-Asset/add-New-Asset/assetStepper";
import { AssetFormFooter } from "@/components/modules/asset/municipal-Asset/add-New-Asset/assetFooter";
import { getFilteredSteps } from "@/components/modules/asset/municipal-Asset/add-New-Asset/assetFormSteps";
import { getCurrentAssetStep } from "@/components/modules/asset/municipal-Asset/add-New-Asset/assetFormStepHelpers";

import { AssetFormProvider, useAssetForm } from "@/components/modules/asset/municipal-Asset/add-New-Asset/AssetFormContext";

interface AssetStepShellProps {
  children: React.ReactNode;
}

export function AssetStepShell({ children }: AssetStepShellProps) {
  return (
    <AssetFormProvider>
      <AssetStepShellContent>{children}</AssetStepShellContent>
    </AssetFormProvider>
  );
}

function AssetStepShellContent({ children }: AssetStepShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { formData } = useAssetForm();
  
  const steps = getFilteredSteps(formData.category);
  const currentStep = getCurrentAssetStep(pathname, formData.category);

  const handleBackToDashboard = () => {
    const segments = pathname.split("/").filter(Boolean);
    const locale = segments[0] || "en";
    router.push(`/${locale}/asset/municipal-Asset`);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group shrink-0"
          >
            <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Back</span>
          </button>
          <div className="flex-1">
            <AssetStepper
              currentStepId={currentStep?.id ?? 1}
              steps={steps}
            />
          </div>
        </div>
        <AssetFormFooter />
      </div>
      {children}
    </div>
  );
}