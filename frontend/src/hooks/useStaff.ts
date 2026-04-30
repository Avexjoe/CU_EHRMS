import { useState, useEffect } from 'react';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Fetches staff list from the backend /api/auth/staff/ endpoint
export function useStaff(role?: string) {
  const [staff, setStaff] = useState<StaffUser[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('ehr_token');
    if (!token) return;
    fetch(`/api/auth/staff/${role ? `?role=${role}` : ''}`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((data: StaffUser[]) => setStaff(data))
      .catch(() => setStaff([]));
  }, [role]);

  return staff;
}
