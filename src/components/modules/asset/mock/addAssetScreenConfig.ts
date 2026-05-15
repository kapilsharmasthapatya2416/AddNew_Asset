import { ScreenConfig } from "@/types/asset.types";

export const addAssetScreenConfig: ScreenConfig = {
  id: "add-asset",
  screenName: "AddNewMunicipalAsset",
  displayName: "Add New Municipal Asset",
  module: "Asset",
  isActive: true,
  sections: [],
  createdDate: new Date().toISOString(),
};
