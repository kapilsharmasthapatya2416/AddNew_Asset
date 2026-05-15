import BuildingAssetSafetyDetails from "@/components/modules/asset/municipal-Asset/add-New-Asset/legal-Complience/legal-safety/BuildingAssetSafetyDetails";
import InfrastructureAssetSafetyDetails from "@/components/modules/asset/municipal-Asset/add-New-Asset/legal-Complience/legal-safety/InfrastructureAssetSafetyDetails";
import LandAssetSafetyDetails from "@/components/modules/asset/municipal-Asset/add-New-Asset/legal-Complience/legal-safety/LandAssetSafetyDetails";

export type SafetyAssetType = "building" | "land" | "infrastructure";

interface SafetyDetailRenderViewProps {
  type: SafetyAssetType;
}

export default function SafetyDetailRenderView({
  type,
}: SafetyDetailRenderViewProps) {
  switch (type) {
    case "building":
      return <BuildingAssetSafetyDetails />;

    case "land":
      return <LandAssetSafetyDetails />;

    case "infrastructure":
      return <InfrastructureAssetSafetyDetails />;

    default:
      return <BuildingAssetSafetyDetails />;
  }
}