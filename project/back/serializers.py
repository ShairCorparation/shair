from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from app.models import Request



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
        return Request.objects.filter(executor=instance.pk, status='complete').count()

    def get_fraht(self, instance):
        requests = Request.objects.filter(status='complete', executor=instance.id).only('currency', 'customer_price')
        total_sum = 0

        for request in requests:
            converted_price = request.customer_price * self.context[request.currency]
            total_sum += converted_price
 
        return(round(total_sum, 2))
    
    def get_consumption(self, instance):
        requests = Request.objects.filter(status='complete', executor=instance.id).only('currency', 'customer_price')
        total_sum = 0

        for request in requests:
            converted_price = request.carrier.rate * self.context[request.carrier.currency]
            total_sum += converted_price

        return(round(total_sum, 2))

    class Meta:
        model = User
        fields = ('id', 'fraht', 'count_request', 'consumption', 'first_name', 'last_name')

