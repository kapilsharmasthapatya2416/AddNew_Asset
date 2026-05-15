import { MainLayout } from "@/components/layout";
import { AssetStepShell } from "./AssetStepShell";
import { AssetSidebar } from "@/components/layout/AssetSidebar";

export default function AddNewAssetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-140px)] overflow-hidden">
        <AssetSidebar currentPage="assets" />
        <div className="flex-1 p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
          <AssetStepShell>{children}</AssetStepShell>
        </div>
      </div>
    </MainLayout>
  );
}