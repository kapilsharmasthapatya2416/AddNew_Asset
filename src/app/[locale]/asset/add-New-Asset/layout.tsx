import { MainLayout } from "@/components/layout";
import { AssetStepShell } from "./AssetStepShell";

export default function AddNewAssetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <AssetStepShell>{children}</AssetStepShell>
    </MainLayout>
  );
}

// import { MainLayout } from "@/components/layout"
// import { AssetFormFooter } from "@/components/modules/asset/add-New-Asset/assetFooter"
// import { AssetStepper } from "@/components/modules/asset/add-New-Asset/assetFormSteps"

// export default function AddNewAssetLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <MainLayout>
//       <AssetStepper currentStep={2} />
//       {children}
//       <AssetFormFooter />
//     </MainLayout>
//   )
// };