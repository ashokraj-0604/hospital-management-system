// src/hooks/hospital-admin/useBedWards.ts

'use client';

import { useEffect, useState } from 'react';
import { hospitalAdminService } from '../../services/hospital-admin/hospitalAdmin.service';
import type { BedWard } from '../../types/hospitals';

const MOCK_WARDS: BedWard[] = [
  { ward_id: 'w1', ward_name: 'General ward', ward_type: 'GENERAL',     total_beds: 50, occupied_beds: 38 },
  { ward_id: 'w2', ward_name: 'ICU',           ward_type: 'ICU',        total_beds: 16, occupied_beds: 14 },
  { ward_id: 'w3', ward_name: 'Maternity',     ward_type: 'MATERNITY',  total_beds: 20, occupied_beds: 8  },
  { ward_id: 'w4', ward_name: 'Paediatrics',   ward_type: 'PAEDIATRICS',total_beds: 24, occupied_beds: 17 },
  { ward_id: 'w5', ward_name: 'Private rooms', ward_type: 'PRIVATE',    total_beds: 10, occupied_beds: 10 },
];

export function useBedWards() {
  const [wards, setWards] = useState<BedWard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await hospitalAdminService.getBedWards();
        if (mounted) setWards(data);
      } catch {
        if (mounted) setWards(MOCK_WARDS);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { wards, isLoading };
}