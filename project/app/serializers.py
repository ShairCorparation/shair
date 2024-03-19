from app.models import Client, Request, Carrier, Docs
from rest_framework import serializers
from project.settings.django_environ import env
from django.db.models import Sum, F

URL = env('BACKEND_URL')
FILE_STORAGE = env('FILE_STORAGE')


class ClientSerializer(serializers.ModelSerializer):
    count_request = serializers.SerializerMethodField()

    def get_count_request(self, instance):
        return Request.objects.filter(client=instance.pk, status='complete').count()

    class Meta:
        model = Client
        fields = ['id', 'company_name', 'contact_person', 'unp', 'contact_info', 'count_request', 'note']


class CarrierSerializer(serializers.ModelSerializer):
    count_request = serializers.SerializerMethodField()

    def get_count_request(self, instance):
        return Request.objects.filter(status='complete').filter(carrier__pk=instance.pk).count()


    class Meta:
        model = Carrier
        fields = ['id', 'company_name', 'contact_person', 'unp', 'contact_info', 'count_request', 'note', 'rate', 'currency', 'request_id']


class DocsRequestSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if FILE_STORAGE == 'local':
            representation['file'] = f'{URL}/media/{instance.file}' 
        return representation

    class Meta:
        model = Docs
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    carrier_list = serializers.SerializerMethodField()

    def get_carrier_list(self, instance):
        return CarrierSerializer(Carrier.objects.filter(request_id=instance.id), many=True).data

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
        return CarrierSerializer(Carrier.objects.filter(request_id=instance.id), many=True).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.currency == 'RUB':
            representation['customer_price'] = round(instance.customer_price * self.context[instance.currency] / 100, 2)
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
        representation['carrier'] = CarrierSerializer(instance.carrier).data
        representation['date_of_request'] = instance.date_of_request.strftime("%Y-%m-%d")
        return representation

    class Meta:
        model = Request
        fields = '__all__'


class ClientFinesSerializer(serializers.ModelSerializer):
    sum_fines = serializers.SerializerMethodField()

    def get_sum_fines(self, instance):
        requests = Request.objects.filter(status='on it', payment_from_client=False, client=instance.id).only('currency', 'customer_price')
        total_sum = 0

        for request in requests:
            if request.currency == 'RUB':
                converted_price = request.customer_price * self.context[request.currency] / 100
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
        return Request.objects.filter(client=instance.pk, status='complete').count()

    def get_fraht(self, instance):
        requests = Request.objects.filter(status='complete', client=instance.id).only('currency', 'customer_price')
        total_sum = 0

        for request in requests:
            converted_price = request.customer_price * self.context[request.currency]
            total_sum += converted_price
 
        return(round(total_sum, 2))
    
    def get_consumption(self, instance):
        requests = Request.objects.filter(status='complete', client=instance.id).only('currency', 'customer_price')
        total_sum = 0

        for request in requests:
            if request.carrier.currency == 'RUB':
                converted_price = request.carrier.rate * self.context[request.carrier.currency] / 100
            else :
                converted_price = request.carrier.rate * self.context[request.carrier.currency]
            total_sum += converted_price

        return(round(total_sum, 2))


    class Meta:
        model = Client
        fields = '__all__'


