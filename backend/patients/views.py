from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Patient
from .serializers import PatientSerializer, PatientCreateSerializer


class PatientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Patient.objects.all().order_by('patient_id')

    def get_serializer_class(self):
        if self.action == 'create':
            return PatientCreateSerializer
        return PatientSerializer

    def create(self, request, *args, **kwargs):
        s = PatientCreateSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        patient = s.save()
        return Response(PatientSerializer(patient).data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.query_params.get('q', '').strip()
        if q:
            from django.db.models import Q
            qs = qs.filter(
                Q(first_name__icontains=q) | Q(last_name__icontains=q) |
                Q(patient_id__icontains=q) | Q(student_id__icontains=q) |
                Q(staff_id__icontains=q) | Q(national_id__icontains=q)
            )
        return qs

    @action(detail=False, methods=['patch'], url_path=r'(?P<patient_id>[^/.]+)/checkin')
    def checkin(self, request, patient_id=None):
        patient = Patient.objects.get(patient_id=patient_id)
        patient.checked_in = request.data.get('checkedIn', True)
        patient.arrival_time = request.data.get('arrivalTime', '')
        patient.save()
        return Response(PatientSerializer(patient).data)
