import requests
from project.celery_tasks import app
from app.models import Currency


@app.task
def get_currencies():
    res = requests.get('https://api.nbrb.by/exrates/rates?periodicity=0')
    
    data = {}
    for el in res.json():
        if el['Cur_Abbreviation'] == 'USD':
            data['usd'] = el['Cur_OfficialRate']
        if el['Cur_Abbreviation'] == 'EUR':
            data['eur'] = el['Cur_OfficialRate']
        if el['Cur_Abbreviation'] == 'RUB':
            data['rub'] = el['Cur_OfficialRate']

    if Currency.objects.all().count() > 0:
        cur = Currency.objects.first()
        cur.USD = data['usd']
        cur.EUR = data['eur']
        cur.RUB = data['rub']
        cur.save()
    else:
        Currency.objects.create(**data)

