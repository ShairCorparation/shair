from rest_framework import serializers
from django.contrib.auth import authenticate
from app.models import Request
from django.contrib.auth import get_user_model
from back.models import Profile

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer class to serialize registration requests and create a new user.
    """
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "username", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer class to authenticate users with username and password.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
    


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer class to serialize CustomUser model.
    """
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "is_staff")


class OvercomesUserSerializer(serializers.ModelSerializer):
    fraht = serializers.SerializerMethodField()
    count_request = serializers.SerializerMethodField()
    consumption = serializers.SerializerMethodField()

    def get_count_request(self, instance):
        return Request.objects.filter(executor=instance.pk, status='on it').count()

    def get_fraht(self, instance):
        requests = Request.objects.filter(status='on it', executor=instance.id).only('currency', 'customer_price')
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
        requests = Request.objects.filter(status='on it', executor=instance.id).only('currency', 'customer_price')
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

    class Meta:
        model = User
        fields = ('id', 'fraht', 'count_request', 'consumption', 'first_name', 'last_name')


class ExecutorFinesSerializer(serializers.ModelSerializer):
    sum_fines = serializers.SerializerMethodField()
    sum_carrier_price = serializers.SerializerMethodField()


    def get_sum_carrier_price(self, instance):
        requests = Request.objects.filter(status='on it', payment_from_carrier=False, executor=instance.id).only('carrier')
        total_sum = 0

        for request in requests:
            if request.carrier.carrier_currency == 'RUB':
                converted_price = request.carrier.carrier_rate * self.context[request.carrier.carrier_currency] / 100
            elif request.carrier.carrier_currency == 'BYN':
                converted_price =  request.carrier.carrier_rate
            else:
                converted_price = request.carrier.carrier_rate * self.context[request.carrier.carrier_currency]
            total_sum += converted_price 
            
        return(round(total_sum, 2))


    def get_sum_fines(self, instance):
        requests = Request.objects.filter(status='on it', payment_from_client=False, executor=instance.id).only('currency', 'customer_price')
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
        model = User
        fields = ['first_name', 'last_name', 'sum_fines', 'sum_carrier_price']

