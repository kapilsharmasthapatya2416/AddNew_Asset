import {
  ClipboardList,
  ShieldCheck,
  Armchair,
  BadgeDollarSign,
  FileText,
} from "lucide-react";
import { AssetFormStepConfig } from "@/types/asset-wizard.types";
export type { AssetFormStepConfig };

export const ALL_ASSET_FORM_STEPS: AssetFormStepConfig[] = [
  {
    id: 1,
    key: "basic-info",
    label: "Basic Info",
    icon: ClipboardList,
    path: "/asset/municipal-Asset/add-New-Asset/basic-Info",
  },
  {
    id: 2,
    key: "legal-complience",
    label: "Legal, Safety & Compliance",
    icon: ShieldCheck,
    path: "/asset/municipal-Asset/add-New-Asset/legal-Complience",
  },
  {
    id: 3,
    key: "furniture-fixture",
    label: "Furniture & Fixtures Inventory",
    icon: Armchair,
    path: "/asset/municipal-Asset/add-New-Asset/furniture&Fixture",
  },
  {
    id: 4,
    key: "valuation",
    label: "Valuation",
    icon: BadgeDollarSign,
    path: "/asset/municipal-Asset/add-New-Asset/valuation",
  },
  {
    id: 5,
    key: "documents",
    label: "Documents",
    icon: FileText,
    path: "/asset/municipal-Asset/add-New-Asset/documents",
  },
];
///Dynamic coming 
export function getFilteredSteps(category: string): AssetFormStepConfig[] {
  let filtered = [...ALL_ASSET_FORM_STEPS];

  if (category === "MOVABLE") {
    // Hide Legal and Furniture for Movable
    filtered = filtered.filter(step => step.key !== "legal-complience" && step.key !== "furniture-fixture");
  } else if (category === "LAND") {
    // Hide Furniture for Land
    filtered = filtered.filter(step => step.key !== "furniture-fixture");
  } else if (category === "INFRASTRUCTURE") {
    // Infrastructure usually doesn't have furniture either
    filtered = filtered.filter(step => step.key !== "furniture-fixture");
  }

  // Re-assign IDs to maintain sequential order for the stepper
  return filtered.map((step, index) => ({ ...step, id: index + 1 }));
}