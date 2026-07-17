import apiClient from '@/src/lib/api-client';

export interface LabStaff {
  lab_staff_id: string;
  user_id: string;
  name: string;
  email: string;
  isActive: boolean;
  department: string;
  lab_section: string;
  qualification: string | null;
  experience_years: number;
  phone: string;
}

export interface CreateLabStaffPayload {
  name: string;
  email: string;
  password: string;
  department: string;
  lab_section: string;
  qualification?: string;
  experience_years?: number;
  phone: string;
}

export const labStaffApi = {
  async findAll() {
    const { data } = await apiClient.get('/lab-staff');
    return data as LabStaff[];
  },
  async create(payload: CreateLabStaffPayload) {
    const { data } = await apiClient.post('/lab-staff', payload);
    return data as { lab_staff_id: string; user_id: string; email: string; name: string };
  },
};