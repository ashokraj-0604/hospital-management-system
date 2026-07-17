import apiClient from '@/src/lib/api-client';

export interface BillingOfficer {
  billing_officer_id: string;
  user_id: string;
  name: string;
  email: string;
  isActive: boolean;
  department: string;
  designation: string;
  experience_years: number;
  phone: string;
}

export interface CreateBillingOfficerPayload {
  name: string;
  email: string;
  password: string;
  department: string;
  designation: string;
  experience_years?: number;
  phone: string;
}

export const billingOfficersApi = {
  async findAll() {
    const { data } = await apiClient.get('/billing-officers');
    return data as BillingOfficer[];
  },
  async create(payload: CreateBillingOfficerPayload) {
    const { data } = await apiClient.post('/billing-officers', payload);
    return data as { billing_officer_id: string; user_id: string; email: string; name: string };
  },
};