import requests

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
    return data
