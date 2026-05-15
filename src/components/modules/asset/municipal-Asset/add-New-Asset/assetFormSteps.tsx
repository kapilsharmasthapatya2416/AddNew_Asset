import {
  Search,
  ClipboardList,
  ShieldCheck,
  Armchair,
  BadgeDollarSign,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AssetFormStepConfig {
  id: number;
  key: "identification" | "basic-info" | "legal-complience" | "furniture-fixture" | "valuation" | "documents";
  label: string;
  icon: LucideIcon;
  path: string;
}

export const ASSET_FORM_STEPS: AssetFormStepConfig[] = [
  {
    id: 1,
    key: "identification",
    label: "Identification",
    icon: Search,
    path: "/asset/municipal-Asset/add-New-Asset/identification",
  },
  {
    id: 2,
    key: "basic-info",
    label: "Basic Info",
    icon: ClipboardList,
    path: "/asset/municipal-Asset/add-New-Asset/basic-Info",
  },
  {
    id: 3,
    key: "legal-complience",
    label: "Legal, Safety & Compliance",
    icon: ShieldCheck,
    path: "/asset/municipal-Asset/add-New-Asset/legal-Complience",
  },
  {
    id: 4,
    key: "furniture-fixture",
    label: "Furniture & Fixtures Inventory",
    icon: Armchair,
    path: "/asset/municipal-Asset/add-New-Asset/furniture&Fixture",
  },
  {
    id: 5,
    key: "valuation",
    label: "Valuation",
    icon: BadgeDollarSign,
    path: "/asset/municipal-Asset/add-New-Asset/valuation",
  },
  {
    id: 6,
    key: "documents",
    label: "Documents",
    icon: FileText,
    path: "/asset/municipal-Asset/add-New-Asset/documents",
  },
];


// "use client";
 
// import React from "react";
// import {
//   ClipboardList,
//   ShieldCheck,
//   Armchair,
//   BadgeDollarSign,
//   FileText,
//   Check,
// } from "lucide-react";
 
// export interface AssetStep {
//   id: number;
//   label: string;
//   icon: React.ElementType;
// }
 
// const DEFAULT_STEPS: AssetStep[] = [
//   { id: 1, label: "Basic Info", icon: ClipboardList },
//   { id: 2, label: "Legal, Safety & Compliance", icon: ShieldCheck },
//   { id: 3, label: "Furniture & Fixtures Inventory", icon: Armchair },
//   { id: 4, label: "Valuation", icon: BadgeDollarSign },
//   { id: 5, label: "Documents", icon: FileText },
// ];
 
// interface AssetStepperProps {
//   currentStep?: number;
//   steps?: AssetStep[];
// }
 
// export function AssetStepper({
//   currentStep = 3,
//   steps = DEFAULT_STEPS,
// }: AssetStepperProps) {
//   return (
//     <div className="flex items-center justify-start rounded-xl border border-[#CBD8EA] bg-white px-5 py-2.5 shadow-sm">
//       {/* Steps */}
//       <div className="flex items-center gap-0">
//         {steps.map((step, index) => {
//           const isCompleted = step.id < currentStep;
//           const isCurrent = step.id === currentStep;
//           const Icon = step.icon;
 
//           return (
//             <React.Fragment key={step.id}>
//               {/* Connector line (before each step except first) */}
//               {index > 0 && (
//                 <div
//                   className={`mx-1 h-0.5 w-8 rounded-full transition-colors ${
//                     isCompleted || isCurrent
//                       ? "bg-emerald-400"
//                       : "bg-slate-200"
//                   }`}
//                 />
//               )}
 
//               {/* Step circle + label */}
//               <div className="flex items-center gap-1.5">
//                 <div
//                   className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
//                     isCompleted
//                       ? "bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]"
//                       : isCurrent
//                         ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] ring-2 ring-emerald-300/40"
//                         : "bg-slate-200 text-slate-400"
//                   }`}
//                 >
//                   {isCompleted ? (
//                     <Check className="h-3.5 w-3.5" strokeWidth={3} />
//                   ) : (
//                     <Icon className="h-3 w-3" />
//                   )}
//                 </div>
//                 <span
//                   className={`whitespace-nowrap text-[11px] font-medium transition-colors ${
//                     isCompleted
//                       ? "text-emerald-600"
//                       : isCurrent
//                         ? "text-slate-800 font-semibold"
//                         : "text-slate-400"
//                   }`}
//                 >
//                   {step.label}
//                 </span>
//               </div>
//             </React.Fragment>
//           );
//         })}
//       </div>
//     </div>
//   );
// }