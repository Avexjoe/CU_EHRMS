from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Visit, VisitPrescription, VisitLabRequest, VisitLabResult, VisitPayment, VisitPaymentItem
from .serializers import (
    VisitSerializer, VisitCreateSerializer, VisitUpdateSerializer,
    VisitPrescriptionSerializer, VisitLabRequestSerializer,
    VisitLabResultSerializer, VisitPaymentSerializer,
)


class VisitViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Visit.objects.select_related('patient', 'nurse', 'doctor').prefetch_related(
        'prescriptions', 'lab_requests', 'lab_results', 'payment__items'
    )

    def get_serializer_class(self):
        if self.action == 'create':
            return VisitCreateSerializer
        if self.action in ('partial_update', 'update'):
            return VisitUpdateSerializer
        return VisitSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        date = self.request.query_params.get('date')
        patient_id = self.request.query_params.get('patient_id')
        status_param = self.request.query_params.get('status')
        if date:
            qs = qs.filter(date=date)
        if patient_id:
            qs = qs.filter(patient__patient_id=patient_id)
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = VisitCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        visit = serializer.save()
        return Response(VisitSerializer(visit).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = VisitUpdateSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(VisitSerializer(instance).data)

    @action(detail=True, methods=['post'], url_path='prescriptions')
    def add_prescription(self, request, pk=None):
        visit = self.get_object()
        s = VisitPrescriptionSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        s.save(visit=visit)
        return Response(VisitSerializer(visit).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path=r'prescriptions/(?P<rx_id>\d+)')
    def update_prescription(self, request, pk=None, rx_id=None):
        visit = self.get_object()
        rx = VisitPrescription.objects.get(pk=rx_id, visit=visit)
        s = VisitPrescriptionSerializer(rx, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(VisitSerializer(visit).data)

    @action(detail=True, methods=['post'], url_path='lab-requests')
    def add_lab_request(self, request, pk=None):
        visit = self.get_object()
        data = {**request.data, 'requested_by': request.user.pk}
        s = VisitLabRequestSerializer(data=data)
        s.is_valid(raise_exception=True)
        s.save(visit=visit, requested_by=request.user)
        return Response(VisitSerializer(visit).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path=r'lab-requests/(?P<lr_id>\d+)')
    def update_lab_request(self, request, pk=None, lr_id=None):
        visit = self.get_object()
        lr = VisitLabRequest.objects.get(pk=lr_id, visit=visit)
        s = VisitLabRequestSerializer(lr, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(VisitSerializer(visit).data)

    @action(detail=True, methods=['post'], url_path='lab-results')
    def add_lab_result(self, request, pk=None):
        visit = self.get_object()
        s = VisitLabResultSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        s.save(visit=visit, uploaded_by=request.user)
        return Response(VisitSerializer(visit).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post', 'patch'], url_path='payment')
    def manage_payment(self, request, pk=None):
        visit = self.get_object()
        payment, created = VisitPayment.objects.get_or_create(
            visit=visit,
            defaults={
                'total_amount': request.data.get('total_amount', 0),
                'amount_paid': request.data.get('amount_paid', 0),
                'status': request.data.get('status', 'pending'),
            }
        )
        if not created:
            for field in ('total_amount', 'amount_paid', 'method', 'status'):
                if field in request.data:
                    setattr(payment, field, request.data[field])
            if request.data.get('status') == 'paid' and not payment.paid_at:
                payment.paid_at = timezone.now()
            payment.save()

        items_data = request.data.get('items', [])
        if items_data:
            payment.items.all().delete()
            for item in items_data:
                VisitPaymentItem.objects.create(
                    payment=payment,
                    description=item['description'],
                    amount=item['amount'],
                )

        return Response(VisitSerializer(visit).data)
