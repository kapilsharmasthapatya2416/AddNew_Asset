import { appConfig } from "@/config/app.config";

import type {
  Floor,
  FloorFormModel,
  SubFloor,
  SubFloorFormModel,
  FloorPagedResponse,
  SubFloorPagedResponse,
  PagedResponse,
} from "@/types/floor.types";

/* ============================================================
   API UTILITIES
============================================================ */

/**
 * Custom error class for API errors with structured information
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public responseText: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Creates base fetch options with common headers
 *
 * @param method HTTP method (GET, POST, PUT, DELETE)
 * @param body Optional request body
 * @returns Configured RequestInit object
 */
export function createFetchOptions(
  method: string = "GET",
  body?: unknown
): RequestInit {
  const options: RequestInit = {
    method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  return options;
}

/* ============================================================
   COMMON HELPERS
============================================================ */

function buildUrl(
  endpoint: string,
  params?: URLSearchParams
): string {
  return `${appConfig.api.baseUrl}${endpoint}${
    params ? `?${params.toString()}` : ""
  }`;
}

async function validateResponse(
  response: Response,
  context: string
): Promise<void> {
  if (response.ok) return;

  const text = await response.text();
  let message = `${context}: ${response.status} ${response.statusText}`;

  try {
    const json = JSON.parse(text) as {
      message?: string;
      title?: string;
      error?: string;
    };

    message =
      json.message ||
      json.title ||
      json.error ||
      message;
  } catch {
    // ignore parse failure
  }

  throw new ApiError(response.status, text, message);
}

/* ============================================================
   FLOOR APIs
============================================================ */

export async function checkFloorCodeExists(
  code: string
): Promise<boolean> {
  const response = await fetch(
    buildUrl(`/Floor?FloorCode=${encodeURIComponent(code)}`),
    createFetchOptions("GET")
  );

  await validateResponse(response, "Check floor code");

  const data: PagedResponse<Floor> = await response.json();
  return data.items.length > 0;
}

export async function getFloorPaged(
  pageNumber: number,
  pageSize: number,
  searchTerm?: string
): Promise<FloorPagedResponse> {
  const params = new URLSearchParams({
    PageNumber: pageNumber.toString(),
    PageSize: pageSize.toString(),
  });

  if (searchTerm?.trim()) {
    params.append("SearchTerm", searchTerm.trim());
  }

  const response = await fetch(
    buildUrl("/Floor", params),
    createFetchOptions("GET")
  );

  await validateResponse(response, "Fetch floors");

  return response.json();
}

export async function getFloorById(
  floorId: number
): Promise<Floor> {
  if (!floorId && floorId !== 0) {
    throw new Error("Floor ID is required");
  }

  const response = await fetch(
    buildUrl(`/Floor/${floorId}`),
    createFetchOptions("GET")
  );

  await validateResponse(response, "Fetch floor");

  return response.json();
}

export async function createFloor(
  data: FloorFormModel
): Promise<void> {
  const payload = {
    floorCode: data.floorCode.trim(),
    description: data.description.trim(),
    sequenceNo: Number(data.sequenceNo) || 0,
    isActive: data.isActive ?? true,
  };

  const response = await fetch(
    buildUrl("/Floor"),
    createFetchOptions("POST", payload)
  );

  await validateResponse(response, "Create floor");
}

export async function updateFloor(
  floorId: number,
  data: FloorFormModel
): Promise<void> {
  if (!floorId && floorId !== 0) {
    throw new Error("Floor ID is required for update");
  }

  const payload = {
    floorCode: data.floorCode.trim(),
    description: data.description?.trim() ?? "",
    sequenceNo: Number(data.sequenceNo) || 0,
    isActive: data.isActive ?? true,
  };

  const response = await fetch(
    buildUrl(`/Floor/${floorId}`),
    createFetchOptions("PUT", payload)
  );

  await validateResponse(response, "Update floor");
}

export async function deleteFloor(
  floorId: number
): Promise<void> {
  if (!floorId && floorId !== 0) {
    throw new Error("Floor ID is required");
  }

  try {
    const response = await fetch(
      buildUrl(`/Floor/${floorId}`),
      createFetchOptions("DELETE")
    );

    await validateResponse(response, "Delete floor");
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      const lower = error.message.toLowerCase();

      if (
        error.statusCode === 500 &&
        lower.includes("processing your request")
      ) {
        throw new Error("floor.messages.deleteInUse");
      }

      throw new Error(error.message);
    }

    throw new Error(
      "Something went wrong while deleting floor."
    );
  }
}

/* ============================================================
   FLOOR SEQUENCE CHECK
============================================================ */

export async function checkFloorSequenceExists(
  sequenceNo: number,
  excludeFloorId?: string
): Promise<boolean> {
  const params = new URLSearchParams({
    SequenceNo: sequenceNo.toString(),
  });

  const response = await fetch(
    buildUrl("/Floor", params),
    createFetchOptions("GET")
  );

  await validateResponse(response, "Check sequence");

  const data: FloorPagedResponse = await response.json();

  const filtered = excludeFloorId
    ? data.items.filter(
        (f) =>
          String(f.floorId) !== excludeFloorId
      )
    : data.items;

  return filtered.length > 0;
}

/* ============================================================
   SUBFLOOR APIs
============================================================ */

export async function checkSubFloorCodeExists(
  code: string
): Promise<boolean> {
  const response = await fetch(
    buildUrl(
      `/SubFloor?SubFloorCode=${encodeURIComponent(code)}`
    ),
    createFetchOptions("GET")
  );

  await validateResponse(response, "Check subfloor code");

  const data: PagedResponse<SubFloor> =
    await response.json();

  return data.items.length > 0;
}

export async function getSubFloorPaged(
  pageNumber: number,
  pageSize: number,
  searchTerm?: string
): Promise<SubFloorPagedResponse> {
  const params = new URLSearchParams({
    PageNumber: pageNumber.toString(),
    PageSize: pageSize.toString(),
  });

  if (searchTerm?.trim()) {
    params.append("SearchTerm", searchTerm.trim());
  }

  const response = await fetch(
    buildUrl("/SubFloor", params),
    createFetchOptions("GET")
  );

  await validateResponse(response, "Fetch subfloors");

  return response.json();
}

export async function getSubFloorById(
  subFloorId: number
): Promise<SubFloor> {
  if (!subFloorId && subFloorId !== 0) {
    throw new Error("SubFloor ID is required");
  }

  const response = await fetch(
    buildUrl(`/SubFloor/${subFloorId}`),
    createFetchOptions("GET")
  );

  await validateResponse(response, "Fetch subfloor");

  return response.json();
}

export async function createSubFloor(
  data: SubFloorFormModel
): Promise<void> {
  const payload = {
    subFloorCode: data.subFloorCode.trim(),
    description: data.description.trim(),
    subFloorPercentage:
      Number(data.subFloorPercentage) || 0,
    isActive: data.isActive ?? true,
  };

  const response = await fetch(
    buildUrl("/SubFloor"),
    createFetchOptions("POST", payload)
  );

  await validateResponse(response, "Create subfloor");
}

export async function updateSubFloor(
  subFloorId: number,
  data: SubFloorFormModel
): Promise<void> {
  if (!subFloorId && subFloorId !== 0) {
    throw new Error("SubFloor ID is required for update");
  }

  const payload = {
    subFloorCode: data.subFloorCode.trim(),
    description: data.description?.trim() ?? "",
    subFloorPercentage:
      Number(data.subFloorPercentage) || 0,
    isActive: data.isActive ?? true,
  };

  const response = await fetch(
    buildUrl(`/SubFloor/${subFloorId}`),
    createFetchOptions("PUT", payload)
  );

  await validateResponse(response, "Update subfloor");
}

export async function deleteSubFloor(
  subFloorId: number
): Promise<void> {
  if (!subFloorId && subFloorId !== 0) {
    throw new Error("SubFloor ID is required");
  }

  const response = await fetch(
    buildUrl(`/SubFloor/${subFloorId}`),
    createFetchOptions("DELETE")
  );

  await validateResponse(response, "Delete subfloor");
}