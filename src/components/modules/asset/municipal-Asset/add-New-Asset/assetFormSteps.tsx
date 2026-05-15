import {
  ClipboardList,
  ShieldCheck,
  Armchair,
  BadgeDollarSign,
  FileText,
} from "lucide-react";
import { AssetFormStepConfig } from "@/types/asset-wizard.types";

export const ASSET_FORM_STEPS: AssetFormStepConfig[] = [
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