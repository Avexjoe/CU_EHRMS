const BASE = '/api';

function getToken() {
  return localStorage.getItem('ehr_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: ApiUser }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request('/auth/logout/', { method: 'POST' }),
  me: () => request<ApiUser>('/auth/me/'),
};

// Patients
export const patientsApi = {
  list: (q?: string) =>
    request<{ results: ApiPatient[]; count: number }>(`/patients/${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  get: (id: string) => request<ApiPatient>(`/patients/${id}/`),
  create: (data: Record<string, unknown>) =>
    request<ApiPatient>('/patients/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) =>
    request<ApiPatient>(`/patients/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  checkin: (patientId: string, checkedIn: boolean, arrivalTime?: string) =>
    request<ApiPatient>(`/patients/${patientId}/checkin/`, {
      method: 'PATCH',
      body: JSON.stringify({ checkedIn, arrivalTime }),
    }),
};

// Visits
export const visitsApi = {
  list: (params?: { date?: string; patient_id?: string; status?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ results: ApiVisit[]; count: number }>(`/visits/${qs ? `?${qs}` : ''}`);
  },
  get: (id: number) => request<ApiVisit>(`/visits/${id}/`),
  create: (data: Record<string, unknown>) =>
    request<ApiVisit>('/visits/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request<ApiVisit>(`/visits/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  addPrescription: (visitId: number, data: Record<string, unknown>) =>
    request<ApiVisit>(`/visits/${visitId}/prescriptions/`, { method: 'POST', body: JSON.stringify(data) }),
  updatePrescription: (visitId: number, rxId: number, data: Record<string, unknown>) =>
    request<ApiVisit>(`/visits/${visitId}/prescriptions/${rxId}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  addLabRequest: (visitId: number, data: Record<string, unknown>) =>
    request<ApiVisit>(`/visits/${visitId}/lab-requests/`, { method: 'POST', body: JSON.stringify(data) }),
  updateLabRequest: (visitId: number, lrId: number, data: Record<string, unknown>) =>
    request<ApiVisit>(`/visits/${visitId}/lab-requests/${lrId}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  addLabResult: (visitId: number, data: Record<string, unknown>) =>
    request<ApiVisit>(`/visits/${visitId}/lab-results/`, { method: 'POST', body: JSON.stringify(data) }),
  managePayment: (visitId: number, data: Record<string, unknown>) =>
    request<ApiVisit>(`/visits/${visitId}/payment/`, { method: 'POST', body: JSON.stringify(data) }),
};

// Types
export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'lab_tech' | 'pharmacist' | 'receptionist' | 'cashier';
}

export interface ApiPatient {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  studentId: string;
  staffId: string;
  nationalId: string;
  nhisCard: string;
  country: string;
  city: string;
  street: string;
  digitalAddress: string;
  emergencyContact1Name: string;
  emergencyContact1Phone: string;
  emergencyContact2Name: string;
  emergencyContact2Phone: string;
  multipleBirth: boolean;
  department: string;
  checkedIn: boolean;
  arrivalTime: string;
}

export interface ApiVisit {
  id: number;
  patient_id: string;
  patient_name: string;
  date: string;
  time: string;
  status: string;
  priority: string;
  nurse_id: number | null;
  doctor_id: number | null;
  complaint: string;
  allergies: string;
  current_medications: string;
  nurse_notes: string;
  vitals: {
    bloodPressure: string;
    temperature: string;
    pulse: string;
    weight: string;
    height: string;
  } | null;
  doctor_notes: {
    history: string;
    examination: string;
    diagnosis: string;
  } | null;
  prescriptions: ApiPrescription[];
  lab_requests: ApiLabRequest[];
  lab_results: ApiLabResult[];
  payment: ApiPayment | null;
}

export interface ApiPrescription {
  id: number;
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  price: string;
  dispensed: boolean;
  notes: string;
}

export interface ApiLabRequest {
  id: number;
  test_name: string;
  requested_by: number;
  requested_by_name: string;
  status: string;
  created_at: string;
}

export interface ApiLabResult {
  id: number;
  test_name: string;
  file_name: string;
  uploaded_by: number;
  uploaded_by_name: string;
  result: string;
  notes: string;
  status: string;
  created_at: string;
}

export interface ApiPayment {
  id: number;
  total_amount: string;
  amount_paid: string;
  method: string;
  status: string;
  paid_at: string | null;
  items: { id: number; description: string; amount: string }[];
}
