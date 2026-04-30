"""
Seed the database with staff users, sample patients, and sample visits.
Run with:  python manage.py seed_db
Re-running is safe – existing records are skipped.
"""
import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import UserProfile
from patients.models import Patient
from visits.models import Visit, VisitPrescription, VisitLabRequest, VisitPayment, VisitPaymentItem


STAFF = [
    {'username': 'admin',        'email': 'admin@hospital.edu',        'first': 'Dr.',   'last': 'Admin',       'role': 'admin',        'password': 'Admin@123'},
    {'username': 'doctor',       'email': 'doctor@hospital.edu',       'first': 'Sarah', 'last': 'Chen',        'role': 'doctor',       'password': 'Doctor@123'},
    {'username': 'nurse',        'email': 'nurse@hospital.edu',        'first': 'Emily', 'last': 'Davis',       'role': 'nurse',        'password': 'Nurse@123'},
    {'username': 'labtech',      'email': 'labtech@hospital.edu',      'first': 'James', 'last': 'Wilson',      'role': 'lab_tech',     'password': 'Labtech@123'},
    {'username': 'pharmacist',   'email': 'pharmacist@hospital.edu',   'first': 'Maria', 'last': 'Garcia',      'role': 'pharmacist',   'password': 'Pharma@123'},
    {'username': 'receptionist', 'email': 'receptionist@hospital.edu', 'first': 'Ana',   'last': 'Rodriguez',   'role': 'receptionist', 'password': 'Recept@123'},
    {'username': 'cashier',      'email': 'cashier@hospital.edu',      'first': 'Kwame', 'last': 'Asante',      'role': 'cashier',      'password': 'Cashier@123'},
]

PATIENTS_DATA = [
    {
        'patient_id': 'CUP00001', 'first_name': 'John', 'last_name': 'Smith',
        'date_of_birth': datetime.date(1981, 3, 15), 'gender': 'M', 'phone': '0551234567',
        'blood_type': 'A+', 'allergies': 'Penicillin', 'chronic_conditions': 'Hypertension',
        'student_id': 'CSC/22/01/0576', 'national_id': 'GHA-123456789-0', 'nhis_card': 'NHIS-001234',
        'country': 'Ghana', 'city': 'Cape Coast', 'street': '123 Main St', 'digital_address': 'CC-001-2345',
        'emergency_contact1_name': 'Mary Smith', 'emergency_contact1_phone': '0559901234',
        'emergency_contact2_name': 'Tom Smith', 'emergency_contact2_phone': '0559905678',
        'department': 'General', 'checked_in': True, 'arrival_time': '08:45',
    },
    {
        'patient_id': 'CUP00002', 'first_name': 'Jane', 'last_name': 'Doe',
        'date_of_birth': datetime.date(1994, 7, 22), 'gender': 'F', 'phone': '0551234568',
        'blood_type': 'O-', 'allergies': '', 'chronic_conditions': '',
        'staff_id': 'STF-1002', 'national_id': 'GHA-987654321-0', 'nhis_card': 'NHIS-005678',
        'country': 'Ghana', 'city': 'Kumasi', 'street': '456 Oak Ave', 'digital_address': 'KS-002-3456',
        'emergency_contact1_name': 'Tom Doe', 'emergency_contact1_phone': '0559902345',
        'department': 'Dental', 'checked_in': False,
    },
    {
        'patient_id': 'CUP00003', 'first_name': 'Robert', 'last_name': 'Johnson',
        'date_of_birth': datetime.date(1968, 11, 30), 'gender': 'M', 'phone': '0551234569',
        'blood_type': 'B+', 'allergies': 'Sulfa drugs, Aspirin', 'chronic_conditions': 'Diabetes Type 2, Hypertension',
        'student_id': 'ENG/21/05/0234', 'national_id': 'GHA-555666777-0', 'nhis_card': 'NHIS-009012',
        'country': 'Ghana', 'city': 'Takoradi', 'street': '789 Pine Rd', 'digital_address': 'TK-003-4567',
        'emergency_contact1_name': 'Linda Johnson', 'emergency_contact1_phone': '0559903456',
        'emergency_contact2_name': 'James Johnson', 'emergency_contact2_phone': '0559907890',
        'department': 'General', 'checked_in': True, 'arrival_time': '09:30',
    },
    {
        'patient_id': 'CUP00004', 'first_name': 'Lisa', 'last_name': 'Williams',
        'date_of_birth': datetime.date(1999, 1, 5), 'gender': 'F', 'phone': '0551234570',
        'blood_type': 'AB+', 'allergies': 'Latex', 'chronic_conditions': '',
        'student_id': 'BIO/23/02/0112', 'national_id': 'GHA-111222333-0',
        'country': 'Ghana', 'city': 'Accra', 'street': '321 Elm St', 'digital_address': 'GA-004-5678',
        'emergency_contact1_name': 'Karen Williams', 'emergency_contact1_phone': '0559904567',
        'department': 'Eye Clinic', 'checked_in': True, 'arrival_time': '10:15',
    },
    {
        'patient_id': 'CUP00005', 'first_name': 'Michael', 'last_name': 'Brown',
        'date_of_birth': datetime.date(1963, 9, 18), 'gender': 'M', 'phone': '0551234571',
        'blood_type': 'A-', 'allergies': '', 'chronic_conditions': 'COPD, Arthritis',
        'staff_id': 'STF-1005', 'national_id': 'GHA-444555666-0', 'nhis_card': 'NHIS-003456',
        'country': 'Ghana', 'city': 'Tamale', 'street': '654 Maple Dr', 'digital_address': 'TM-005-6789',
        'emergency_contact1_name': 'Susan Brown', 'emergency_contact1_phone': '0559905678',
        'department': 'Cardiology', 'checked_in': False,
    },
]


class Command(BaseCommand):
    help = 'Seed the database with staff users, patients, and visits.'

    def handle(self, *args, **options):
        self._seed_staff()
        self._seed_patients()
        self._seed_visits()
        self.stdout.write(self.style.SUCCESS('Database seeded successfully.'))

    def _seed_staff(self):
        for s in STAFF:
            if not User.objects.filter(username=s['username']).exists():
                user = User.objects.create_user(
                    username=s['username'],
                    email=s['email'],
                    password=s['password'],
                    first_name=s['first'],
                    last_name=s['last'],
                )
                if s['role'] == 'admin':
                    user.is_staff = True
                    user.save()
                UserProfile.objects.create(user=user, role=s['role'])
                self.stdout.write(f"  Created user: {s['email']} (password: {s['password']})")
            else:
                self.stdout.write(f"  Skipped (exists): {s['email']}")

    def _seed_patients(self):
        for p in PATIENTS_DATA:
            if not Patient.objects.filter(patient_id=p['patient_id']).exists():
                Patient.objects.create(**p)
                self.stdout.write(f"  Created patient: {p['patient_id']}")
            else:
                self.stdout.write(f"  Skipped (exists): {p['patient_id']}")

    def _seed_visits(self):
        today = datetime.date.today()
        nurse = User.objects.filter(username='nurse').first()
        doctor = User.objects.filter(username='doctor').first()
        p1 = Patient.objects.filter(patient_id='CUP00001').first()
        p3 = Patient.objects.filter(patient_id='CUP00003').first()
        p4 = Patient.objects.filter(patient_id='CUP00004').first()

        if p1 and not Visit.objects.filter(patient=p1, date=today).exists():
            v1 = Visit.objects.create(
                patient=p1, date=today, time='09:00', status='ready_for_doctor',
                priority='normal', nurse=nurse,
                blood_pressure='140/90', temperature='37.0', pulse='78', weight='84', height='180',
                complaint='Persistent headache for 3 days', allergies='Penicillin',
                current_medications='Lisinopril 10mg', nurse_notes='Patient appears fatigued.',
            )
            self.stdout.write(f"  Created visit: {v1}")

        if p4 and not Visit.objects.filter(patient=p4, date=today).exists():
            Visit.objects.create(
                patient=p4, date=today, time='10:15', status='waiting', priority='emergency',
            )
            self.stdout.write(f"  Created emergency visit for CUP00004")

        if p3 and not Visit.objects.filter(patient=p3, date=today, status='at_pharmacy').exists():
            v3 = Visit.objects.create(
                patient=p3, date=today, time='11:00', status='at_pharmacy',
                priority='normal', nurse=nurse, doctor=doctor,
                blood_pressure='145/92', temperature='37.1', pulse='80', weight='95', height='175',
                complaint='Refill request', diagnosis='Hypertension management',
            )
            rx = VisitPrescription.objects.create(
                visit=v3, drug='Lisinopril', dosage='20mg', frequency='Once daily',
                duration='30 days', quantity=30, price=18.50,
            )
            pay = VisitPayment.objects.create(
                visit=v3, total_amount=18.50, amount_paid=0, status='pending',
            )
            VisitPaymentItem.objects.create(payment=pay, description='Lisinopril 20mg x30', amount=18.50)
            self.stdout.write(f"  Created pharmacy visit for CUP00003")
