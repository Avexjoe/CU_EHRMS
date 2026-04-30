from django.db import models
from django.contrib.auth.models import User


class Patient(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    BLOOD_TYPE_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-'),
    ]

    patient_id = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)

    # Address
    country = models.CharField(max_length=100, default='Ghana')
    city = models.CharField(max_length=100, blank=True)
    street = models.CharField(max_length=200, blank=True)
    digital_address = models.CharField(max_length=50, blank=True)

    blood_type = models.CharField(max_length=3, choices=BLOOD_TYPE_CHOICES, blank=True)
    allergies = models.TextField(blank=True)
    chronic_conditions = models.TextField(blank=True)
    medical_history = models.TextField(blank=True)

    # IDs
    student_id = models.CharField(max_length=50, blank=True)
    staff_id = models.CharField(max_length=50, blank=True)
    national_id = models.CharField(max_length=50, blank=True)
    nhis_card = models.CharField(max_length=50, blank=True)

    # Emergency contacts
    emergency_contact1_name = models.CharField(max_length=100, blank=True)
    emergency_contact1_phone = models.CharField(max_length=15, blank=True)
    emergency_contact2_name = models.CharField(max_length=100, blank=True)
    emergency_contact2_phone = models.CharField(max_length=15, blank=True)

    multiple_birth = models.BooleanField(default=False)
    department = models.CharField(max_length=100, blank=True)

    # Transient visit-day fields
    checked_in = models.BooleanField(default=False)
    arrival_time = models.CharField(max_length=10, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient_id} - {self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def age(self):
        from datetime import date
        today = date.today()
        dob = self.date_of_birth
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

    @property
    def address(self):
        parts = [self.street, self.city, self.country]
        return ', '.join(p for p in parts if p)
