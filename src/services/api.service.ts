/**
 * API Client Service
 * Centralized HTTP client for making API requests
 */

import { getAppConfig } from '@/config/app.config';
import { ApiResponse } from '@/types/common.types';

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    const config = getAppConfig();
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  /**
   * Safely parses the response body as JSON.
   * Returns `undefined` for empty-body responses (e.g. 204 No Content)
   * instead of throwing "Unexpected end of JSON input".
   */
  private async parseResponseBody<T>(response: Response): Promise<T | undefined> {
    // 204 No Content – body is intentionally absent
    if (response.status === 204) {
      return undefined;
    }

    // Some servers send Content-Length: 0 with a non-204 success status
    const contentLength = response.headers.get('Content-Length');
    if (contentLength === '0') {
      return undefined;
    }

    // Read the raw text first; if it's empty, skip JSON.parse
    const text = await response.text();
    if (!text || text.trim() === '') {
      return undefined;
    }

    // Guard against non-JSON bodies (HTML error pages, plain-text proxies, etc.).
    // Attach the HTTP status so the caller can preserve it in ApiResponse.
    try {
      return JSON.parse(text) as T;
    } catch {
      const err = new Error(
        `Non-JSON response (HTTP ${response.status}): ${text.slice(0, 200)}`
      ) as Error & { httpStatus: number };
      err.httpStatus = response.status;
      throw err;
    }
  }

  /**
   * Extracts a human-readable error message from a non-2xx response body.
   *
   * Priority order:
   *  1. `message`  – most REST APIs
   *  2. `error`    – Spring Boot, some Node frameworks
   *  3. `title`    – RFC 7807 Problem Details
   *  4. `detail`   – RFC 7807 Problem Details
   *  5. `response.statusText` – HTTP reason phrase (e.g. "Not Found")
   *  6. Generic fallback
   *
   * Each candidate is only used when it is a non-empty string.
   */
  private extractErrorMessage(
    errBody: Record<string, unknown> | undefined,
    statusText: string,
  ): string {
    const candidates = [
      errBody?.message,
      errBody?.error,
      errBody?.title,
      errBody?.detail,
      statusText,
    ];
    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim() !== '') {
        return candidate.trim();
      }
    }
    return 'An error occurred';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Parse body safely – handles 204 No Content and other empty responses
      const data = await this.parseResponseBody<T>(response);

      if (!response.ok) {
        const errBody = data as Record<string, unknown> | undefined;
        return {
          success: false,
          statusCode: response.status,
          error: this.extractErrorMessage(errBody, response.statusText),
        };
      }

      return {
        success: true,
        statusCode: response.status,
        data: data as T,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      // Preserve the HTTP status when parseResponseBody throws for non-JSON bodies
      const httpStatus = (error as { httpStatus?: number }).httpStatus;
      return {
        success: false,
        ...(httpStatus !== undefined ? { statusCode: httpStatus } : {}),
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
