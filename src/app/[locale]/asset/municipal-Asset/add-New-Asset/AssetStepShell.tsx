"use client";

import { usePathname } from "next/navigation";
import { AssetStepper } from "@/components/modules/asset/municipal-Asset/add-New-Asset/assetStepper";
import { AssetFormFooter } from "@/components/modules/asset/municipal-Asset/add-New-Asset/assetFooter";
import { ASSET_FORM_STEPS } from "@/components/modules/asset/municipal-Asset/add-New-Asset/assetFormSteps";
import { getCurrentAssetStep } from "@/components/modules/asset/municipal-Asset/add-New-Asset/assetFormStepHelpers";

import { AssetFormProvider } from "@/components/modules/asset/municipal-Asset/add-New-Asset/AssetFormContext";

interface AssetStepShellProps {
  children: React.ReactNode;
}

export function AssetStepShell({ children }: AssetStepShellProps) {
  const pathname = usePathname();
  const currentStep = getCurrentAssetStep(pathname);

  return (
    <AssetFormProvider>
      <div className="space-y-2">
        <AssetStepper
          currentStepId={currentStep?.id ?? 1}
          steps={ASSET_FORM_STEPS}
        />
        {children}
        <AssetFormFooter />
      </div>
    </AssetFormProvider>
  );
}