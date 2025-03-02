from app.models import Carrier, Client, Request, Docs, RequestCarrier, Currency
from app.serializers import serializers, report_serializers
from rest_framework.viewsets import mixins, GenericViewSet
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from django_filters import rest_framework as filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view
from app.filters import client_filters, carrier_filters, request_filters, request_carrier_filters
from app.helpers import get_currencies
from django.db.utils import IntegrityError
from back.models import Profile
import json, datetime as dt
from django.db.models import Q, Sum, Count
from app.pagination import CustomPagination
    
class RequestViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class= serializers.RequestSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = '__all__'
    ordering = 'date_of_shipment'
    pagination_class = CustomPagination

    def get_queryset(self):
        profile = Profile.objects.get(user_id=self.request.user)
        queryset = Request.objects.all()
        if self.request.user.is_staff and not profile.is_logistics:
            return request_filters(self.request, queryset)
        else:
            return request_filters(self.request, queryset.filter(executor=self.request.user.pk))

    def list(self, request, *args, **kwargs):
        currency_data = get_currencies()
        instances = self.get_queryset().filter(status='created').order_by(self.request.query_params.get('ordering', self.ordering))
        page = self.paginate_queryset(instances)
        serializer = serializers.RequestListSerializer(page, many=True, context=currency_data)
        return self.get_paginated_response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        instance = get_object_or_404(Request, pk=self.kwargs.get('pk'))
        serializer = self.serializer_class(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Request, pk=self.kwargs.get('pk'))
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Запрос был успешно обновлен!'},status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request, *args, **kwargs):
        request.data['executor'] = request.user.pk
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(status=status.HTTP_200_OK)

    def destroy(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(Request, pk=pk)
        instance.delete()
        return Response({'message': 'Запрос был успешно удален!'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['PATCH'])
    def take_to_job(self, request, pk, *args, **kwargs):
        request.data['executor'] = request.user.pk
        instance = get_object_or_404(Request, pk=pk)

        serializer = self.serializer_class(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Запрос был взят в работу!'},status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['GET'])
    def on_it(self, request, *args, **kwargs):
        instances = self.get_queryset().filter(status='on it').order_by(self.request.query_params.get('ordering', self.ordering))
        page = self.paginate_queryset(instances)
        serializer = serializers.OrdersSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def view_request_by_carrier_or_client(self, request, *args, **kwargs):
        instances = self.get_queryset().filter(status__in=['on it', 'complete', 'archived']).order_by(self.request.query_params.get('ordering', self.ordering))
        serializer = serializers.OrdersSerializer(instances, many=True) 
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['GET'])
    def archived(self, request, *args, **kwargs):
        instances = self.get_queryset().filter(status__in=['complete', 'archived']).order_by(self.request.query_params.get('ordering', self.ordering))
        page = self.paginate_queryset(instances)
        serializer = serializers.OrdersSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)
    
    @action(detail=True, methods=['PATCH'])
    def set_receive_doc_date(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(Request, pk=pk)
        instance.receive_doc_date = dt.datetime.now()
        instance.save()
        return Response(status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['GET'])
    def get_fines(self, request, *args, **kwargs):
        switcher = request.query_params.get('switcher')
        queryset = self.get_queryset().filter(status='on it').values('executor' if switcher == 'executor' else 'client').\
            annotate(
                carrier_eur=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='EUR')),
                carrier_usd=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='USD')),
                carrier_rub=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='RUB')),
                carrier_byn=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='BYN')),
                
                sum_eur=Sum('customer_price', filter=Q(currency='EUR', payment_from_client=False)),
                sum_usd=Sum('customer_price', filter=Q(currency='USD', payment_from_client=False)),
                sum_rub=Sum('customer_price', filter=Q(currency='RUB', payment_from_client=False)),
                sum_byn=Sum('customer_price', filter=Q(currency='BYN', payment_from_client=False))
                )
        page = self.paginate_queryset(queryset)
        
        serializer = report_serializers.FinesRequestSerializerByExecutor(page, many=True) if switcher == 'executor' else\
            report_serializers.FinesRequestSerializerByClient(page, many=True)
        return self.get_paginated_response(serializer.data)
    
    @action(detail=False, methods={'GET'})
    def get_overcomes(self, request, *args, **kwargs):
        switcher = request.query_params.get('switcher')
        archive = request.query_params.get('include_archive')
        req_status = ['on it', 'archived'] if archive == 'true' else ['on it']
        queryset = self.get_queryset().filter(status__in=req_status).values('executor' if switcher == 'executor' else 'client').\
            annotate(
                count_req=Count('pk'),
                
                carrier_eur=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='EUR')),
                carrier_usd=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='USD')),
                carrier_rub=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='RUB')),
                carrier_byn=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='BYN')),
                
                sum_eur=Sum('customer_price', filter=Q(currency='EUR')),
                sum_usd=Sum('customer_price', filter=Q(currency='USD')),
                sum_rub=Sum('customer_price', filter=Q(currency='RUB')),
                sum_byn=Sum('customer_price', filter=Q(currency='BYN'))
            )
        page = self.paginate_queryset(queryset)
        serializer = report_serializers.OvercomesRequestSerializerByExecutor(page, many=True) if switcher == 'executor' else\
            report_serializers.OvercomesRequestSerializerByClient(page, many=True)
        return self.get_paginated_response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def get_consumption(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(status='on it').values('carrier').\
            annotate(
                
                sum_eur=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='EUR')),
                sum_usd=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='USD')),
                sum_rub=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='RUB')),
                sum_byn=Sum('carrier__carrier_rate', filter=Q(carrier__carrier_currency='BYN'))
            ).order_by('-carrier')
        page = self.paginate_queryset(queryset)
        serializer = report_serializers.ConsumptionRequestSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class ClientViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet):

    serializer_class = serializers.ClientSerializer
    pagination_class = CustomPagination

    def get_queryset(self):        
        return client_filters(self.request, Client.objects.all())

    def list(self, request, *args, **kwargs):
        page = self.paginate_queryset(self.get_queryset())
        serializer = self.serializer_class(page, many=True)
        return self.get_paginated_response(serializer.data)
    
    def update(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(Client, pk=pk)
        serializer = self.serializer_class(instance, request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message' : 'Данные клиента успешно обновлены!'}, status=status.HTTP_200_OK)
        return Response({'message': 'Произошла ошибка при изменении данных!'}, status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            try:
                serializer.save()
                all_clients = self.serializer_class(self.get_queryset(), many=True) 
                return Response({'data': all_clients.data, 'message': 'Клиент был успешно создан'}, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({'message': 'Данный клиент уже существует!'}, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(Client, pk=pk)
        instance.delete()
        return Response({'message': 'Клиент был успешно удален'}, status=status.HTTP_200_OK)


class CarrierViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class= serializers.CarrierSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        return carrier_filters(self.request)
    
    def list(self, request, *args, **kwargs):
        page = self.paginate_queryset(self.get_queryset())
        serializer = self.serializer_class(page, many=True)
        return self.get_paginated_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Перевозчик был успешно создан'}, status=status.HTTP_200_OK)
        return Response({'message': 'Что-то пошло не так!'}, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(Carrier, pk=pk)
        serializer = self.serializer_class(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def update(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(Carrier, pk=pk)
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Данные перевозчика были успешно обновлены'}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(Carrier, pk=pk)
        instance.delete()
        return Response({'message': 'Перевозчик был успешно удален!'}, status=status.HTTP_200_OK)
    

class RequestCarrierViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet
    ):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.RequestCarriersSerializer
    
    def get_queryset(self):
        return request_carrier_filters(self.request)
    
    def list(self, request, *args, **kwargs):
        instances = self.get_queryset()
        serializer = self.serializer_class(instances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Перевозчик был добавлен в запрос'}, status=status.HTTP_201_CREATED)
        
    def update(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(RequestCarrier, pk=pk)
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Данные были обновлены'}, status=status.HTTP_200_OK)
        
    def destroy(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(RequestCarrier, pk=pk)
        instance.delete()
        return Response({'message': 'Перевозчик был удален с запроса'}, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=['GET'])
    def consumption(self, request, *args, **kwargs):
        carriers_id = Request.objects.filter(status='on it').values_list('carrier', flat=True)
        queryset = self.get_queryset().filter(pk__in=carriers_id)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

  

class DocsRequestsViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.DocsRequestSerializer

    def get_queryset(self):
        return Docs.objects.all()
    
    def list(self, request, *args, **kwargs):
        docs = self.get_queryset().filter(request=request.query_params['request_id'])
        serializer = self.serializer_class(docs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Документ был успешно загружен'}, status=status.HTTP_200_OK)
        return Response({'message': 'Что-то пошло не так!'}, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk, *args, **kwargs):
        doc = get_object_or_404(Docs, pk=pk)
        doc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

        
@api_view()
def get_countries_and_cities(request, *args, **kwargs):
    data = {'countries': set(), 'cities': set()}
    instance = Request.objects.all()
    for el in instance:
        data['countries'].update({el.country_of_dispatch, el.delivery_country})
        data['cities'].update({el.city_of_dispatch, el.delivery_city})
    data['countries'] = list(data['countries'])
    data['cities'] = list(data['cities'])

    json_data = json.dumps(data, ensure_ascii=False)

    return Response(json_data, status=status.HTTP_200_OK)


@api_view()
def get_currency(request, *args, **kwargs):
    instance = Currency.objects.first()
    serializer = serializers.CurrencySerializer(instance)
    return Response(serializer.data, status=status.HTTP_200_OK)