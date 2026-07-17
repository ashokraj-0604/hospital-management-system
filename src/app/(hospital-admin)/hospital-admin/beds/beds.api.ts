import apiClient from '@/src/lib/api-client';

export interface Bed {
  bed_id: string;
  ward_id: string;
  bed_number: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'UNUSED';
  patient_id: string | null;
  patient_name: string | null;
  patient_phone: string | null;
  patient_gender: string | null;
  guardian_name: string | null;
  consultant_id: string | null;
  consultant_name: string | null;
  admitted_at: string | null;
}

export interface Ward {
  ward_id: string;
  floor_name: string;
  ward_name: string;
  beds: Bed[];
}

export interface FloorGroup {
  floor_name: string;
  wards: Ward[];
}

export interface BedStats {
  total: number;
  available: number;
  occupied: number;
  unused: number;
  occupied_percentage: number;
}

export interface AssignBedPayload {
  patient_id: string;
  patient_name: string;
  patient_phone?: string;
  patient_gender?: string;
  guardian_name?: string;
  consultant_id?: string;
  consultant_name?: string;
}

export const bedsApi = {
  async getGrouped() {
    const { data } = await apiClient.get('/beds');
    return data as FloorGroup[];
  },
  async getStats() {
    const { data } = await apiClient.get('/beds/stats');
    return data as BedStats;
  },
  async findAllWards() {
    const { data } = await apiClient.get('/beds/wards');
    return data as Omit<Ward, 'beds'>[];
  },
  async createWard(payload: { floor_name: string; ward_name: string }) {
    const { data } = await apiClient.post('/beds/wards', payload);
    return data;
  },
  async createBed(payload: { ward_id: string; bed_number: string }) {
    const { data } = await apiClient.post('/beds', payload);
    return data;
  },
  async assign(bedId: string, payload: AssignBedPayload) {
    const { data } = await apiClient.patch(`/beds/${bedId}/assign`, payload);
    return data;
  },
  async discharge(bedId: string) {
    const { data } = await apiClient.patch(`/beds/${bedId}/discharge`);
    return data;
  },
  async markUnused(bedId: string) {
    const { data } = await apiClient.patch(`/beds/${bedId}/unused`);
    return data;
  },
};