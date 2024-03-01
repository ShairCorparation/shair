from djchoices import DjangoChoices, ChoiceItem


class CurrencyChoices(DjangoChoices):
    usd = ChoiceItem('USD', 'USD')
    eur = ChoiceItem('EUR', 'EUR')
    rub = ChoiceItem('RUB', 'RUB')
    byn = ChoiceItem('BYN', 'BYN')


class StatusRequestChoices(DjangoChoices):
    created = ChoiceItem('created', 'Created')
    on_it = ChoiceItem('on it', 'On it')
    archived = ChoiceItem('archived', 'Archived')
    complete = ChoiceItem('complete', 'Complete')