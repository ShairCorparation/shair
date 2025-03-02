from app.models import Client, Request, Carrier, Docs, RequestCarrier, Currency
from back.serializers import CustomUserSerializer
from rest_framework import serializers
from project.settings.django_environ import env
import datetime as dt

URL = env('BACKEND_LOCAL_URL')
FILE_STORAGE = env('FILE_STORAGE')


class ClientSerializer(serializers.ModelSerializer):
    count_request = serializers.SerializerMethodField()

    def get_count_request(self, instance):
        return Request.objects.filter(client=instance.pk, status__in=['on it', 'complete', 'archived']).count()

    class Meta:
        model = Client
        fields = ['id', 'company_name', 'contact_person', 'unp', 'contact_info', 'count_request', 'note']


class CarrierSerializer(serializers.ModelSerializer):
    count_request = serializers.SerializerMethodField()

    def get_count_request(self, instance):
        return Request.objects.filter(status__in=['on it', 'complete', 'archived']).filter(carrier__carrier_id=instance.pk).count()

    class Meta:
        model = Carrier
        fields = ['id', 'company_name', 'contact_person', 'unp', 'contact_info', 'count_request', 'note', 'rate', 'currency']


class DocsRequestSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if FILE_STORAGE == 'local':
            representation['file'] = f'{URL}/media/{instance.file}' 
        return representation

    class Meta:
        model = Docs
        fields = '__all__'

    
class RequestCarriersSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()
    contact_person = serializers.SerializerMethodField()
    contact_info = serializers.SerializerMethodField()
    unp = serializers.SerializerMethodField()
    
    def get_company_name(self, instance):
        return Carrier.objects.get(pk=instance.carrier_id.pk).company_name
    
    def get_contact_person(self, instance):
        return Carrier.objects.get(pk=instance.carrier_id.pk).contact_person
    
    def get_unp(self, instance):
        return Carrier.objects.get(pk=instance.carrier_id.pk).unp
        
    def get_contact_info(self, instance):
        return Carrier.objects.get(pk=instance.carrier_id.pk).contact_info
    
    class Meta:
        model = RequestCarrier
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    carrier_list = serializers.SerializerMethodField()

    def get_carrier_list(self, instance):
        return RequestCarriersSerializer(RequestCarrier.objects.filter(request_id=instance.id), many=True).data


    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['client'] = ClientSerializer(instance.client).data
        representation['date_of_request'] = instance.date_of_request.strftime("%Y-%m-%d")
        return representation
    
    class Meta:
        model = Request
        fields = '__all__'


class RequestListSerializer(serializers.ModelSerializer):
    carrier_list = serializers.SerializerMethodField()

    def get_carrier_list(self, instance):
        return RequestCarriersSerializer(RequestCarrier.objects.filter(request_id=instance.id), many=True).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.currency == 'RUB':
            representation['customer_price'] = round(instance.customer_price * self.context[instance.currency] / 100, 2)
        elif instance.currency == 'BYN':
            representation['customer_price'] = round(instance.customer_price, 2)
        else:
            representation['customer_price'] = round(instance.customer_price * self.context[instance.currency], 2)
        representation['client'] = ClientSerializer(instance.client).data
        representation['date_of_request'] = instance.date_of_request.strftime("%Y-%m-%d")
        return representation

    class Meta:
        model = Request
        fields = '__all__'


class OrdersSerializer(serializers.ModelSerializer):
    receive_doc_status = serializers.SerializerMethodField()
    
    def get_receive_doc_status(self, instance):
        status = ''
        if instance.receive_doc_date:
            diff_date = (dt.datetime.now() - instance.receive_doc_date.replace(tzinfo=None)).days
            if 6 < diff_date < 16:
                status = 'easy'
            elif 15 < diff_date < 21:
                status = 'medium'
            elif diff_date > 20:
                status = 'hard'
        return status

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['client'] = ClientSerializer(instance.client).data
        representation['carrier'] = RequestCarriersSerializer(instance.carrier).data
        representation['executor'] = CustomUserSerializer(instance.executor).data
        representation['date_of_request'] = instance.date_of_request.strftime("%Y-%m-%d")
        return representation

    class Meta:
        model = Request
        fields = '__all__'
            

class CountriesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Request
        fields = ['country_of_dispatch', 'city_of_dispatch', 'delivery_country', 'delivery_city']
        

class CurrencySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Currency
        fields ='__all__'