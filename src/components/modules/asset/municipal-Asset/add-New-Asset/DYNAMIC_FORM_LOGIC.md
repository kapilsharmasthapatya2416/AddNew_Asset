# Dynamic Asset Form Logic Documentation

This document explains the architectural patterns and implementation details of the dynamic "Add New Asset" registration wizard.

## 1. Overview
The registration wizard uses a **Hybrid Data Model** to handle the vast diversity of municipal assets. 
*   **Fixed Fields**: Common data points (Property No, Location, Department) stored in structured tables like `AssetMaster`.
*   **Dynamic Attributes**: Type-specific fields (e.g., "Soil Type" for Land, "Chassis No" for Vehicles) stored as flexible Attribute-Value pairs.

## 2. Core Architecture

### A) Hybrid State (AssetFormContext)
We use a React Context (`AssetFormContext.tsx`) to manage the state:
*   **Static Object**: Stores properties that map directly to `AMS.AssetMaster`.
*   **Attributes Object**: Stores dynamic key-value pairs that map to `AMS.AssetAttributeValue`.
*   **Logic**: Captures selections in Step 1 (Identification) which then drive the UI behavior of Steps 2-6.
*   **Integrity**: Automatically resets sub-type selections when the primary category changes.

### B) Step-Based Routing
The wizard is split into 6 distinct steps, each with its own route:
1. **Identification**: Category/Type selection.
2. **Basic Info**: Common identity and location fields.
3. **Legal & Compliance**: Ownership and legal status.
4. **Physical Details**: Technical specifications.
5. **Valuation**: Financial and tax data.
6. **Documents**: Media and file uploads.

## 3. Dynamic Switching Patterns

### Pattern 1: Conditional Section Rendering
Used when entire sections are irrelevant for certain categories.
*   **Example**: In Step 4 (Furniture), Land assets hide the furniture/IT grids and display a "Not Applicable" notice.

### Pattern 2: Category-Specific Banners
Used to provide contextual guidance to municipal officials.
*   **Example**: Infrastructure assets display a blue alert banner in the Legal step highlighting the need for utility clearances.

### Pattern 3: Dynamic Option Filtering
Ensures that users only select valid combinations.
*   **Example**: Selecting 'Movable' as a category filters the 'Asset Type' dropdown to only show Vehicles, Machinery, and IT Equipment.

## 4. Configuration-Driven Fields
To handle the vast variety of fields (as defined in the Excel reference), we use a configuration object that defines:
*   **Category-Specific Fields**: Fields appearing for all assets in a category.
*   **Type-Specific Fields**: High-granularity fields (e.g., 'Soil Type' for Agricultural Land vs. 'Chassis Number' for Vehicles).

## 5. Maintenance & Scalability
Adding a new asset type only requires:
1.  Adding the type to the `categoryToTypes` map in `AssetIdentity.tsx`.
2.  Adding specialized fields to the dynamic renderer config for the relevant step.

---
*Last Updated: 2026-05-14*
