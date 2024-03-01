from app.models import Request
import datetime as dt


def user_filters(request, queryset):

    request_id = request.query_params.get('request_id')
    request_date_from = request.query_params.get('request_date_from')
    request_date_up = request.query_params.get('request_date_up')
    duration_country_from = request.query_params.get('duration_country_from')
    duration_country_up = request.query_params.get('duration_country_up')
    duration_city_from = request.query_params.get('duration_city_from')
    duration_city_up = request.query_params.get('duration_city_up')
    executor = request.query_params.get('executor')

    # general filters

    if duration_country_from:
        executors_id = Request.objects.filter(country_of_dispatch=duration_country_from).values_list('executor', flat=True)
        queryset = queryset.filter(pk__in=executors_id)

    if duration_country_up:
        executors_id = Request.objects.filter(delivery_country=duration_country_up).values_list('executor', flat=True)
        queryset = queryset.filter(pk__in=executors_id)


    if request_date_from:
        executors_id = Request.objects.filter(date_of_request__gte=dt.datetime.strptime(request_date_from, '%Y-%m-%d')).values_list('executor', flat=True)
        queryset = queryset.filter(pk__in=executors_id)

    if request_date_up:
        executors_id = Request.objects.filter(date_of_request__lte=dt.datetime.strptime(request_date_up, '%Y-%m-%d')).values_list('executor', flat=True)
        queryset = queryset.filter(pk__in=executors_id)


    if duration_city_from:
        executors_id = Request.objects.filter(city_of_dispatch=duration_city_from).values_list('executor', flat=True)
        queryset = queryset.filter(pk__in=executors_id)

    if duration_city_up:
        executors_id = Request.objects.filter(delivery_city=duration_city_up).values_list('executor', flat=True)
        queryset = queryset.filter(pk__in=executors_id)

    if request_id:
        executors_id = Request.objects.get(pk=request_id).values_list('executor', flat=True)
        queryset = queryset.filter(pk__in=executors_id)
    
    if executor:
        executors_id = Request.objects.get(executor__pk=executor).values_list('executor', flat=True)
        queryset = queryset.filter(pk__in=executors_id)

    return queryset.order_by('first_name')