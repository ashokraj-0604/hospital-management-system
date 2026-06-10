'use client';

import { useState, useEffect, useCallback } from 'react';
import { superAdminService } from '@/src/services/super-admin/superAdmin.service';
import { MOCK_HOSPITALS } from '@/src/lib/super-admin/mockdata';
import type { Hospital } from '@/src/types/super-admin.types';

// ─── useHospitals Hook ────────────────────────────────────────────────────────

interface UseHospitalsOptions {
  search?: string;
  status?: string;
  plan?: string;
  page?: number;
  limit?: number;
}

interface UseHospitalsReturn {
  hospitals: Hospital[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useHospitals = (options: UseHospitalsOptions = {}): UseHospitalsReturn => {
  const { search = '', status = '', plan = '', page = 1, limit = 10 } = options;

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHospitals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await superAdminService.listHospitals({ page, limit, search, status, plan });
      setHospitals(result.data);
      setTotal(result.total);
    } catch {
      // Use mock data — filter locally for dev experience
      let filtered = [...MOCK_HOSPITALS];
      if (search) filtered = filtered.filter(h =>
        h.hospital_name.toLowerCase().includes(search.toLowerCase()) ||
        h.hospital_code.toLowerCase().includes(search.toLowerCase()) ||
        h.city.toLowerCase().includes(search.toLowerCase())
      );
      if (status) filtered = filtered.filter(h => h.status === status);
      if (plan) filtered = filtered.filter(h => h.subscription_plan === plan);
      setHospitals(filtered);
      setTotal(filtered.length);
    } finally {
      setIsLoading(false);
    }
  }, [search, status, plan, page, limit]);

  useEffect(() => { fetchHospitals(); }, [fetchHospitals]);

  return { hospitals, total, isLoading, error, refetch: fetchHospitals };
};

// ─── useHospitalActions Hook ──────────────────────────────────────────────────

interface UseHospitalActionsReturn {
  isSuspending: boolean;
  isActivating: boolean;
  suspend: (id: string, reason: string) => Promise<void>;
  activate: (id: string) => Promise<void>;
}

export const useHospitalActions = (onSuccess?: () => void): UseHospitalActionsReturn => {
  const [isSuspending, setIsSuspending] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const suspend = async (id: string, reason: string) => {
    setIsSuspending(true);
    try {
      await superAdminService.suspendHospital(id, reason);
      onSuccess?.();
    } finally {
      setIsSuspending(false);
    }
  };

  const activate = async (id: string) => {
    setIsActivating(true);
    try {
      await superAdminService.activateHospital(id);
      onSuccess?.();
    } finally {
      setIsActivating(false);
    }
  };

  return { isSuspending, isActivating, suspend, activate };
};