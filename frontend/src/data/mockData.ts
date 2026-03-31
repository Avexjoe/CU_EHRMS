export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
}

export interface Vitals {
  bloodPressure: string;
  temperature: string;
  pulse: string;
  weight: string;
  height: string;
}

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  time: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'ready_for_doctor';
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
}

export interface Prescription {
  id: string;
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
}

export const PATIENTS: Patient[] = [
  { id: 'P001', name: 'John Smith', age: 45, gender: 'Male', dob: '1981-03-15', phone: '555-0101', address: '123 Main St', bloodType: 'A+', allergies: ['Penicillin'], chronicConditions: ['Hypertension'] },
  { id: 'P002', name: 'Jane Doe', age: 32, gender: 'Female', dob: '1994-07-22', phone: '555-0102', address: '456 Oak Ave', bloodType: 'O-', allergies: [], chronicConditions: [] },
  { id: 'P003', name: 'Robert Johnson', age: 58, gender: 'Male', dob: '1968-11-30', phone: '555-0103', address: '789 Pine Rd', bloodType: 'B+', allergies: ['Sulfa drugs', 'Aspirin'], chronicConditions: ['Diabetes Type 2', 'Hypertension'] },
  { id: 'P004', name: 'Lisa Williams', age: 27, gender: 'Female', dob: '1999-01-05', phone: '555-0104', address: '321 Elm St', bloodType: 'AB+', allergies: ['Latex'], chronicConditions: [] },
  { id: 'P005', name: 'Michael Brown', age: 63, gender: 'Male', dob: '1963-09-18', phone: '555-0105', address: '654 Maple Dr', bloodType: 'A-', allergies: [], chronicConditions: ['COPD', 'Arthritis'] },
];

export const VISITS: Visit[] = [
  {
    id: 'V001', patientId: 'P001', date: '2026-03-27', time: '09:00', status: 'ready_for_doctor', nurseId: '3',
    vitals: { bloodPressure: '140/90', temperature: '98.6', pulse: '78', weight: '185', height: '5\'11"' },
    complaint: 'Persistent headache for 3 days', allergies: 'Penicillin', currentMedications: 'Lisinopril 10mg', nurseNotes: 'Patient appears fatigued.',
  },
  {
    id: 'V002', patientId: 'P003', date: '2026-03-27', time: '09:30', status: 'completed', nurseId: '3', doctorId: '2',
    vitals: { bloodPressure: '150/95', temperature: '99.1', pulse: '82', weight: '210', height: '5\'9"' },
    complaint: 'Follow-up for diabetes management', allergies: 'Sulfa drugs, Aspirin', currentMedications: 'Metformin 500mg, Lisinopril 20mg',
    nurseNotes: 'Blood sugar reading: 180 mg/dL',
    doctorNotes: { history: 'Patient reports occasional dizziness.', examination: 'BP elevated. Mild peripheral edema.', diagnosis: 'Uncontrolled Type 2 Diabetes with Hypertension' },
    prescriptions: [
      { id: 'RX001', drug: 'Metformin', dosage: '1000mg', frequency: 'Twice daily', duration: '30 days' },
      { id: 'RX002', drug: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
    ],
  },
  {
    id: 'V003', patientId: 'P002', date: '2026-03-26', time: '14:00', status: 'completed', nurseId: '3', doctorId: '2',
    vitals: { bloodPressure: '118/76', temperature: '98.4', pulse: '72', weight: '135', height: '5\'6"' },
    complaint: 'Annual physical exam', allergies: 'None', currentMedications: 'None',
    nurseNotes: 'Patient in good health.',
    doctorNotes: { history: 'No significant findings.', examination: 'All within normal limits.', diagnosis: 'Healthy - routine checkup' },
    prescriptions: [],
  },
  {
    id: 'V004', patientId: 'P004', date: '2026-03-27', time: '10:15', status: 'waiting', nurseId: undefined,
  },
];

export const COMMON_DRUGS = [
  'Acetaminophen', 'Amoxicillin', 'Amlodipine', 'Atorvastatin', 'Azithromycin',
  'Ciprofloxacin', 'Ibuprofen', 'Lisinopril', 'Metformin', 'Metoprolol',
  'Omeprazole', 'Prednisone', 'Sertraline', 'Simvastatin', 'Tramadol',
];
