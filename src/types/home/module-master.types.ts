import { PagedResponse } from "@/types/common.types";

export interface ModuleMaster {
  id: number;
  departmentId: number;
  moduleCode: string;
  moduleName: string;
  moduleNameLocal: string | null;
  moduleIcon: string | null;
  moduleLabel: string | null;
  moduleDescription: string | null;
  departmentName: string;
  isActive: boolean;
  createdDate: string | null;
  updatedDate: string | null;
}

export type ModuleMasterPagedResponse = PagedResponse<ModuleMaster>;
