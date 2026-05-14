import SafetyDetailRenderView, { SafetyAssetType } from "@/components/modules/asset/add-New-Asset/legal-Complience/legal-safety/SafetyDetailRenderView";

interface LegalSafetyPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ type?: string }>;
}


export default async function LegalSafetyPage({
  params,
  searchParams,
}: LegalSafetyPageProps) {
  await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const assetType: SafetyAssetType = resolvedSearchParams?.type as SafetyAssetType || "infrastructure";
  // const assetType = "infrastructure";

  return <SafetyDetailRenderView type={assetType} />;
}