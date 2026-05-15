"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getCurrentAssetStep,
  getNextAssetStep,
  getPreviousAssetStep,
} from "./assetFormStepHelpers";
import { ASSET_FORM_STEPS } from "./assetFormSteps";

function withLocale(pathname: string, targetPath: string) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || "en";
  return `/${locale}${targetPath}`;
}

export function AssetFormFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStep = getCurrentAssetStep(pathname);
  const previousStep = getPreviousAssetStep(pathname);
  const nextStep = getNextAssetStep(pathname);

  const queryString = searchParams.toString();
  const appendQuery = (url: string) => (queryString ? `${url}?${queryString}` : url);

  const handlePrevious = () => {
    if (!previousStep) return;
    router.push(appendQuery(withLocale(pathname, previousStep.path)));
  };

  const handleNext = () => {
    if (!nextStep) return;
    router.push(appendQuery(withLocale(pathname, nextStep.path)));
  };

  const totalSteps = ASSET_FORM_STEPS.length; 
  const currentStepId = currentStep?.id ?? 1;
  const isFirstStep = !previousStep;
  const isLastStep = !nextStep;

  return (
    <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#CBD8EA] bg-white px-3 py-1.5 shadow-sm h-full">
      <button
        type="button"
        disabled={isFirstStep}
        onClick={handlePrevious}
        className={`flex items-center gap-1.5 rounded-lg border px-4 py-1.5 text-xs font-semibold transition-all ${
          isFirstStep
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
            : "border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-400 hover:bg-slate-200"
        }`}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Previous
      </button>

      <div className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700">
        Step {currentStepId} of {totalSteps}
      </div>

      <button
        type="button"
        disabled={isLastStep}
        onClick={handleNext}
        className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
          isLastStep
            ? "cursor-not-allowed bg-blue-200 text-blue-400"
            : "bg-[#1D4ED8] text-white shadow-sm hover:bg-[#1E40AF]"
        }`}
      >
        {isLastStep ? "Submit" : "Next"}
        {!isLastStep && <ChevronRight className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

// "use client";
 
// import { ChevronLeft, ChevronRight } from "lucide-react";
 
// interface AssetFormFooterProps {
//   currentStep?: number;
//   totalSteps?: number;
//   onPrevious?: () => void;
//   onNext?: () => void;
//   disablePrevious?: boolean;
//   disableNext?: boolean;
// }
 
// export function AssetFormFooter({
//   currentStep = 3,
//   totalSteps = 5,
//   onPrevious,
//   onNext,
//   disablePrevious = false,
//   disableNext = false,
// }: AssetFormFooterProps) {
//   const isFirstStep = currentStep <= 1;
//   const isLastStep = currentStep >= totalSteps;
 
//   return (
//     <div className="flex items-center justify-end gap-3 rounded-xl border border-[#CBD8EA] bg-white px-5 py-2.5 shadow-sm">
//       {/* Previous Button */}
//       <button
//         type="button"
//         disabled={disablePrevious || isFirstStep}
//         onClick={onPrevious}
//         className={`flex items-center gap-1.5 rounded-lg border px-4 py-1.5 text-xs font-semibold transition-all ${
//           disablePrevious || isFirstStep
//             ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
//             : "border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-400 hover:bg-slate-200"
//         }`}
//       >
//         <ChevronLeft className="h-3.5 w-3.5" />
//         Previous
//       </button>
 
//       {/* Step Indicator */}
//       <div className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700">
//         Step {currentStep} of {totalSteps}
//       </div>
 
//       {/* Next Button */}
//       <button
//         type="button"
//         disabled={disableNext}
//         onClick={onNext}
//         className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
//           disableNext
//             ? "cursor-not-allowed bg-blue-200 text-blue-400"
//             : "bg-[#1D4ED8] text-white hover:bg-[#1E40AF] shadow-sm"
//         }`}
//       >
//         {isLastStep ? "Submit" : "Next"}
//         {!isLastStep && <ChevronRight className="h-3.5 w-3.5" />}
//       </button>
//     </div>
//   );
// }