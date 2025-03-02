from rest_framework import serializers
from app.models import Client, Currency, RequestCarrier
from app.serializers.serializers import ClientSerializer, RequestCarriersSerializer
from back.serializers import CustomUserSerializer
from django.contrib.auth.models import User


def conversion(instance, keys):
    currency = Currency.objects.first()

    total = 0
    for el in keys:
        if el in instance and instance[el] != None:
            substr = el.split('_')[1]
            if substr == 'rub':
                total += instance[el] * currency.RUB / 100
            elif substr == 'byn':
                total += instance[el]
            else:
                total += instance[el] * getattr(currency, substr.upper())
    return round(total, 2)
            

class SumReportSerializer(serializers.Serializer):
    sum_eur = serializers.IntegerField() 
    sum_usd = serializers.IntegerField()
    sum_rub = serializers.IntegerField()
    sum_byn = serializers.IntegerField()


class GeneralReportSerializer(SumReportSerializer):
    overcome = serializers.SerializerMethodField()
    
    carrier_eur = serializers.IntegerField()
    carrier_usd = serializers.IntegerField()
    carrier_rub = serializers.IntegerField()
    carrier_byn = serializers.IntegerField()
    
    def get_overcome(self, instance):
        arr_sum = ['sum_eur', 'sum_usd', 'sum_rub', 'sum_byn']
        arr_carrier = ['carrier_eur', 'carrier_usd', 'carrier_rub', 'carrier_byn']
        return conversion(instance, arr_sum) - conversion(instance, arr_carrier)
        

class FinesRequestSerializerByClient(GeneralReportSerializer):
    client = serializers.SerializerMethodField()

    def get_client(self, instance):
        return ClientSerializer(Client.objects.get(pk=instance['client'])).data
    

class FinesRequestSerializerByExecutor(GeneralReportSerializer):
    executor = serializers.SerializerMethodField()

    def get_executor(self, instance):
        return CustomUserSerializer(User.objects.get(pk=instance['executor'])).data
    
    
class OvercomesRequestSerializerByClient(GeneralReportSerializer):
    client = serializers.SerializerMethodField()
    count_req = serializers.IntegerField()
    
    def get_client(self, instance):
        return ClientSerializer(Client.objects.get(pk=instance['client'])).data
    
    
class OvercomesRequestSerializerByExecutor(GeneralReportSerializer):
    executor = serializers.SerializerMethodField()
    count_req = serializers.IntegerField()
    
    def get_executor(self, instance):
        return CustomUserSerializer(User.objects.get(pk=instance['executor'])).data
    
    
class ConsumptionRequestSerializer(SumReportSerializer):
    carrier = serializers.SerializerMethodField()
    
    def get_carrier(self, instance):
        return RequestCarriersSerializer(RequestCarrier.objects.get(pk=instance['carrier'])).data