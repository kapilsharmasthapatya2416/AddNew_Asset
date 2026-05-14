'use client';

import { ScreenFieldsMaster } from './ScreenFieldsMaster';
import { useConfigurationMasterState } from './ConfigurationMasterContext';
import type { ScreenConfig, ScreenFieldsMasterShellProps } from '@/types/asset.types';

export function ScreenFieldsMasterShell({ initialScreenConfigs }: ScreenFieldsMasterShellProps) {
  const {
    ensureLinkedFieldMasters,
    deleteLinkedFieldMaster,
    getLinkedFieldMasterByFieldId,
  } = useConfigurationMasterState();

  return (
    <ScreenFieldsMaster
      initialScreenConfigs={initialScreenConfigs}
      ensureLinkedFieldMasters={ensureLinkedFieldMasters}
      deleteLinkedFieldMaster={deleteLinkedFieldMaster}
      getLinkedFieldMasterByFieldId={getLinkedFieldMasterByFieldId}
    />
  );
}
