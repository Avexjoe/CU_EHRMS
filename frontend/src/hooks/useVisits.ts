import { useState, useEffect, useCallback } from 'react';
import { visitsApi, ApiVisit } from '@/lib/api';

export function useVisits(params?: { date?: string; patient_id?: string; status?: string }) {
  const [visits, setVisits] = useState<ApiVisit[]>([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetch = useCallback(() => {
    setLoading(true);
    visitsApi.list(params)
      .then(data => setVisits(data.results ?? (data as any)))
      .catch(() => setVisits([]))
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { visits, loading, refetch: fetch, setVisits };
}
