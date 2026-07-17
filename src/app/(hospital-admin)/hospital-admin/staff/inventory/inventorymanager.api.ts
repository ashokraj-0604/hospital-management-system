import apiClient from '@/src/lib/api-client';

export interface InventoryManager {
  inventory_manager_id: string;
  user_id: string;
  name: string;
  email: string;
  isActive: boolean;
  department: string;
  warehouse_location: string;
  experience_years: number;
  phone: string;
}

export interface CreateInventoryManagerPayload {
  name: string;
  email: string;
  password: string;
  department: string;
  warehouse_location: string;
  experience_years?: number;
  phone: string;
}

export const inventoryManagersApi = {
  async findAll() {
    const { data } = await apiClient.get('/inventory-managers');
    return data as InventoryManager[];
  },
  async create(payload: CreateInventoryManagerPayload) {
    const { data } = await apiClient.post('/inventory-managers', payload);
    return data as { inventory_manager_id: string; user_id: string; email: string; name: string };
  },
};