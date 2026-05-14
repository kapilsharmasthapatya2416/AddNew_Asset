import { MainLayout } from '@/components/layout';
import { AssetSidebar } from '@/components/modules/asset/AssetSidebar';
import { SectionListShell } from '@/components/modules/asset/configurationMaster/screenFieldsMasterComponents/SectionListShell';
import { getDefaultScreenConfigs } from '@/lib/utils/screenConfigStorage';

export default function SectionListPage() {
  const initialScreenConfigs = getDefaultScreenConfigs();
  const selectedScreen = initialScreenConfigs[0];
  const sections = selectedScreen?.sections ?? [];
  const screenName = selectedScreen?.displayName || selectedScreen?.screenName;

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-10rem)]">
        <AssetSidebar currentPage="configuration" />
        <div className="flex-1 p-6">
          <div className="mx-auto w-full max-w-7xl">
            <SectionListShell initialSections={sections} screenName={screenName} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
