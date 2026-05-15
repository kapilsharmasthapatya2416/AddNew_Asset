import { MainLayout } from '@/components/layout';
import { AssetSidebar } from '@/components/layout/AssetSidebar';
import MunicipalAssetDashboard from '@/components/modules/asset/municipal-Asset/MunicipalAssetDashboard';

export default function MunicipalAssetPage() {
  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-140px)] overflow-hidden">
        <AssetSidebar currentPage="assets" />
        <div className="flex-1 p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
          <div className="mx-auto w-full max-w-[99%]">
            <MunicipalAssetDashboard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
