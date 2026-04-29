export interface FloorFactorCVMaster {
  id: number;
  floorId: number;
  factorWithLift: number;
  factorWithoutLift: number;
  yearRangeCVId: number;   // used in payloads
  yearRangeCVID?: number;  // returned by API (uppercase D alias)
  floorCode?: string;
  floorDescription?: string;
  fromYear?: number;
  toYear?: number;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string | null;
}

export interface FloorFactorCVMasterUpdate {
  isActive: boolean;
  updatedBy: number;
  floorId: number;
  factorWithLift: number;
  factorWithoutLift: number;
  yearRangeCVId: number;
}

export interface FloorFactorCVMasterCreate {
  isActive: boolean;
  createdBy: number;
  floorId: number;
  factorWithLift: number;
  factorWithoutLift: number;
  yearRangeCVId: number;
}

export interface FloorFactorCVBulkCreateItem {
  isActive: boolean;
  createdBy: number;
  floorId: number;
  factorWithLift: number;
  factorWithoutLift: number;
  yearRangeCVId: number;
}

export type BulkFloorFactorCVMasterCreate = FloorFactorCVBulkCreateItem[];

export interface FloorFactorCVBulkUpdateItem {
  id: number;
  data: FloorFactorCVMasterUpdate;
}

export type BulkFloorFactorCVMasterUpdate = FloorFactorCVBulkUpdateItem[];

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
//dependency master service types
export interface AssessmentYearCV {
  id: number;
  fromYear: number;
  toYear: number;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
  yearRangeCVId?: number;
  yearId?: number;
  [key: string]: unknown;
}

export interface AssessmentYearPagedResponseCV {
  items: AssessmentYearCV[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export interface Floor {
  id: number;
  floorCode: string;
  description: string;
  sequenceNo: number;
  createdDate: string;
  updatedDate: string | null;
  isActive: boolean;
  [key: string]: unknown;
}

export type FloorPagedResponse = PagedResponse<Floor>;