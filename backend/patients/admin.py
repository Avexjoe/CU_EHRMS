from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['patient_id', 'full_name', 'date_of_birth', 'gender', 'phone']
    list_filter = ['gender', 'blood_type', 'created_at']
    search_fields = ['patient_id', 'first_name', 'last_name', 'phone', 'email']
    readonly_fields = ['created_at', 'updated_at']