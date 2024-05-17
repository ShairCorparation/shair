from app.models import Request, Carrier, RequestCarrier
import datetime as dt


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

    unp_on_it = request.query_params.get('unp_on_it')
    company_name_on_it= request.query_params.get('company_name_on_it')
    request_id = request.query_params.get('request_id')

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

    # reports filters

    if company_name_on_it:
        clients_id = Request.objects.filter(status='on it', payment_from_client=False).values_list('client', flat=True)
        queryset = queryset.filter(pk__in=clients_id, company_name=company_name_on_it)

    if unp_on_it:
        clients_id = Request.objects.filter(status='on it', payment_from_client=False).values_list('client', flat=True)
        queryset = queryset.filter(pk__in=clients_id, unp=unp_on_it)


    if request_id:
        clients_id = Request.objects.filter(pk=request_id).values_list('client', flat=True)
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

    name_of_cargo = request.query_params.get('name_of_cargo')
    request_id = request.query_params.get('request_id')

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

    # report filters

    if name_of_cargo:
        carriers_id = Request.objects.filter(name_of_cargo=name_of_cargo).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    if request_id:
        carriers_id = Request.objects.filter(pk=request_id).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    return queryset.order_by('company_name') 


def request_filters(request, is_logistics, user_pk):
    
    queryset = Request.objects.all().order_by('date_of_request')
    executor = request.query_params.get('executor')
    
    if executor and int(executor) > 0:
        queryset = queryset.filter(executor=executor)
    elif is_logistics:
        queryset = queryset.filter(executor=user_pk)
        
    return queryset


def request_carrier_filters(request):
    queryset = RequestCarrier.objects.all().order_by('carrier_id')
    
    name_of_cargo = request.query_params.get('name_of_cargo')
    request_id = request.query_params.get('request_id')
    date_of_shipment = request.query_params.get('date_of_shipment')
    date_of_delivery = request.query_params.get('date_of_delivery')
    
    if date_of_shipment:
        carriers_id = Request.objects.filter(date_of_shipment__gte=dt.datetime.strptime(date_of_shipment, '%Y-%m-%d')).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    if date_of_delivery:
        carriers_id = Request.objects.filter(date_of_delivery__lte=dt.datetime.strptime(date_of_delivery, '%Y-%m-%d')).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    # report filters

    if name_of_cargo:
        carriers_id = Request.objects.filter(name_of_cargo=name_of_cargo).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)

    if request_id:
        carriers_id = Request.objects.filter(pk=request_id).values_list('carrier', flat=True)
        queryset = queryset.filter(pk__in=carriers_id)
        
    return queryset