from django.db import models
from django.contrib.auth.models import User
from patients.models import Patient


class Visit(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('with_nurse', 'With Nurse'),
        ('ready_for_doctor', 'Ready for Doctor'),
        ('with_doctor', 'With Doctor'),
        ('in_lab', 'In Lab'),
        ('at_pharmacy', 'At Pharmacy'),
        ('pending_payment', 'Pending Payment'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    PRIORITY_CHOICES = [
        ('emergency', 'Emergency'),
        ('urgent', 'Urgent'),
        ('normal', 'Normal'),
        ('routine', 'Routine'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='visits')
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')

    nurse = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='nurse_visits')
    doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='doctor_visits')

    # Triage info (filled by nurse)
    complaint = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    current_medications = models.TextField(blank=True)
    nurse_notes = models.TextField(blank=True)

    # Vitals
    blood_pressure = models.CharField(max_length=20, blank=True)
    temperature = models.CharField(max_length=10, blank=True)
    pulse = models.CharField(max_length=10, blank=True)
    weight = models.CharField(max_length=10, blank=True)
    height = models.CharField(max_length=10, blank=True)

    # Doctor notes
    history = models.TextField(blank=True)
    examination = models.TextField(blank=True)
    diagnosis = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-time']

    def __str__(self):
        return f"{self.patient} - {self.date} ({self.status})"


class VisitPrescription(models.Model):
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE, related_name='prescriptions')
    drug = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    dispensed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.drug} ({self.visit})"


class VisitLabRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('complete', 'Complete'),
    ]
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE, related_name='lab_requests')
    test_name = models.CharField(max_length=200)
    requested_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='lab_requests_made')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.test_name} ({self.visit})"


class VisitLabResult(models.Model):
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE, related_name='lab_results')
    test_name = models.CharField(max_length=200)
    file_name = models.CharField(max_length=255, blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='lab_results_uploaded')
    result = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=15, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.test_name} result ({self.visit})"


class VisitPayment(models.Model):
    METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('mobile_money', 'Mobile Money'),
        ('card', 'Card'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    ]
    visit = models.OneToOneField(Visit, on_delete=models.CASCADE, related_name='payment')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    method = models.CharField(max_length=15, choices=METHOD_CHOICES, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Payment for {self.visit} ({self.status})"


class VisitPaymentItem(models.Model):
    payment = models.ForeignKey(VisitPayment, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.description
