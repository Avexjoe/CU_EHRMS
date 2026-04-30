from rest_framework import serializers
from .models import Visit, VisitPrescription, VisitLabRequest, VisitLabResult, VisitPayment, VisitPaymentItem


class VisitPaymentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitPaymentItem
        fields = ['id', 'description', 'amount']


class VisitPaymentSerializer(serializers.ModelSerializer):
    items = VisitPaymentItemSerializer(many=True, read_only=True)

    class Meta:
        model = VisitPayment
        fields = ['id', 'total_amount', 'amount_paid', 'method', 'status', 'paid_at', 'items']


class VisitPrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitPrescription
        fields = ['id', 'drug', 'dosage', 'frequency', 'duration', 'quantity', 'price', 'dispensed', 'notes']


class VisitLabRequestSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.SerializerMethodField()

    class Meta:
        model = VisitLabRequest
        fields = ['id', 'test_name', 'requested_by', 'requested_by_name', 'status', 'created_at']

    def get_requested_by_name(self, obj):
        if obj.requested_by:
            return obj.requested_by.get_full_name() or obj.requested_by.username
        return ''


class VisitLabResultSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = VisitLabResult
        fields = ['id', 'test_name', 'file_name', 'uploaded_by', 'uploaded_by_name', 'result', 'notes', 'status', 'created_at']

    def get_uploaded_by_name(self, obj):
        if obj.uploaded_by:
            return obj.uploaded_by.get_full_name() or obj.uploaded_by.username
        return ''


class VisitSerializer(serializers.ModelSerializer):
    prescriptions = VisitPrescriptionSerializer(many=True, read_only=True)
    lab_requests = VisitLabRequestSerializer(many=True, read_only=True)
    lab_results = VisitLabResultSerializer(many=True, read_only=True)
    payment = VisitPaymentSerializer(read_only=True)
    patient_id = serializers.CharField(source='patient.patient_id', read_only=True)
    patient_name = serializers.SerializerMethodField()
    nurse_id = serializers.PrimaryKeyRelatedField(source='nurse', read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(source='doctor', read_only=True)
    vitals = serializers.SerializerMethodField()
    doctor_notes = serializers.SerializerMethodField()

    class Meta:
        model = Visit
        fields = [
            'id', 'patient_id', 'patient_name', 'date', 'time', 'status', 'priority',
            'nurse_id', 'doctor_id',
            'complaint', 'allergies', 'current_medications', 'nurse_notes',
            'vitals', 'doctor_notes',
            'prescriptions', 'lab_requests', 'lab_results', 'payment',
        ]

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_vitals(self, obj):
        if any([obj.blood_pressure, obj.temperature, obj.pulse, obj.weight, obj.height]):
            return {
                'bloodPressure': obj.blood_pressure,
                'temperature': obj.temperature,
                'pulse': obj.pulse,
                'weight': obj.weight,
                'height': obj.height,
            }
        return None

    def get_doctor_notes(self, obj):
        if any([obj.history, obj.examination, obj.diagnosis]):
            return {
                'history': obj.history,
                'examination': obj.examination,
                'diagnosis': obj.diagnosis,
            }
        return None


class VisitCreateSerializer(serializers.ModelSerializer):
    """Used for POST /visits/ — creates a new visit from patient_id."""
    patient_id = serializers.CharField(write_only=True)

    class Meta:
        model = Visit
        fields = ['patient_id', 'date', 'time', 'status', 'priority', 'complaint']
        extra_kwargs = {f: {'required': False} for f in ['status', 'priority', 'complaint']}

    def create(self, validated_data):
        from patients.models import Patient
        patient_id = validated_data.pop('patient_id')
        patient = Patient.objects.get(patient_id=patient_id)
        return Visit.objects.create(patient=patient, **validated_data)


class VisitUpdateSerializer(serializers.ModelSerializer):
    """Used for PATCH updates — accepts flat vitals/doctor_notes fields."""
    blood_pressure = serializers.CharField(required=False, allow_blank=True)
    temperature = serializers.CharField(required=False, allow_blank=True)
    pulse = serializers.CharField(required=False, allow_blank=True)
    weight = serializers.CharField(required=False, allow_blank=True)
    height = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Visit
        fields = [
            'status', 'priority', 'nurse', 'doctor',
            'complaint', 'allergies', 'current_medications', 'nurse_notes',
            'blood_pressure', 'temperature', 'pulse', 'weight', 'height',
            'history', 'examination', 'diagnosis',
        ]
        extra_kwargs = {f: {'required': False} for f in fields}
