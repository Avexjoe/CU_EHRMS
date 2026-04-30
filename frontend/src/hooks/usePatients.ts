import { useState, useEffect, useCallback } from 'react';
import { patientsApi, ApiPatient } from '@/lib/api';

export function usePatients(query?: string) {
  const [patients, setPatients] = useState<ApiPatient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    patientsApi.list(query)
      .then(data => setPatients(data.results ?? (data as any)))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => { fetch(); }, [fetch]);

  return { patients, loading, refetch: fetch, setPatients };
}
