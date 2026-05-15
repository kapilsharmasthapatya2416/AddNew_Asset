import { ASSET_FORM_STEPS, type AssetFormStepConfig } from "./assetFormSteps";

export function normalizePath(pathname: string) {
  return pathname.replace(/^\/(en|hi|mr)/, "");
}

export function getCurrentAssetStep(pathname: string): AssetFormStepConfig | undefined {
  const cleanPath = normalizePath(pathname);
  return ASSET_FORM_STEPS.find((step) => cleanPath.startsWith(step.path));
}

export function getPreviousAssetStep(pathname: string): AssetFormStepConfig | undefined {
  const current = getCurrentAssetStep(pathname);
  if (!current) return undefined;

  return ASSET_FORM_STEPS.find((step) => step.id === current.id - 1);
}

export function getNextAssetStep(pathname: string): AssetFormStepConfig | undefined {
  const current = getCurrentAssetStep(pathname);
  if (!current) return undefined;

  return ASSET_FORM_STEPS.find((step) => step.id === current.id + 1);
}