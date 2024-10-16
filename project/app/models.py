from django.db import models
from app.constants import CurrencyChoices, StatusRequestChoices
from django.db.models import UniqueConstraint
from django.contrib.auth import get_user_model

User = get_user_model()

class Request(models.Model):
    date_of_shipment = models.DateField(verbose_name='Дата загрузки')
    date_of_delivery = models.DateField(verbose_name='Дата доставки')
    customer_price = models.PositiveBigIntegerField(verbose_name='Цена заказчика')
    currency = models.CharField(choices=CurrencyChoices, verbose_name='Валюта')
    country_of_dispatch = models.CharField(max_length=128, verbose_name='Страна отправки')
    city_of_dispatch = models.CharField(max_length=128, verbose_name='Город отправки')
    address_of_dispatch = models.CharField(blank=True, max_length=128, verbose_name='Адрес отправки')
    delivery_country = models.CharField(max_length=128, verbose_name='Страна доставки')
    delivery_city = models.CharField(max_length=128, verbose_name='Город доставки')
    delivery_address = models.CharField(blank=True, max_length=128, verbose_name='Адрес доставки')
    name_of_cargo = models.CharField(max_length=256, verbose_name='Название')
    type_of_transport = models.CharField(max_length=256, verbose_name='Тип транспорта')
    weight = models.CharField(max_length=128, verbose_name='Вес')
    pallets = models.CharField(blank=True, max_length=128, verbose_name='Палеты')
    yardage = models.CharField(blank=True, max_length=128, verbose_name='Длина')
    width = models.CharField(blank=True, max_length=128, verbose_name='Ширина')
    height = models.CharField(blank=True, max_length=128, verbose_name='Высота')
    volume = models.CharField(blank=True, max_length=128, verbose_name='Объем')
    note = models.CharField(max_length=1000, blank=True, verbose_name='Примечание')
    date_of_request = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания запроса')
    status = models.CharField(choices=StatusRequestChoices, default=StatusRequestChoices.created, verbose_name='Статус запроса')
    executor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Исполнитель')
    client = models.ForeignKey('Client', on_delete=models.SET_NULL, null=True, verbose_name='Заказчик')
    carrier = models.ForeignKey('RequestCarrier', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Перевозчик')
    payment_from_carrier = models.BooleanField(default=False, verbose_name='Оплата от перевозчика')
    payment_from_client = models.BooleanField(default=False, verbose_name='Оплата от заказчика')
    
    class Meta:
        verbose_name = 'Запросы и Заказы'
        verbose_name_plural = 'Запросы и Заказы'

    def __str__(self):
        return f'{self.name_of_cargo} | {self.status}'
    

class Client(models.Model):
    created_date = models.DateField(auto_now_add=True, verbose_name='Дата создания')
    company_name = models.CharField(max_length=256, verbose_name='Название компании')
    contact_person = models.CharField(max_length=32, verbose_name='Контактное лицо')
    unp = models.CharField(max_length=256, verbose_name='УНП')
    contact_info = models.CharField(max_length=256, verbose_name='Контактная информация')
    note = models.CharField(blank=True, verbose_name='Примечание')

    class Meta:
        verbose_name = 'Заказчики'
        verbose_name_plural = 'Заказчики'
        constraints = [
            UniqueConstraint(fields=['unp', 'contact_person'], name='unique_unp_contact_person', 
                             violation_error_message='Клиент с таким УНП уже существует.')
        ]

    def __str__(self):
        return f'{self.contact_person} | {self.company_name}'
    

class RequestCarrier(models.Model):
    carrier_id = models.ForeignKey('Carrier', on_delete=models.CASCADE)
    request_id = models.ForeignKey(Request, on_delete=models.CASCADE)
    carrier_rate = models.PositiveBigIntegerField(default=0, verbose_name='Ставка перевозчика')
    carrier_currency = models.CharField(default=CurrencyChoices.byn, choices=CurrencyChoices, verbose_name='Валюта перевозчика')
    
    def __str__(self):
        return f'{self.carrier_id.company_name} {self.carrier_id.contact_person}'
    class Meta:
        constraints = [
            UniqueConstraint(fields=['carrier_id', 'request_id'], name='unique_request_carrier', 
                             violation_error_message='Перевозчик уже добавлен в данный запрос')
        ]
    

class Carrier(models.Model):
    created_date = models.DateField(auto_now_add=True, verbose_name='Дата создания')
    company_name = models.CharField(max_length=256, verbose_name='Название компании')
    contact_person = models.CharField(max_length=256, verbose_name='Контактное лицо')
    unp = models.CharField(max_length=256, unique=True, verbose_name='УНП',
                           error_messages={'unique': 'Перевозчик с таким УНП уже существует.'})
    contact_info = models.CharField(max_length=256, verbose_name='Контактная информация')
    rate = models.PositiveBigIntegerField(blank=True, verbose_name='Ставка')
    currency = models.CharField(choices=CurrencyChoices, verbose_name='Валюта')
    note = models.CharField(blank=True, verbose_name='Примечание')
    
    class Meta:
        verbose_name = 'Перевозчики'
        verbose_name_plural = 'Перевозчики'
   
    def __str__(self):
        return f'{self.contact_person} | {self.company_name}'
    

class Docs(models.Model):
    name = models.CharField(verbose_name='Название файла')
    file = models.FileField(upload_to='requests/docs/', verbose_name='Путь к файлу')
    request = models.ForeignKey(Request, on_delete=models.CASCADE, verbose_name='Запрос')

    class Meta:
        verbose_name = 'Документы'
        verbose_name_plural = 'Документы'

    def __str__(self):
        return self.name
    

class Currency(models.Model):
    USD = models.DecimalField(max_digits=6, decimal_places=2)
    EUR = models.DecimalField(max_digits=6, decimal_places=2)
    RUB = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        verbose_name = 'Валюты'
        verbose_name_plural = 'Валюты'

    def __str__(self):
        return f'{self.USD} {self.EUR} {self.RUB}'
    
    
    
    