from app.models import Currency
from django.forms import model_to_dict

def get_currencies():
    instance = Currency.objects.first()

    return model_to_dict(instance, fields=[field.name for field in instance._meta.fields if field.name != 'id'])