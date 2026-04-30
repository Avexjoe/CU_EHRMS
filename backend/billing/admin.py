from django.contrib import admin
from .models import Bill, BillItem, Payment

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ['bill_number', 'patient', 'total_amount', 'paid_amount', 'status', 'due_date']
    list_filter = ['status', 'due_date', 'created_at']
    search_fields = ['bill_number', 'patient__first_name', 'patient__last_name']

@admin.register(BillItem)
class BillItemAdmin(admin.ModelAdmin):
    list_display = ['description', 'bill', 'quantity', 'unit_price', 'total_price']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['bill', 'amount', 'payment_method', 'processed_by', 'payment_date']
    list_filter = ['payment_method', 'payment_date']