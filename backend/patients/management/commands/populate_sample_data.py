from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from patients.models import Patient
from appointments.models import Appointment
from medical_records.models import MedicalRecord, Prescription, LabTest
from billing.models import Bill, BillItem, Payment
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = 'Populate database with sample EHR data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create user groups
        doctor_group, _ = Group.objects.get_or_create(name='Doctors')
        nurse_group, _ = Group.objects.get_or_create(name='Nurses')
        admin_group, _ = Group.objects.get_or_create(name='Administrators')
        
        # Create sample doctors
        doctors = []
        doctor_data = [
            ('Dr. Sarah Johnson', 'sarah.johnson@cu.edu'),
            ('Dr. Michael Chen', 'michael.chen@cu.edu'),
            ('Dr. Emily Rodriguez', 'emily.rodriguez@cu.edu'),
        ]
        
        for name, email in doctor_data:
            first_name, last_name = name.split(' ', 1)[1], name.split(' ', 1)[0]
            user, created = User.objects.get_or_create(
                username=email.split('@')[0],
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'is_staff': True
                }
            )
            if created:
                user.set_password('password123')
                user.save()
            user.groups.add(doctor_group)
            doctors.append(user)
        
        self.stdout.write(f'Created {len(doctors)} doctors')
        
        # Create sample patients
        patients = []
        patient_data = [
            ('John', 'Doe', '1985-03-15', 'M', '555-0101', 'john.doe@email.com'),
            ('Jane', 'Smith', '1990-07-22', 'F', '555-0102', 'jane.smith@email.com'),
            ('Robert', 'Johnson', '1978-11-08', 'M', '555-0103', 'robert.j@email.com'),
            ('Maria', 'Garcia', '1995-02-14', 'F', '555-0104', 'maria.garcia@email.com'),
            ('David', 'Wilson', '1982-09-30', 'M', '555-0105', 'david.wilson@email.com'),
        ]
        
        for i, (first, last, dob, gender, phone, email) in enumerate(patient_data, 1):
            patient, created = Patient.objects.get_or_create(
                patient_id=f'CU{i:04d}',
                defaults={
                    'first_name': first,
                    'last_name': last,
                    'date_of_birth': dob,
                    'gender': gender,
                    'phone': phone,
                    'email': email,
                    'address': f'{100 + i} Main St, University City, State 12345',
                    'emergency_contact_name': f'Emergency Contact {i}',
                    'emergency_contact_phone': f'555-010{i + 5}',
                    'blood_type': random.choice(['A+', 'B+', 'O+', 'AB+']),
                    'allergies': 'None known' if i % 2 == 0 else 'Penicillin',
                }
            )
            patients.append(patient)
        
        self.stdout.write(f'Created {len(patients)} patients')
        
        # Create sample appointments
        appointments = []
        for i, patient in enumerate(patients):
            for j in range(2):  # 2 appointments per patient
                appointment_date = datetime.now() + timedelta(days=random.randint(-30, 30))
                appointment = Appointment.objects.create(
                    patient=patient,
                    doctor=random.choice(doctors),
                    appointment_date=appointment_date,
                    appointment_type=random.choice(['consultation', 'follow_up', 'routine_checkup']),
                    status=random.choice(['scheduled', 'completed', 'confirmed']),
                    reason=f'Routine checkup and health assessment {i}-{j}',
                    duration_minutes=30
                )
                appointments.append(appointment)
        
        self.stdout.write(f'Created {len(appointments)} appointments')
        
        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))