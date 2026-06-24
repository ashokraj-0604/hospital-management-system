import apiClient from '@/src/lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@/src/types';
import type { Hospital, HospitalCreatePayload, PlatformStats, AuditLog } from '@/src/types/super-admin.types';

// ─── Super Admin Service ──────────────────────────────────────────────────────

export const superAdminService = {
  // ── Platform Stats ──────────────────────────────────────────────────────────
  getStats: async (): Promise<PlatformStats> => {
    const { data } = await apiClient.get<ApiResponse<PlatformStats>>('/super-admin/stats');
    return data.data;
  },

  // ── Hospitals ───────────────────────────────────────────────────────────────
  listHospitals: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    plan?: string;
  }): Promise<PaginatedResponse<Hospital>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Hospital>>>(
      '/super-admin/hospitals',
      { params },
    );
    return data.data;
  },

  getHospital: async (hospitalId: string): Promise<Hospital> => {
    const { data } = await apiClient.get<ApiResponse<Hospital>>(
      `/super-admin/hospitals/${hospitalId}`,
    );
    return data.data;
  },

  createHospital: async (payload: HospitalCreatePayload): Promise<Hospital> => {
    const { data } = await apiClient.post<ApiResponse<Hospital>>(
      '/super-admin/hospitals',
      payload,
    );
    return data.data;
  },

  updateHospital: async (hospitalId: string, payload: Partial<Hospital>): Promise<Hospital> => {
    const { data } = await apiClient.patch<ApiResponse<Hospital>>(
      `/super-admin/hospitals/${hospitalId}`,
      payload,
    );
    return data.data;
  },

  suspendHospital: async (hospitalId: string, reason: string): Promise<void> => {
    await apiClient.post(`/super-admin/hospitals/${hospitalId}/suspend`, { reason });
  },

  activateHospital: async (hospitalId: string): Promise<void> => {
    await apiClient.post(`/super-admin/hospitals/${hospitalId}/activate`);
  },

  deleteHospital: async (hospitalId: string): Promise<void> => {
    await apiClient.delete(`/super-admin/hospitals/${hospitalId}`);
  },

  // ── Audit Logs ──────────────────────────────────────────────────────────────
  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    hospital_id?: string;
  }): Promise<PaginatedResponse<AuditLog>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AuditLog>>>(
      '/super-admin/audit-logs',
      { params },
    );
    return data.data;
  },
};
