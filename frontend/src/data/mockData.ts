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
