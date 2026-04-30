from django.contrib import admin
from .models import MedicalRecord, Prescription, LabTest

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'visit_date', 'chief_complaint']
    list_filter = ['visit_date', 'doctor']
    search_fields = ['patient__first_name', 'patient__last_name', 'chief_complaint']

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['medication_name', 'medical_record', 'prescribed_by', 'created_at']
    list_filter = ['prescribed_by', 'created_at']
    search_fields = ['medication_name', 'medical_record__patient__first_name']

@admin.register(LabTest)
class LabTestAdmin(admin.ModelAdmin):
    list_display = ['test_name', 'medical_record', 'status', 'ordered_by', 'ordered_date']
    list_filter = ['status', 'test_type', 'ordered_date']
    search_fields = ['test_name', 'medical_record__patient__first_name']