from app.models import Request, Carrier, RequestCarrier
import datetime as dt, json


def client_filters(request, queryset):
    company_name = request.query_params.get('company_name')
    unp = request.query_params.get('unp')
    created_date_from = request.query_params.get('created_date_from')
    created_date_up = request.query_params.get('created_date_up')
    duration_country_from = request.query_params.get('duration_country_from')
    duration_country_up = request.query_params.get('duration_country_up')
    duration_city_from = request.query_params.get('duration_city_from')
    duration_city_up = request.query_params.get('duration_city_up')
    date_of_shipment = request.query_params.get('date_of_shipment')
    date_of_delivery = request.query_params.get('date_of_delivery')
    delivery_date_from = request.query_params.get('delivery_date_from')
    delivery_date_up = request.query_params.get('delivery_date_up')

    # general filters

    if company_name:
        queryset = queryset.filter(company_name=company_name)
    
    if unp:
        queryset = queryset.filter(unp=unp)

    if created_date_from:
        queryset = queryset.filter(created_date__gte=dt.datetime.strptime(created_date_from, '%Y-%m-%d'))

    if created_date_up:
        queryset = queryset.filter(created_date__lte=dt.datetime.strptime(created_date_up, '%Y-%m-%d'))

    if duration_country_from:
        clients_id = Request.objects.filter(country_of_dispatch=duration_country_from).values_list('client', flat=True)
        queryset = queryset.filter(pk__in=clients_id)

    if duration_country_up:
        clients_id = Request.objects.filter(delivery_country=duration_country_up).values_list('client', flat=True)
        queryset = queryset.filter(pk__in=clients_id)

    if duration_city_from:
        clients_id = Request.objects.filter(city_of_dispatch=duration_city_from).values_list('client', flat=True)
        queryset = queryset.filter(pk__in=clients_id)

    if duration_city_up:
        clients_id = Request.objects.filter(delivery_city=duration_city_up).values_list('client', flat=True)
        queryset = queryset.filter(pk__in=clients_id)

    if date_of_shipment:
        clients_id = Request.objects.filter(date_of_shipment__gte=dt.datetime.strptime(date_of_shipment, '%Y-%m-%d')).values_list('client', flat=True)
        queryset = queryset.filter(pk__in=clients_id)

    if date_of_delivery:
        clients_id = Request.objects.filter(date_of_delivery__lte=dt.datetime.strptime(date_of_delivery, '%Y-%m-%d')).values_list('client', flat=True)
        queryset = queryset.filter(pk__in=clients_id)

    if delivery_date_from:
        clients_id = Request.objects.filter(date_of_delivery__gte=dt.datetime.strptime(delivery_date_from, '%Y-%m-%d')).values_list('client', flat=True)
        queryset = queryset.filter(pk__in=clients_id)

    if delivery_date_up:
        clients_id = Request.objects.filter(date_of_delivery__lte=dt.datetime.strptime(delivery_date_up, '%Y-%m-%d')).values_list('client', flat=True)
        queryset = queryset.filter(pk__in=clients_id)

    return queryset.order_by('company_name')



def carrier_filters(request):
    queryset = Carrier.objects.all().order_by('company_name')
    company_name = request.query_params.get('company_name')
    unp = request.query_params.get('unp')
    created_date_from = request.query_params.get('created_date_from')
    created_date_up = request.query_params.get('created_date_up')
    duration_country_from = request.query_params.get('duration_country_from')
    duration_country_up = request.query_params.get('duration_country_up')
    duration_city_from = request.query_params.get('duration_city_from')
    duration_city_up = request.query_params.get('duration_city_up')
    date_of_shipment = request.query_params.get('date_of_shipment')
    date_of_delivery = request.query_params.get('date_of_delivery')

    # general filters

    if company_name:
        queryset = queryset.filter(company_name=company_name)
    
    if unp:
        queryset = queryset.filter(unp=unp)

    if created_date_from:
        queryset = queryset.filter(created_date__gte=dt.datetime.strptime(created_date_from, '%Y-%m-%d'))

    if created_date_up:
        queryset = queryset.filter(created_date__lte=dt.datetime.strptime(created_date_up, '%Y-%m-%d'))

    if duration_country_from:
        carriers_id = Request.objects.filter(country_of_dispatch=duration_country_from).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    if duration_country_up:
        carriers_id = Request.objects.filter(delivery_country=duration_country_up).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    if duration_city_from:
        carriers_id = Request.objects.filter(city_of_dispatch=duration_city_from).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    if duration_city_up:
        carriers_id = Request.objects.filter(delivery_city=duration_city_up).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    if date_of_shipment:
        carriers_id = Request.objects.filter(date_of_shipment__gte=dt.datetime.strptime(date_of_shipment, '%Y-%m-%d')).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    if date_of_delivery:
        carriers_id = Request.objects.filter(date_of_delivery__lte=dt.datetime.strptime(date_of_delivery, '%Y-%m-%d')).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    return queryset.order_by('company_name') 


def request_filters(request, queryset):
    executor = request.query_params.get('executor')
    client_id = request.query_params.get('client_id')
    currency = request.query_params.get('currency')
    
    date_of_shipment = request.query_params.get('date_of_shipment')
    date_of_delivery = request.query_params.get('date_of_delivery')
    
    date_of_delivery_from = request.query_params.get('date_of_delivery_from')
    date_of_delivery_to = request.query_params.get('date_of_delivery_to')
    
    company_name = request.query_params.get('company_name')
    unp = request.query_params.get('unp')
    
    duration_country_from = request.query_params.get('duration_country_from')
    duration_country_up = request.query_params.get('duration_country_up')
    duration_city_from = request.query_params.get('duration_city_from')
    duration_city_up = request.query_params.get('duration_city_up')
    
    request_id = request.query_params.get('request_id')
    
    payment_from_client = request.query_params.get('payment_from_client')
    carrier_id = request.query_params.get('carrier_id')
    
    
    if currency:
        queryset = queryset.filter(currency=currency)
        
    if client_id:
        queryset = queryset.filter(client__pk=client_id)
        
    if date_of_shipment:
        queryset = queryset.filter(date_of_shipment__gte=dt.datetime.strptime(date_of_shipment, '%Y-%m-%d'))
        
    if date_of_delivery:
        queryset = queryset.filter(date_of_delivery__lte=dt.datetime.strptime(date_of_delivery, '%Y-%m-%d'))
        
    if date_of_delivery_from:
        queryset = queryset.filter(date_of_delivery__gte=dt.datetime.strptime(date_of_delivery_from, '%Y-%m-%d'))
        
    if date_of_delivery_to:
        queryset = queryset.filter(date_of_delivery__lte=dt.datetime.strptime(date_of_delivery_to, '%Y-%m-%d'))
    
    if executor and int(executor) > 0 and request.user.is_staff:
        queryset = queryset.filter(executor=executor)
        
    if company_name:
        queryset = queryset.filter(client__company_name=company_name)
        
    if unp:
        queryset = queryset.filter(client__unp=unp)
        
    if duration_country_from:
        queryset = queryset.filter(country_of_dispatch=duration_country_from)
        
    if duration_country_up:
        queryset = queryset.filter(delivery_country=duration_country_up)
        
    if duration_city_from:
        queryset = queryset.filter(city_of_dispatch=duration_city_from)
        
    if duration_city_up:
        queryset = queryset.filter(delivery_city=duration_city_up)
        
    if request_id:
        queryset = queryset.filter(pk=request_id)
        
    if payment_from_client:
        queryset = queryset.filter(payment_from_client=json.loads(payment_from_client))
        
    if carrier_id:
        queryset = queryset.filter(carrier__carrier_id=carrier_id)
        
    return queryset


def request_carrier_filters(request):
    queryset = RequestCarrier.objects.all().order_by('-carrier_id__contact_person')

    request_id = request.query_params.get('request_id')
    date_of_shipment = request.query_params.get('date_of_shipment')
    date_of_delivery = request.query_params.get('date_of_delivery')
    
    if date_of_shipment:
        carriers_id = Request.objects.filter(date_of_shipment__gte=dt.datetime.strptime(date_of_shipment, '%Y-%m-%d')).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    if date_of_delivery:
        carriers_id = Request.objects.filter(date_of_delivery__lte=dt.datetime.strptime(date_of_delivery, '%Y-%m-%d')).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    if request_id:
        queryset = queryset.filter(request_id=request_id)
        
    return queryset