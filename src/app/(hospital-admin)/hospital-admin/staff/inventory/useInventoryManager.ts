import { useState, useEffect, useCallback } from 'react';
import { inventoryManagersApi, CreateInventoryManagerPayload } from './inventorymanager.api';
import { getApiErrorMessage } from '@/src/lib/api-error';

export function useInventoryManagers() {
  const [inventoryManagers, setInventoryManagers] = useState<import('./inventorymanager.api').InventoryManager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryManagers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setInventoryManagers(await inventoryManagersApi.findAll());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load inventory managers.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchInventoryManagers(); }, [fetchInventoryManagers]);

  const addInventoryManager = async (payload: CreateInventoryManagerPayload) => {
    const created = await inventoryManagersApi.create(payload);
    await fetchInventoryManagers();
    return created;
  };

  return { inventoryManagers, isLoading, error, addInventoryManager };
}