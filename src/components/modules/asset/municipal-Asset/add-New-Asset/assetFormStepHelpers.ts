import { ALL_ASSET_FORM_STEPS, getFilteredSteps, type AssetFormStepConfig } from "./assetFormSteps";

export function normalizePath(pathname: string) {
  return pathname.replace(/^\/(en|hi|mr)/, "");
}

export function getCurrentAssetStep(pathname: string, category?: string): AssetFormStepConfig | undefined {
  const cleanPath = normalizePath(pathname);
  const steps = category ? getFilteredSteps(category) : ALL_ASSET_FORM_STEPS;
  return steps.find((step) => cleanPath.startsWith(step.path));
}

export function getPreviousAssetStep(pathname: string, category?: string): AssetFormStepConfig | undefined {
  const current = getCurrentAssetStep(pathname, category);
  if (!current) return undefined;

  const steps = category ? getFilteredSteps(category) : ALL_ASSET_FORM_STEPS;
  return steps.find((step) => step.id === current.id - 1);
}

export function getNextAssetStep(pathname: string, category?: string): AssetFormStepConfig | undefined {
  const current = getCurrentAssetStep(pathname, category);
  if (!current) return undefined;

  const steps = category ? getFilteredSteps(category) : ALL_ASSET_FORM_STEPS;
  return steps.find((step) => step.id === current.id + 1);
}