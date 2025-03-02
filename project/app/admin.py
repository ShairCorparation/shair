from django.contrib import admin
from app.models import Client, Request, Carrier, Docs, Currency, RequestCarrier


class DocsRequestInline(admin.TabularInline):
    model = Docs
    extra = 0
    fields = ['name', 'file']

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ['USD', 'EUR', 'RUB']
    list_filter = ['USD', 'EUR', 'RUB']
    
@admin.register(RequestCarrier)
class RequestCarrierAdmin(admin.ModelAdmin):
    list_display = ['id','carrier_rate', 'carrier_currency']
    list_filter = ['id','carrier_rate', 'carrier_currency']

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['created_date', 'company_name', 'contact_person', 'unp', 'contact_info']
    list_filter = ['company_name', 'contact_person', 'unp', 'contact_info']


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    inlines = (DocsRequestInline,)
    list_display = ['name_of_cargo', 'executor', 'type_of_transport', 'date_of_shipment', 'date_of_delivery', 'status', 'client']
    list_filter = ['name_of_cargo', 'executor', 'type_of_transport', 'date_of_shipment', 'date_of_delivery', 'status']


@admin.register(Carrier)
class CarrierAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'contact_person', 'unp', 'contact_info', 'rate', 'currency']
    list_filter = ['company_name', 'contact_person', 'unp', 'contact_info', 'rate', 'currency']
