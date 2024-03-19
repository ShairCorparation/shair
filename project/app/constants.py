from djchoices import DjangoChoices, ChoiceItem


class CurrencyChoices(DjangoChoices):
    usd = ChoiceItem('USD', 'USD')
    eur = ChoiceItem('EUR', 'EUR')
    rub = ChoiceItem('RUB', 'RUB')
    byn = ChoiceItem('BYN', 'BYN')


class StatusRequestChoices(DjangoChoices):
    created = ChoiceItem('created', 'создан')
    on_it = ChoiceItem('on it', 'в работе')
    archived = ChoiceItem('archived', 'в архиве')
    complete = ChoiceItem('complete', 'выполнен')