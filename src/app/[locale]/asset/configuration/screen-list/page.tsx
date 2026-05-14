import { MainLayout } from '@/components/layout';
import { AssetSidebar } from '@/components/modules/asset/AssetSidebar';
import { ScreenListShell } from '@/components/modules/asset/configurationMaster/screenFieldsMasterComponents/ScreenListShell';
import { getDefaultScreenConfigs } from '@/lib/utils/screenConfigStorage';

export default function ScreenListPage() {
  const initialScreenConfigs = getDefaultScreenConfigs();

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-10rem)]">
        <AssetSidebar currentPage="configuration" />
        <div className="flex-1 p-6">
          <div className="mx-auto w-full max-w-7xl">
            <ScreenListShell initialScreens={initialScreenConfigs} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
