export interface Patient {
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
  studentId?: string;
  staffId?: string;
  nationalId?: string;
  nhisCard?: string;
  country?: string;
  city?: string;
  street?: string;
  digitalAddress?: string;
  emergencyContact1Name?: string;
  emergencyContact1Phone?: string;
  emergencyContact2Name?: string;
  emergencyContact2Phone?: string;
  multipleBirth?: boolean;
  department?: string;
  checkedIn?: boolean;
  arrivalTime?: string;
}

export interface Vitals {
  bloodPressure: string;
  temperature: string;
  pulse: string;
  weight: string;
  height: string;
  heartRate?: string;
}

export type VisitPriority = 'emergency' | 'urgent' | 'normal' | 'routine';

export type VisitStatus = 'waiting' | 'with_nurse' | 'with_doctor' | 'ready_for_doctor' | 'in_lab' | 'at_pharmacy' | 'pending_payment' | 'in_progress' | 'completed';

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  time: string;
  status: VisitStatus;
  priority?: VisitPriority;
  nurseId?: string;
  doctorId?: string;
  vitals?: Vitals;
  complaint?: string;
  allergies?: string;
  currentMedications?: string;
  nurseNotes?: string;
  doctorNotes?: {
    history?: string;
    examination?: string;
    diagnosis?: string;
  };
  prescriptions?: Prescription[];
  labResults?: LabResult[];
  labRequests?: LabRequest[];
  payment?: Payment;
}

export interface Prescription {
  id: string;
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity?: number;
  price?: number;
  dispensed?: boolean;
  notes?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  result?: string;
  notes?: string;
  status?: 'pending' | 'in_progress' | 'complete';
}

export interface LabRequest {
  id: string;
  testName: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'in_progress' | 'complete';
}

export interface Payment {
  id: string;
  totalAmount: number;
  amountPaid: number;
  method?: 'cash' | 'mobile_money' | 'card';
  status: 'pending' | 'paid';
  paidAt?: string;
  items: { description: string; amount: number }[];
}

export const PATIENTS: Patient[] = [
  {
    id: 'CUP00001', firstName: 'John', lastName: 'Smith', name: 'John Smith', age: 45, gender: 'Male', dob: '1981-03-15',
    phone: '0551234567', address: '123 Main St, Accra', bloodType: 'A+', allergies: ['Penicillin'], chronicConditions: ['Hypertension'],
    studentId: 'CSC/22/01/0576', nationalId: 'GHA-123456789-0', nhisCard: 'NHIS-001234',
    country: 'Ghana', city: 'Cape Coast', street: '123 Main St', digitalAddress: 'CC-001-2345',
    emergencyContact1Name: 'Mary Smith', emergencyContact1Phone: '0559901234',
    emergencyContact2Name: 'Tom Smith', emergencyContact2Phone: '0559905678',
    department: 'General', checkedIn: true, arrivalTime: '08:45',
  },
  {
    id: 'CUP00002', firstName: 'Jane', lastName: 'Doe', name: 'Jane Doe', age: 32, gender: 'Female', dob: '1994-07-22',
    phone: '0551234568', address: '456 Oak Ave, Kumasi', bloodType: 'O-', allergies: [], chronicConditions: [],
    staffId: 'STF-1002', nationalId: 'GHA-987654321-0', nhisCard: 'NHIS-005678',
    country: 'Ghana', city: 'Kumasi', street: '456 Oak Ave', digitalAddress: 'KS-002-3456',
    emergencyContact1Name: 'Tom Doe', emergencyContact1Phone: '0559902345',
    department: 'Dental', checkedIn: false, arrivalTime: '09:10',
  },
  {
    id: 'CUP00003', firstName: 'Robert', lastName: 'Johnson', name: 'Robert Johnson', age: 58, gender: 'Male', dob: '1968-11-30',
    phone: '0551234569', address: '789 Pine Rd, Takoradi', bloodType: 'B+', allergies: ['Sulfa drugs', 'Aspirin'], chronicConditions: ['Diabetes Type 2', 'Hypertension'],
    studentId: 'ENG/21/05/0234', nationalId: 'GHA-555666777-0', nhisCard: 'NHIS-009012',
    country: 'Ghana', city: 'Takoradi', street: '789 Pine Rd', digitalAddress: 'TK-003-4567',
    emergencyContact1Name: 'Linda Johnson', emergencyContact1Phone: '0559903456',
    emergencyContact2Name: 'James Johnson', emergencyContact2Phone: '0559907890',
    department: 'General', checkedIn: true, arrivalTime: '09:30',
  },
  {
    id: 'CUP00004', firstName: 'Lisa', lastName: 'Williams', name: 'Lisa Williams', age: 27, gender: 'Female', dob: '1999-01-05',
    phone: '0551234570', address: '321 Elm St, Accra', bloodType: 'AB+', allergies: ['Latex'], chronicConditions: [],
    studentId: 'BIO/23/02/0112', nationalId: 'GHA-111222333-0',
    country: 'Ghana', city: 'Accra', street: '321 Elm St', digitalAddress: 'GA-004-5678',
    emergencyContact1Name: 'Karen Williams', emergencyContact1Phone: '0559904567',
    department: 'Eye Clinic', checkedIn: true, arrivalTime: '10:15',
  },
  {
    id: 'CUP00005', firstName: 'Michael', lastName: 'Brown', name: 'Michael Brown', age: 63, gender: 'Male', dob: '1963-09-18',
    phone: '0551234571', address: '654 Maple Dr, Tamale', bloodType: 'A-', allergies: [], chronicConditions: ['COPD', 'Arthritis'],
    staffId: 'STF-1005', nationalId: 'GHA-444555666-0', nhisCard: 'NHIS-003456',
    country: 'Ghana', city: 'Tamale', street: '654 Maple Dr', digitalAddress: 'TM-005-6789',
    emergencyContact1Name: 'Susan Brown', emergencyContact1Phone: '0559905678',
    department: 'Cardiology', checkedIn: false,
  },
];

export const VISITS: Visit[] = [
  {
    id: 'V001', patientId: 'CUP00001', date: '2026-03-27', time: '09:00', status: 'ready_for_doctor', priority: 'normal', nurseId: '3',
    vitals: { bloodPressure: '140/90', temperature: '37.0', pulse: '78', weight: '84', height: '180' },
    complaint: 'Persistent headache for 3 days', allergies: 'Penicillin', currentMedications: 'Lisinopril 10mg', nurseNotes: 'Patient appears fatigued.',
  },
  {
    id: 'V002', patientId: 'CUP00003', date: '2026-03-27', time: '09:30', status: 'completed', priority: 'routine', nurseId: '3', doctorId: '2',
    vitals: { bloodPressure: '150/95', temperature: '37.3', pulse: '82', weight: '95', height: '175' },
    complaint: 'Follow-up for diabetes management', allergies: 'Sulfa drugs, Aspirin', currentMedications: 'Metformin 500mg, Lisinopril 20mg',
    nurseNotes: 'Blood sugar reading: 10.0 mmol/L',
    doctorNotes: { history: 'Patient reports occasional dizziness.', examination: 'BP elevated. Mild peripheral edema.', diagnosis: 'Uncontrolled Type 2 Diabetes with Hypertension' },
    prescriptions: [
      { id: 'RX001', drug: 'Metformin', dosage: '1000mg', frequency: 'Twice daily', duration: '30 days', quantity: 60, price: 25.00 },
      { id: 'RX002', drug: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', quantity: 30, price: 15.00 },
    ],
    payment: { id: 'PAY001', totalAmount: 40.00, amountPaid: 40.00, method: 'mobile_money', status: 'paid', paidAt: '2026-03-27T11:30:00', items: [{ description: 'Metformin 1000mg x60', amount: 25.00 }, { description: 'Amlodipine 5mg x30', amount: 15.00 }] },
  },
  {
    id: 'V003', patientId: 'CUP00002', date: '2026-03-26', time: '14:00', status: 'completed', priority: 'normal', nurseId: '3', doctorId: '2',
    vitals: { bloodPressure: '118/76', temperature: '36.9', pulse: '72', weight: '61', height: '168' },
    complaint: 'Annual physical exam', allergies: 'None', currentMedications: 'None',
    nurseNotes: 'Patient in good health.',
    doctorNotes: { history: 'No significant findings.', examination: 'All within normal limits.', diagnosis: 'Healthy - routine checkup' },
    prescriptions: [],
  },
  {
    id: 'V004', patientId: 'CUP00004', date: '2026-03-27', time: '10:15', status: 'waiting', priority: 'emergency',
  },
  {
    id: 'V005', patientId: 'CUP00003', date: '2026-03-27', time: '11:00', status: 'at_pharmacy', priority: 'normal', nurseId: '3', doctorId: '2',
    vitals: { bloodPressure: '145/92', temperature: '37.1', pulse: '80', weight: '95', height: '175' },
    complaint: 'Refill request', doctorNotes: { diagnosis: 'Hypertension management' },
    prescriptions: [
      { id: 'RX003', drug: 'Lisinopril', dosage: '20mg', frequency: 'Once daily', duration: '30 days', quantity: 30, price: 18.50 },
    ],
    payment: { id: 'PAY002', totalAmount: 18.50, amountPaid: 0, status: 'pending', items: [{ description: 'Lisinopril 20mg x30', amount: 18.50 }] },
  },
];

export const COMMON_DRUGS = [
  'Acetaminophen', 'Amoxicillin', 'Amlodipine', 'Atorvastatin', 'Azithromycin',
  'Ciprofloxacin', 'Ibuprofen', 'Lisinopril', 'Metformin', 'Metoprolol',
  'Omeprazole', 'Prednisone', 'Sertraline', 'Simvastatin', 'Tramadol',
];

export const DEPARTMENTS = [
  'General', 'Dental', 'Eye Clinic', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Dermatology', 'ENT', 'Emergency',
];

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  waiting: 'Waiting',
  with_nurse: 'With Nurse',
  with_doctor: 'With Doctor',
  ready_for_doctor: 'Ready for Doctor',
  in_lab: 'In Lab',
  at_pharmacy: 'At Pharmacy',
  pending_payment: 'Pending Payment',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const VISIT_STATUS_COLORS: Record<VisitStatus, string> = {
  waiting: 'bg-warning/10 text-warning',
  with_nurse: 'bg-info/10 text-info',
  with_doctor: 'bg-primary/10 text-primary',
  ready_for_doctor: 'bg-info/10 text-info',
  in_lab: 'bg-accent/10 text-accent',
  at_pharmacy: 'bg-success/10 text-success',
  pending_payment: 'bg-warning/10 text-warning',
  in_progress: 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
};
