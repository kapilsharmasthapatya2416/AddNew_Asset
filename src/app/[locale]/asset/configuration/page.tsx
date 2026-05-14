import { MainLayout } from '@/components/layout';
import { ConfigurationMaster } from '@/components/modules/asset/configurationMaster/ConfigurationMaster';
import { AssetSidebar } from '@/components/modules/asset/AssetSidebar';
import { getDefaultScreenConfigs } from '@/lib/utils/screenConfigStorage';

export default function AssetConfigurationPage() {
  const initialScreenConfigs = getDefaultScreenConfigs();
  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-10rem)]">
        <AssetSidebar currentPage="configuration" />
        <div className="flex-1 p-6">
          <div className="mx-auto w-full max-w-7xl">
            <ConfigurationMaster initialScreenConfigs={initialScreenConfigs} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
