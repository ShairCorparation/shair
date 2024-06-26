# Generated by Django 4.2.3 on 2024-03-18 20:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_alter_carrier_options_alter_client_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='request',
            name='address_of_dispatch',
            field=models.CharField(blank=True, max_length=128, verbose_name='Адрес отправки'),
        ),
        migrations.AlterField(
            model_name='request',
            name='delivery_address',
            field=models.CharField(blank=True, max_length=128, verbose_name='Адрес доставки'),
        ),
        migrations.AlterField(
            model_name='request',
            name='height',
            field=models.CharField(blank=True, max_length=128, verbose_name='Высота'),
        ),
        migrations.AlterField(
            model_name='request',
            name='pallets',
            field=models.CharField(blank=True, max_length=128, verbose_name='Палеты'),
        ),
        migrations.AlterField(
            model_name='request',
            name='volume',
            field=models.CharField(blank=True, max_length=128, verbose_name='Объем'),
        ),
        migrations.AlterField(
            model_name='request',
            name='width',
            field=models.CharField(blank=True, max_length=128, verbose_name='Ширина'),
        ),
        migrations.AlterField(
            model_name='request',
            name='yardage',
            field=models.CharField(blank=True, max_length=128, verbose_name='Длина'),
        ),
    ]
