import { ScreenListWithSelection } from './ScreenList';
import type { ScreenListShellProps } from '@/types/asset.types';

export function ScreenListShell({ initialScreens }: ScreenListShellProps) {
  return <ScreenListWithSelection screens={initialScreens} />;
}
