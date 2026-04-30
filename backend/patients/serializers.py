from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='patient_id', read_only=True)
    name = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    dob = serializers.DateField(source='date_of_birth')
    gender = serializers.SerializerMethodField()
    bloodType = serializers.CharField(source='blood_type', allow_blank=True, required=False)
    allergies = serializers.SerializerMethodField()
    chronicConditions = serializers.SerializerMethodField()
    studentId = serializers.CharField(source='student_id', allow_blank=True, required=False)
    staffId = serializers.CharField(source='staff_id', allow_blank=True, required=False)
    nationalId = serializers.CharField(source='national_id', allow_blank=True, required=False)
    nhisCard = serializers.CharField(source='nhis_card', allow_blank=True, required=False)
    digitalAddress = serializers.CharField(source='digital_address', allow_blank=True, required=False)
    emergencyContact1Name = serializers.CharField(source='emergency_contact1_name', allow_blank=True, required=False)
    emergencyContact1Phone = serializers.CharField(source='emergency_contact1_phone', allow_blank=True, required=False)
    emergencyContact2Name = serializers.CharField(source='emergency_contact2_name', allow_blank=True, required=False)
    emergencyContact2Phone = serializers.CharField(source='emergency_contact2_phone', allow_blank=True, required=False)
    multipleBirth = serializers.BooleanField(source='multiple_birth', required=False)
    checkedIn = serializers.BooleanField(source='checked_in', required=False)
    arrivalTime = serializers.CharField(source='arrival_time', allow_blank=True, required=False)

    class Meta:
        model = Patient
        fields = [
            'id', 'firstName', 'lastName', 'name', 'age', 'gender', 'dob',
            'phone', 'address', 'bloodType', 'allergies', 'chronicConditions',
            'studentId', 'staffId', 'nationalId', 'nhisCard',
            'country', 'city', 'street', 'digitalAddress',
            'emergencyContact1Name', 'emergencyContact1Phone',
            'emergencyContact2Name', 'emergencyContact2Phone',
            'multipleBirth', 'department', 'checkedIn', 'arrivalTime',
        ]

    # Map camelCase → model field names
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')

    def get_name(self, obj):
        return obj.full_name

    def get_age(self, obj):
        return obj.age

    def get_address(self, obj):
        return obj.address

    def get_gender(self, obj):
        mapping = {'M': 'Male', 'F': 'Female', 'O': 'Other'}
        return mapping.get(obj.gender, obj.gender)

    def get_allergies(self, obj):
        if not obj.allergies:
            return []
        return [a.strip() for a in obj.allergies.split(',') if a.strip()]

    def get_chronicConditions(self, obj):
        if not obj.chronic_conditions:
            return []
        return [c.strip() for c in obj.chronic_conditions.split(',') if c.strip()]


class PatientCreateSerializer(serializers.Serializer):
    """Accepts the form fields from the Receptionist New Patient dialog."""
    firstName = serializers.CharField()
    lastName = serializers.CharField()
    dob = serializers.DateField()
    gender = serializers.ChoiceField(choices=['Male', 'Female', 'Other'], required=False, default='Other')
    phone = serializers.CharField(allow_blank=True, required=False, default='')
    studentId = serializers.CharField(allow_blank=True, required=False, default='')
    staffId = serializers.CharField(allow_blank=True, required=False, default='')
    nationalId = serializers.CharField(allow_blank=True, required=False, default='')
    nhisCard = serializers.CharField(allow_blank=True, required=False, default='')
    country = serializers.CharField(default='Ghana', required=False)
    city = serializers.CharField(allow_blank=True, required=False, default='')
    street = serializers.CharField(allow_blank=True, required=False, default='')
    digitalAddress = serializers.CharField(allow_blank=True, required=False, default='')
    emergencyContact1Name = serializers.CharField(allow_blank=True, required=False, default='')
    emergencyContact1Phone = serializers.CharField(allow_blank=True, required=False, default='')
    emergencyContact2Name = serializers.CharField(allow_blank=True, required=False, default='')
    emergencyContact2Phone = serializers.CharField(allow_blank=True, required=False, default='')
    multipleBirth = serializers.BooleanField(required=False, default=False)
    department = serializers.CharField(allow_blank=True, required=False, default='General')

    def _next_patient_id(self):
        last = Patient.objects.order_by('-patient_id').first()
        if last:
            try:
                num = int(last.patient_id.replace('CUP', '')) + 1
            except (ValueError, AttributeError):
                num = 1
        else:
            num = 1
        return f"CUP{num:05d}"

    def create(self, validated_data):
        gender_map = {'Male': 'M', 'Female': 'F', 'Other': 'O'}
        return Patient.objects.create(
            patient_id=self._next_patient_id(),
            first_name=validated_data['firstName'],
            last_name=validated_data['lastName'],
            date_of_birth=validated_data['dob'],
            gender=gender_map.get(validated_data.get('gender', 'Other'), 'O'),
            phone=validated_data.get('phone', ''),
            student_id=validated_data.get('studentId', ''),
            staff_id=validated_data.get('staffId', ''),
            national_id=validated_data.get('nationalId', ''),
            nhis_card=validated_data.get('nhisCard', ''),
            country=validated_data.get('country', 'Ghana'),
            city=validated_data.get('city', ''),
            street=validated_data.get('street', ''),
            digital_address=validated_data.get('digitalAddress', ''),
            emergency_contact1_name=validated_data.get('emergencyContact1Name', ''),
            emergency_contact1_phone=validated_data.get('emergencyContact1Phone', ''),
            emergency_contact2_name=validated_data.get('emergencyContact2Name', ''),
            emergency_contact2_phone=validated_data.get('emergencyContact2Phone', ''),
            multiple_birth=validated_data.get('multipleBirth', False),
            department=validated_data.get('department', 'General'),
        )
