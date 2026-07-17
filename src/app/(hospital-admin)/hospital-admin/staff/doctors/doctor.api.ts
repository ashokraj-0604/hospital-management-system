import apiClient from '@/src/lib/api-client';

export interface Doctor {
  doctor_id: string;
  user_id: string;
  name: string;
  email: string;
  isActive: boolean;
  specialization: string;
  department: string;
  qualification: string | null;
  experience_years: number;
  phone: string;
}

export interface CreateDoctorPayload {
  name: string;
  email: string;
  password: string;
  specialization: string;
  department: string;
  qualification?: string;
  experience_years?: number;
  phone: string;
}

export const doctorsApi = {
  async findAll() {
    const { data } = await apiClient.get('/doctors');
    return data as Doctor[];
  },
  async create(payload: CreateDoctorPayload) {
    const { data } = await apiClient.post('/doctors', payload);
    return data as { doctor_id: string; user_id: string; email: string; name: string };
  },
};