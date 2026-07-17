import apiClient from '@/src/lib/api-client';

export interface Medicine {
  medicine_id: string;
  name: string;
  category_id: string;
  category_name: string | null;
  company_id: string | null;
  company_name: string | null;
  group_id: string | null;
  group_name: string | null;
  unit_id: string;
  unit_name: string | null;
  composition: string | null;
  available_qty: number;
  photo_path: string | null;
}

export const pharmacyApi = {
  getCategories: () => apiClient.get('/pharmacy/categories').then((r) => r.data),
  createCategory: (name: string) => apiClient.post('/pharmacy/categories', { name }).then((r) => r.data),

  getCompanies: () => apiClient.get('/pharmacy/companies').then((r) => r.data),
  createCompany: (name: string) => apiClient.post('/pharmacy/companies', { name }).then((r) => r.data),

  getGroups: () => apiClient.get('/pharmacy/groups').then((r) => r.data),
  createGroup: (name: string) => apiClient.post('/pharmacy/groups', { name }).then((r) => r.data),

  getUnits: () => apiClient.get('/pharmacy/units').then((r) => r.data),
  createUnit: (name: string) => apiClient.post('/pharmacy/units', { name }).then((r) => r.data),

  getMedicines: (search?: string) =>
    apiClient.get('/pharmacy/medicines', { params: search ? { search } : {} }).then((r) => r.data as Medicine[]),

  createMedicine: (formData: FormData) =>
    apiClient.post('/pharmacy/medicines', formData).then((r) => r.data),

  deleteMedicine: (id: string) => apiClient.delete(`/pharmacy/medicines/${id}`).then((r) => r.data),

  createPurchase: (formData: FormData) =>
    apiClient.post('/pharmacy/purchases', formData).then((r) => r.data),
};