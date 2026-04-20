
export interface ConstructionType {
  constructionId: number;
  constructionCode: string;
}

export interface DepreciationRow {
  depreciationId: number; // API key name
  constructionTypeId: number;
  minYear: number;
  maxYear: number;
  rate: number;
}

// Paginated response for depreciation records
export interface DepreciationPagedResponse {
  items: DepreciationRow[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}