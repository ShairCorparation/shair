from app.models import Client, Request, Carrier, Docs, RequestCarrier
from rest_framework import serializers
from project.settings.django_environ import env

URL = env('BACKEND_URL')
FILE_STORAGE = env('FILE_STORAGE')


class ClientSerializer(serializers.ModelSerializer):
    count_request = serializers.SerializerMethodField()

    def get_count_request(self, instance):
        return Request.objects.filter(client=instance.pk, status='on it').count()

    class Meta:
        model = Client
        fields = ['id', 'company_name', 'contact_person', 'unp', 'contact_info', 'count_request', 'note']


class CarrierSerializer(serializers.ModelSerializer):
    count_request = serializers.SerializerMethodField()

    def get_count_request(self, instance):
        return Request.objects.filter(status='on it').filter(carrier__pk=instance.pk).count()


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

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['client'] = ClientSerializer(instance.client).data
        representation['carrier'] = RequestCarriersSerializer(instance.carrier).data
        representation['date_of_request'] = instance.date_of_request.strftime("%Y-%m-%d")
        return representation

    class Meta:
        model = Request
        fields = '__all__'


class ClientFinesSerializer(serializers.ModelSerializer):
    sum_fines = serializers.SerializerMethodField()
    sum_carrier_price = serializers.SerializerMethodField()

    def get_sum_carrier_price(self, instance):
        requests = Request.objects.filter(status='on it', payment_from_carrier=False, client=instance.id).only('carrier')
        total_sum = 0

        for request in requests:
            if request.carrier.carrier_currency == 'RUB':
                converted_price = request.carrier.carrier_rate * self.context[request.carrier.carrier_currency] / 100
            elif request.carrier.carrier_currency == 'BYN':
                converted_price = request.carrier.carrier_rate
            else:
                converted_price = request.carrier.carrier_rate * self.context[request.carrier.carrier_currency]
            total_sum += converted_price 
            
        return(round(total_sum, 2))


    def get_sum_fines(self, instance):
        requests = Request.objects.filter(status='on it', payment_from_client=False, client=instance.id).only('currency', 'customer_price')
        total_sum = 0

        for request in requests:
            if request.currency == 'RUB':
                converted_price = request.customer_price * self.context[request.currency] / 100
            elif request.currency == 'BYN':
                converted_price = request.customer_price
            else:
                converted_price = request.customer_price * self.context[request.currency]   
            total_sum += converted_price
 
        return(round(total_sum, 2))

    class Meta:
        model = Client
        fields = '__all__'


class ClientOvercomesSerializer(serializers.ModelSerializer):
    fraht = serializers.SerializerMethodField()
    count_request = serializers.SerializerMethodField()
    consumption = serializers.SerializerMethodField()

    def get_count_request(self, instance):
        return Request.objects.filter(client=instance.pk, status='on it').count()

    def get_fraht(self, instance):
        requests = Request.objects.filter(status='on it', client=instance.id).only('currency', 'customer_price')
        total_sum = 0

        for request in requests:
            if request.currency == 'RUB':
                converted_price = request.customer_price * self.context[request.currency] / 100
            elif request.currency == 'BYN':
                converted_price = request.customer_price
            else:
                converted_price = request.customer_price * self.context[request.currency]
            total_sum += converted_price
 
        return(round(total_sum, 2))
    
    def get_consumption(self, instance):
        requests = Request.objects.filter(status='on it', client=instance.id).only('currency', 'customer_price')
        total_sum = 0

        for request in requests:
            if request.carrier.carrier_currency == 'RUB':
                converted_price = request.carrier.carrier_rate * self.context[request.carrier.carrier_currency] / 100
            elif request.carrier.carrier_currency == 'BYN':
                converted_price = request.carrier.carrier_rate
            else :
                converted_price = request.carrier.carrier_rate * self.context[request.carrier.carrier_currency]
            total_sum += converted_price

        return(round(total_sum, 2))


    class Meta:
        model = Client
        fields = '__all__'


class CountriesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Request
        fields = ['country_of_dispatch', 'city_of_dispatch', 'delivery_country', 'delivery_city']
        

        
        



