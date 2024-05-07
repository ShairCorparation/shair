from django.shortcuts import render
from app.models import Carrier, Client, Request, Docs, Currency
from app.serializers import ClientSerializer, RequestSerializer, CarrierSerializer, \
        OrdersSerializer, DocsRequestSerializer, ClientFinesSerializer, ClientOvercomesSerializer, RequestListSerializer, \
        CountriesSerializer
from rest_framework.viewsets import mixins, GenericViewSet
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view
from app.filters import client_filters, carrier_filters
from project.settings.django_environ import env
from app.helpers import get_currencies
from django.db.utils import IntegrityError
import json


OXILOR_URL = env('OXILOR_URL')
OXILOR_KEY = env('OXILOR_KEY')

class ClientViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet):

    serializer_class = ClientSerializer

    def get_queryset(self):        
        return client_filters(self.request, Client.objects.all())

    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
    

    @action(detail=False, methods=['GET'])
    def fines(self, request, *args, **kwargs):
        currency_data = get_currencies()
        clients_id = Request.objects.filter(status='on it', payment_from_client=False).values_list('client', flat=True)
        serializer = ClientFinesSerializer(self.get_queryset().filter(pk__in=clients_id), many=True, context=currency_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['GET'])
    def overcomes(self, request, *args, **kwargs):
        currency_data = get_currencies()
        clients_id = Request.objects.filter(status='on it').values_list('client', flat=True)
        serializer = ClientOvercomesSerializer(self.get_queryset().filter(pk__in=clients_id), many=True, context=currency_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class RequestViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class= RequestSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Request.objects.all().order_by('date_of_request')
        else:
            return Request.objects.all().order_by('date_of_request').filter(executor=self.request.user.pk)

    def list(self, request, *args, **kwargs):
        currency_data = get_currencies()
        instances = self.get_queryset().filter(status='created')
        serializer = RequestListSerializer(instances, many=True, context=currency_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
        return Response({'message': 'Что-то пошло не так!'}, status=status.HTTP_400_BAD_REQUEST)
    
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
        instances = self.get_queryset().filter(status='on it')
        serializer = OrdersSerializer(instances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['GET'])
    def archived(self, request, *args, **kwargs):
        instances = self.get_queryset().filter(status__in=['archived', 'complete'])
        serializer = OrdersSerializer(instances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CarrierViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    GenericViewSet
):
    permission_classes = [IsAuthenticated]
    serializer_class= CarrierSerializer

    def get_queryset(self):
        return carrier_filters(self.request)
    
    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    

    @action(detail=True, methods=['GET'])
    def by_request(self, request, pk, *args, **kwargs):
        queryset = self.get_queryset().filter(request_id__executor__pk=self.request.user.pk)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['GET'])
    def overcomes(self, request, *args, **kwargs):
        carriers_id = Request.objects.filter(status='on it').values_list('carrier', flat=True)
        queryset = Carrier.objects.filter(pk__in=carriers_id)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
    serializer_class = DocsRequestSerializer

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