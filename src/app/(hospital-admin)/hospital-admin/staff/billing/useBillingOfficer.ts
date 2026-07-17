import { useState, useEffect, useCallback } from 'react';
import { billingOfficersApi, CreateBillingOfficerPayload } from './billingofficer.api';
import { getApiErrorMessage } from '@/src/lib/api-error';

export function useBillingOfficers() {
  const [billingOfficers, setBillingOfficers] = useState<import('./billingofficer.api').BillingOfficer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingOfficers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setBillingOfficers(await billingOfficersApi.findAll());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load billing officers.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchBillingOfficers(); }, [fetchBillingOfficers]);

  const addBillingOfficer = async (payload: CreateBillingOfficerPayload) => {
    const created = await billingOfficersApi.create(payload);
    await fetchBillingOfficers();
    return created;
  };

  return { billingOfficers, isLoading, error, addBillingOfficer };
}