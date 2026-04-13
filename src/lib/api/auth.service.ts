import { apiClient } from '@/services/api.service';
import type { AuthLoginApiBody, LogoutRequest, UlbConfigApiBody } from '@/types/login.types';
import { ApiResponse } from '@/types/common.types';
import { parseUlbConfigPayload } from '@/lib/api/ulb-config-normalize';

export const authService = {
  /**
   * POST `/Auth/login` — body `{ username, password }` (JSON camelCase).
   * `ApiResponse.data` is the parsed JSON body (includes nested `success`, `token`, …).
   */
  async validateCredentials(credentials: {
    username: string;
    password: string;
  }): Promise<ApiResponse<AuthLoginApiBody>> {
    return apiClient.post<AuthLoginApiBody>('/Auth/login', credentials);
  },

  async logout(sessionId: string, token: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/Auth/logout', { sessionId } as LogoutRequest, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /** GET `/UlbConfig` — council branding for login UI and cookies. */
  async getUlbConfig(): Promise<ApiResponse<UlbConfigApiBody>> {
    const res = await apiClient.get<unknown>('/UlbConfig');
    if (!res.success || res.data === undefined) {
      return { success: false, error: res.error };
    }
    const parsed = parseUlbConfigPayload(res.data);
    if (!parsed) {
      return {
        success: false,
        error: 'ULB response shape not recognized (expected ulbId, ulbName, …)',
      };
    }
    return { success: true, data: parsed };
  },
};
