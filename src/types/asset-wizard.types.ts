import { LucideIcon } from "lucide-react";

export interface AssetFormStepConfig {
  id: number;
  key: "identification" | "basic-info" | "legal-complience" | "furniture-fixture" | "valuation" | "documents";
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface AssetFormData {
  category: string;
  assetType: string;
  assetName: string;
  assetCode: string;
  [key: string]: any;
}

export interface AssetFormContextType {
  formData: AssetFormData;
  updateFormData: (data: Partial<AssetFormData>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
}

export interface AssetWizardStepProps {
  formData: AssetFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onToggleChange?: (name: string, checked: boolean) => void;
}

export interface AssetWizardStepProps {
  formData: AssetFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onToggleChange?: (name: string, checked: boolean) => void;
}
