import requests
from project.celery_tasks import app
from app.models import Currency


@app.task
def get_currencies():
    res = requests.get('https://api.nbrb.by/exrates/rates?periodicity=0')
    
    data = {}
    for el in res.json():
        if el['Cur_Abbreviation'] == 'USD':
            data['USD'] = el['Cur_OfficialRate']
        if el['Cur_Abbreviation'] == 'EUR':
            data['EUR'] = el['Cur_OfficialRate']
        if el['Cur_Abbreviation'] == 'RUB':
            data['RUB'] = el['Cur_OfficialRate']

    if Currency.objects.all().count() > 0:
        cur = Currency.objects.first()
        cur.USD = data['USD']
        cur.EUR = data['EUR']
        cur.RUB = data['RUB']
        cur.save()
    else:
        Currency.objects.create(**data)

