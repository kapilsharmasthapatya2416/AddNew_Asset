# AMS Hybrid Implementation Guide (DB to UI Mapping)

This document outlines the implementation strategy for the **AMS (Asset Management System)**, mapping the SQL Server database schema to our React frontend registration wizard.

## 1. The Hybrid Data Model
We follow a "Hybrid" approach to balance performance with extreme flexibility.

| Data Type | DB Table | Frontend Implementation |
| :--- | :--- | :--- |
| **Fixed Core Fields** | `AMS.AssetMaster` | Hardcoded fields in `BasicInfo` (Asset Name, Code, Location, etc.) |
| **Dynamic Attributes** | `AMS.AssetAttributeValue` | Rendered via `DynamicAttributes.tsx` based on definitions from `AMS.AssetAttributeDefinition`. |
| **Specialized Data** | `AMS.AssetConstructionDetails` | "Physical Details" step for Buildings/Floors. |
| **Inventory/Furniture** | `AMS.AssetInventoryDetails` | "Furniture & Fixture" step. |
| **Legal/Compliance** | `AMS.AssetComplianceDetails` | "Legal & Compliance" step. |
| **Documents** | `AMS.AssetDocument` | "Documents" step based on `AMS.AssetDocumentChecklist`. |

---

## 2. Dynamic Attribute Rendering Engine
The database defines authority-specific and category-specific fields.

### Metadata Fetching
The system should fetch definitions from `AMS.AssetAttributeDefinition` filtered by:
1. `AuthorityId`
2. `AssetCategoryId`
3. `AssetTypeId` (Optional - for high granularity)

### UI Rendering Strategy
Our `DynamicAttributes.tsx` component iterates through these definitions and renders the appropriate control:
*   `DataType` (NVARCHAR, DECIMAL, DATE) -> Maps to Input `type`.
*   `ControlType` (TextBox, DropDown, CheckBox) -> Maps to our Common Components (`Input`, `Select`).
*   `AssetAttributeOption` -> Populates the `Select` options.

**Storage**: These values are captured in the `formData.attributes` object and should be saved to `AMS.AssetAttributeValue`.

---

## 3. Location & Asset Hierarchies
The database supports multi-level hierarchies which the UI must represent.

### A) Location Hierarchy (`AMS.LocationNode`)
The "Location Details" section in `BasicInfo` should ideally use a cascading selection or a tree-view for:
`State` -> `District` -> `ULB` -> `Zone` -> `Ward` -> `Building` -> `Floor` -> `Room`.

### B) Asset Hierarchy (`ParentAssetId`)
Any asset can be registered as a child of another asset. The "Identification" step should allow selecting a `ParentAssetId` to maintain the `HierarchyPath`.

---

## 4. Step-by-Step Module Mapping

### Step 1: Identification
*   **Logic Source**: `AMS.AssetCategoryMaster` & `AMS.AssetTypeMaster`.
*   **Action**: Select primary classification.

### Step 2: Basic Info
*   **Static Section**: `AMS.AssetMaster` (Name, Description, Location, Department).
*   **Dynamic Section**: `AMS.AssetAttributeDefinition` (Fields marked for this category).

### Step 3: Legal & Compliance
*   **Fixed Data**: `AMS.AssetComplianceDetails` (Plan approvals, Fire Safety, Insurance).
*   **Custom Legal Fields**: Dynamic attributes specifically for legal status.

### Step 4: Physical Details (Construction / Inventory)
*   **Building/Land**: Uses `AMS.AssetConstructionDetails`.
*   **Movable/IT**: Uses `AMS.AssetInventoryDetails`.

### Step 5: Valuation
*   **Logic**: Uses `AMS.AssetValuationFormula` and variables.
*   **Storage**: Results saved to `AMS.AssetValuation`.

### Step 6: Documents
*   **Logic Source**: `AMS.AssetDocumentChecklist` defines what is mandatory.
*   **Storage**: Files metadata saved to `AMS.AssetDocument`.

We also having some masters which are add new screen with its id new sectin and with its id new fields so must handle these dynamic screens too in this approach if required .

---

## 5. Workflow & Status
The `Status` field in `AssetMaster` is driven by `AMS.ApprovalWorkflow`. 
*   **Initial Status**: `Draft` or `PendingApproval`.
*   **Transaction Log**: Every approval action is recorded in `AMS.ApprovalTransaction`.

---
**Note to Developers**: When adding a new field to the form, first determine if it's a "Common Field" (add to `AssetMaster`) or an "Asset Specific Field" (add to `AssetAttributeDefinition`).
