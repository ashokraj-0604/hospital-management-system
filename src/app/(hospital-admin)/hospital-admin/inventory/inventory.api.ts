import apiClient from '@/src/lib/api-client';

export interface MasterItem { category_id?: string; supplier_id?: string; store_id?: string; item_id?: string; name: string; }

export interface ItemStock {
  stock_id: string;
  item_name: string;
  category_name: string;
  supplier_name: string;
  store_name: string | null;
  total_quantity: number;
  purchase_price: string;
  purchase_date: string;
  description: string | null;
  generated_by_name: string;
}

export interface StockStats {
  total_items: number;
  total_quantity: number;
  total_value: number;
}

export interface CreateStockPayload {
  category_id: string;
  item_id: string;
  supplier_id: string;
  store_id?: string;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  description?: string;
}

export const inventoryApi = {
  getCategories: () => apiClient.get('/inventory/categories').then((r) => r.data),
  createCategory: (name: string) => apiClient.post('/inventory/categories', { name }).then((r) => r.data),

  getSuppliers: () => apiClient.get('/inventory/suppliers').then((r) => r.data),
  createSupplier: (name: string) => apiClient.post('/inventory/suppliers', { name }).then((r) => r.data),

  getStores: () => apiClient.get('/inventory/stores').then((r) => r.data),
  createStore: (name: string) => apiClient.post('/inventory/stores', { name }).then((r) => r.data),

  getItems: (categoryId?: string) => apiClient.get('/inventory/items', { params: categoryId ? { category_id: categoryId } : {} }).then((r) => r.data),
  createItem: (category_id: string, name: string) => apiClient.post('/inventory/items', { category_id, name }).then((r) => r.data),

  getStock: (search?: string) => apiClient.get('/inventory/stock', { params: search ? { search } : {} }).then((r) => r.data as ItemStock[]),
  getStats: () => apiClient.get('/inventory/stock/stats').then((r) => r.data as StockStats),
  createStock: (payload: CreateStockPayload) => apiClient.post('/inventory/stock', payload).then((r) => r.data),
  deleteStock: (id: string) => apiClient.delete(`/inventory/stock/${id}`).then((r) => r.data),
};