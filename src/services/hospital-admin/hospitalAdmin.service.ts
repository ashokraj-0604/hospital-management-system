// src/services/hospital-admin/hospitalAdmin.service.ts

import type {
  HospitalDashboardStats,
  Appointment,
  BedWard,
  ActivityLog,
  Patient,
} from '../../types/hospitals';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with ${res.status}`);
  }
  return res.json();
}

// NOTE: every endpoint here is implicitly scoped to the caller's hospital_id
// via the JWT (TenantContextMiddleware reads hospitalId from the access token).
// No hospital_id is ever passed in the request — the backend derives it.

export const hospitalAdminService = {
  // ── Dashboard ──────────────────────────────────────────────────────────────

  async getStats(): Promise<HospitalDashboardStats> {
    const res = await fetch(`${API_BASE}/hospital-admin/stats`, {
      headers: authHeaders(),
    });
    return handle<HospitalDashboardStats>(res);
  },

  // ── Appointments ───────────────────────────────────────────────────────────

  async getUpcomingAppointments(limit = 5): Promise<Appointment[]> {
    const res = await fetch(
      `${API_BASE}/hospital-admin/appointments/upcoming?limit=${limit}`,
      { headers: authHeaders() },
    );
    return handle<Appointment[]>(res);
  },

  // ── Beds ───────────────────────────────────────────────────────────────────

  async getBedWards(): Promise<BedWard[]> {
    const res = await fetch(`${API_BASE}/hospital-admin/beds`, {
      headers: authHeaders(),
    });
    return handle<BedWard[]>(res);
  },

  // ── Patients ───────────────────────────────────────────────────────────────

  async getRecentPatients(limit = 5): Promise<Patient[]> {
    const res = await fetch(
      `${API_BASE}/hospital-admin/patients/recent?limit=${limit}`,
      { headers: authHeaders() },
    );
    return handle<Patient[]>(res);
  },

  // ── Activity log ───────────────────────────────────────────────────────────

  async getActivityLog(params: { page?: number; limit?: number } = {}): Promise<ActivityLog[]> {
    const { page = 1, limit = 5 } = params;
    const res = await fetch(
      `${API_BASE}/hospital-admin/activity?page=${page}&limit=${limit}`,
      { headers: authHeaders() },
    );
    return handle<ActivityLog[]>(res);
  },
};