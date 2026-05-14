import { MainLayout } from '@/components/layout';
import { AssetSidebar } from '@/components/modules/asset/AssetSidebar';
import { FieldListShell } from '@/components/modules/asset/configurationMaster/screenFieldsMasterComponents/FieldListShell';
import { getDefaultScreenConfigs } from '@/lib/utils/screenConfigStorage';

export default function FieldListPage() {
  const initialScreenConfigs = getDefaultScreenConfigs();
  const selectedScreen = initialScreenConfigs[0];
  const selectedSection = selectedScreen?.sections.find((section) => section.isActive) || selectedScreen?.sections[0];

  const sections = selectedScreen?.sections || [];
  const sectionName = selectedSection?.label;

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-10rem)]">
        <AssetSidebar currentPage="configuration" />
        <div className="flex-1 p-6">
          <div className="mx-auto w-full max-w-7xl">
            <FieldListShell
              sections={sections}
              sectionName={sectionName || undefined}
              screenId={selectedScreen?.id}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
