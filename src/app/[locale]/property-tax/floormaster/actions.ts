
"use server";

import { revalidatePath } from "next/cache";
import type {
  FloorFormModel,
  SubFloorFormModel,
} from "@/types/floor.types";
import {
  getFloorById,
  getSubFloorById,
  createFloor,
  updateFloor,
  deleteFloor,
  createSubFloor,
  updateSubFloor,
  deleteSubFloor,
  checkFloorSequenceExists,
  checkFloorCodeExists,
  checkSubFloorCodeExists,
  ApiError,
} from "@/lib/api/floor.services";

/* ============================================================
   ACTION RESULT TYPE
============================================================ */

export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

/* ============================================================
   ERROR HELPERS
============================================================ */

function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message ===
    "string"
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (isErrorWithMessage(error)) {
    return error.message;
  }

  return "Something went wrong";
}

/* ============================================================
   FLOOR ACTIONS
============================================================ */

export async function createFloorAction(
  payload: FloorFormModel
): Promise<ActionResult> {
  try {
    await createFloor(payload);
    revalidatePath("/floormaster/floor");

    return {
      success: true,
      message: "Floor created successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function updateFloorAction(
  id: number,
  payload: FloorFormModel
): Promise<ActionResult> {
  try {
    await updateFloor(id, payload);
    revalidatePath("/floormaster/floor");

    return {
      success: true,
      message: "Floor updated successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteFloorAction(
  id: number
): Promise<ActionResult> {
  try {
    await deleteFloor(id);
    revalidatePath("/floormaster/floor");

    return {
      success: true,
      message: "Floor deleted successfully",
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);

    // Return the actual backend error message instead of generic message
    return {
      success: false,
      error: message,
    };
  }
}

export async function toggleFloorStatusAction(
  id: number,
  nextStatus: boolean
): Promise<ActionResult> {
  try {
    const current = await getFloorById(id);

    const payload: FloorFormModel = {
      floorCode: current.floorCode,
      description: current.description ?? "",
      sequenceNo: current.sequenceNo ?? 0,
      isActive: nextStatus,
    };

    await updateFloor(id, payload);
    revalidatePath("/floormaster/floor");

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function checkFloorCodeExistsAction(
  floorCode: string,
  excludeId?: number
): Promise<ActionResult<{ exists: boolean }>> {

  const code = floorCode.trim();

  if (!code) {
    return { success: true, data: { exists: false } };
  }

  try {
    const exists = await checkFloorCodeExists(code, excludeId);

    return {
      success: true,
      data: { exists },
    };

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}


export async function checkFloorSequenceExistsAction(
  sequenceNo: number,
  excludeFloorId?: string
): Promise<ActionResult<{ exists: boolean }>> {
  try {
    const exists =
      await checkFloorSequenceExists(
        sequenceNo,
        excludeFloorId
      );

    return {
      success: true,
      data: { exists },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
/* ============================================================
   SUBFLOOR ACTIONS
============================================================ */

export async function createSubFloorAction(
  payload: SubFloorFormModel
): Promise<ActionResult> {
  try {
    await createSubFloor(payload);
    revalidatePath("/floormaster/subfloor");

    return {
      success: true,
      message: "SubFloor created successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function updateSubFloorAction(
  id: number,
  payload: SubFloorFormModel
): Promise<ActionResult> {
  try {
    await updateSubFloor(id, payload);
    revalidatePath("/floormaster/subfloor");

    return {
      success: true,
      message: "SubFloor updated successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteSubFloorAction(
  id: number
): Promise<ActionResult> {
  try {
    await deleteSubFloor(id);
    revalidatePath("/floormaster/subfloor");

    return {
      success: true,
      message: "SubFloor deleted successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function toggleSubFloorStatusAction(
  id: number,
  nextStatus: boolean
): Promise<ActionResult> {
  try {
    const current = await getSubFloorById(id);

    const payload: SubFloorFormModel = {
      subFloorCode: current.subFloorCode,
      description: current.description ?? "",
      isActive: nextStatus,
    };

    await updateSubFloor(id, payload);
    revalidatePath("/floormaster/subfloor");

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/* ============================================================
   CHECK DUPLICATE SUBFLOOR CODE
============================================================ */

export async function checkSubFloorCodeExistsAction(
  subFloorCode: string,
  excludeId?: number
): Promise<ActionResult<{ exists: boolean }>> {

  const code = subFloorCode.trim();

  if (!code) {
    return { success: true, data: { exists: false } };
  }

  try {
    const exists = await checkSubFloorCodeExists(code, excludeId);

    return {
      success: true,
      data: { exists },
    };

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}