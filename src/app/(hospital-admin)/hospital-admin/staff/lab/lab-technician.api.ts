import apiClient from '@/src/lib/api-client';

export interface LabTechnician {
  lab_technician_id: string;
  user_id: string;
  name: string;
  email: string;
  isActive: boolean;
  lab_section: string;
  phone: string;
}

export interface CreateLabTechnicianPayload {
  name: string; email: string; password: string; lab_section: string; phone: string;
}

export const labTechniciansApi = {
  async findAll() {
    const { data } = await apiClient.get('/lab-technicians');
    return data as LabTechnician[];
  },
  async create(payload: CreateLabTechnicianPayload) {
    const { data } = await apiClient.post('/lab-technicians', payload);
    return data;
  },
};