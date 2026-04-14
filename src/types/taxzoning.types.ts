export interface TaxZone {
  taxZoneId: number;
  taxZoneNo: string;
  taxZoneType: string;
  remark: string | null;
  createdDate: string;
  updatedDate: string | null;
  isActive: boolean;
}
export interface Ward {
  wardId: number;
  wardNo: string;
  zoneNo: string;
  description: string | null;
  descriptionEnglish: string | null;
  sequenceNo: number | null;
  isActive: boolean;
  createdBy: string | null;
  createdDate: string;
  updatedBy: string | null;
  updatedDate: string | null;
}
export interface TaxZonning {
  taxZoneId: number;
  wardId: number;
  taxZone: string;
  wardNo: string;
  propertyNo: string;
  fromProperty: string;
  toProperty: string;
  isActive: boolean;
  createdDate: string | null;
  updatedDate: string | null;
}
 
export type TaxZonningPropertyNo = {
  taxZoneId: number;
  wardId: number;
  taxZone: string;
  wardNo: string;
  propertyNo: string;
  fromProperty: string;
  toProperty: string;
  isActive: boolean;
  createdDate: string | null;
  updatedDate: string | null;
};

// src/types/action-result.ts
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number };

export interface TaxZoningFormModel {
  taxZoneId: number;
  wardId: number;
  propertyNo: string;      // can be comma separated if needed
  fromProperty: string;
  toProperty: string;
  isActive: boolean;
  updatedBy?: number;
  ownerID?: number;
  propertyId?: number;
}
