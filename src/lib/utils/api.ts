import { ApiResponse } from "@/types/common.types";

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
    // Ensure instanceof works correctly
    Object.setPrototypeOf(this, ApiError.prototype);
    // Optionally capture stack trace for V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Validates API response and throws ApiError if unsuccessful
 */
export function handleApiResponse<T>(response: ApiResponse<T>, message: string): T {
  if (!response.success || response.data === undefined || response.data === null) {
    throw new ApiError(
      response.statusCode || 500,
      response.error || "Unknown error",
      message
    );
  }

  // Check for inner API success flag if present (as seen in some endpoints)
  const data = response.data as Record<string, unknown>;
  if (data && typeof data === 'object' && 'success' in data && data['success'] === false) {
    throw new ApiError(
      response.statusCode || 500,
      String(data['message'] || data['error'] || "API execution failed"),
      message
    );
  }

  return response.data;
}
