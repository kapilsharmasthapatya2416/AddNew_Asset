"use server";
import { getUseTypesPagedServer } from "@/lib/api/typeofusemaster.service";
import type { UseType } from "@/types/typeOfUse.types";

// SSR action to fetch all TypeOfUse (for PropertyTypeForm)
export async function getTypeOfUseListAction(): Promise<UseType[]> {
  try {
    const result = await getUseTypesPagedServer({ pageNumber: 1, pageSize: 5000 });
    return result.items;
  } catch (error) {
    console.error("[getTypeOfUseListAction] Error:", error);
    return [];
  }
}
import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/config";
import { createPropertyType, deletePropertyType, getPropertyTypesPaged, getPropertyTypeById, updatePropertyType } from "@/lib/api/property-type-crud.service";
import { getPropertyTypeAndTypeOfUseValidation, updatePropertyTypeValidations } from "@/lib/api/property-type-validation-mapping.service";
import { getPropertyTypeCategories } from "@/lib/api/property-type-category.service";
import { ApiError } from "@/lib/utils/api";
import { PropertyType, PropertyTypeFormModel, PropertyTypeAndTypeOfUseValidation } from "@/types/property-type.types";
import { PropertyTypeCategory } from "@/types/property-type-category.types";
import { PagedResponse } from "@/types/common.types";

export async function fetchPropertyTypePagedServerAction(
  pageNumber: number,
  pageSize: number,
  searchTerm?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<PagedResponse<PropertyType>> {
  try {
    // Basic validation with upper bounds
    const MAX_PAGE_SIZE = 100;
    const MAX_PAGE_NUMBER = 10000;
    if (
      !Number.isFinite(pageNumber) ||
      !Number.isFinite(pageSize) ||
      pageNumber <= 0 ||
      pageSize <= 0 ||
      pageSize > MAX_PAGE_SIZE ||
      pageNumber > MAX_PAGE_NUMBER
    ) {
      throw new ApiError(400, "Invalid pagination parameters", "Validation failed");
    }

    // Validate sortBy against allowed columns to prevent injection
    const allowedSortColumns = ["propertyDescription", "type", "propertyTypeGroup"];
    const validSortBy = sortBy && allowedSortColumns.includes(sortBy) ? sortBy : undefined;
    const validSortOrder = sortOrder && ["asc", "desc"].includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : undefined;

    const result = await getPropertyTypesPaged(pageNumber, pageSize, searchTerm, validSortBy, validSortOrder);
    return result;
  } catch (error: unknown) {
    // Log the error for debugging
    if (error instanceof ApiError) {
      console.error(
        `[fetchPropertyTypePagedServerAction] API Error ${error.statusCode}:`,
        error.responseText
      );
    } else if (error instanceof Error) {
      console.error(
        "[fetchPropertyTypePagedServerAction] Error:",
        error.message
      );
    } else {
      console.error(
        "[fetchPropertyTypePagedServerAction] Unknown error:",
        error
      );
    }

    // Re-throw the error so Next.js error boundary can catch it
    throw error;
  }
}

export async function createPropertyTypeAction(
  data: PropertyTypeFormModel
): Promise<{ success: boolean; message?: string; statusCode?: number }> {
  try {
    await createPropertyType(data);
    // Revalidate all locale variants of the property type page
    for (const locale of locales) {
      revalidatePath(`/${locale}/property-tax/propertytype`, "page");
    }
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.responseText,
        statusCode: error.statusCode
      };
    }
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Failed to create property type" };
  }
}

/* ================= UPDATE ================= */
export async function updatePropertyTypeAction(
  data: PropertyTypeFormModel
): Promise<{ success: boolean; message?: string; statusCode?: number }> {
  try {
    await updatePropertyType(data);
    // Revalidate all locale variants of the property type page
    for (const locale of locales) {
      revalidatePath(`/${locale}/property-tax/propertytype`, "page");
    }
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.responseText,
        statusCode: error.statusCode
      };
    }
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Failed to update property type" };
  }
}

export async function deletePropertyTypeAction(
  formData: FormData
): Promise<{ success: boolean; message?: string; statusCode?: number }> {
  const rawId = formData.get("id");
  const id =
    typeof rawId === "string" ? parseInt(rawId, 10) : 0;

  if (!id || id <= 0) {
    return {
      success: false,
      message: "Valid Property Type ID is required",
      statusCode: 400,
    };
  }

  try {
    await deletePropertyType(id);

    // Revalidate all locale variants of the property type page
    for (const locale of locales) {
      revalidatePath(`/${locale}/property-tax/propertytype`, "page");
    }
    return {
      success: true,
      message: "Property type deleted successfully",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.responseText,
        statusCode: error.statusCode,
      };
    }

    return {
      success: false,
      message: "Failed to delete property type",
    };
  }
}

export async function getPropertyTypeByIdAction(
  id: number
): Promise<PropertyType> {
  try {
    if (!id || id <= 0) {
      throw new ApiError(400, "Valid Property Type ID is required", "Validation failed");
    }
    const result = await getPropertyTypeById(id);
    if (!result) {
      throw new ApiError(404, "Property Type not found", "Not Found");
    }
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(
        `[getPropertyTypeByIdAction] API Error ${error.statusCode}:`,
        error.responseText
      );
    } else {
      console.error(
        "[getPropertyTypeByIdAction] Error:",
        error
      );
    }
    throw error; // rethrow so UI can handle it
  }
}

export async function getPropertyTypeCategoriesAction(): Promise<PropertyTypeCategory[]> {
  try {
    const result = await getPropertyTypeCategories();
    return result;
  } catch (error) {
    console.error("[getPropertyTypeCategoriesAction] Error:", error);
    // Return empty array on error so form can still render
    return [];
  }
}

// SSR action to fetch PropertyType to TypeOfUse validation mappings
export async function getPropertyTypeAndTypeOfUseValidationAction(): Promise<PropertyTypeAndTypeOfUseValidation[]> {
  try {
    const result = await getPropertyTypeAndTypeOfUseValidation();
    return result;
  } catch (error) {
    console.error("[getPropertyTypeAndTypeOfUseValidationAction] Error:", error);
    return [];
  }
}

// Action to update TypeOfUse validation mappings for a property type
export async function updatePropertyTypeValidationsAction(
  propertyTypeId: number,
  typeOfUseIds: number[]
): Promise<{ success: boolean; message?: string }> {
  try {
    await updatePropertyTypeValidations(propertyTypeId, typeOfUseIds);
    // Revalidate all locale variants of the property type page
    for (const locale of locales) {
      revalidatePath(`/${locale}/property-tax/propertytype`, "page");
    }
    return { success: true };
  } catch (error) {
    console.error("[updatePropertyTypeValidationsAction] Error:", error);
    if (error instanceof ApiError) {
      return { success: false, message: error.responseText };
    }
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Failed to update type of use validation" };
  }
}
