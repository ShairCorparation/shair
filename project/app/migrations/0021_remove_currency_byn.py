# Generated by Django 4.2.3 on 2024-04-06 10:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0020_currency_alter_request_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='currency',
            name='byn',
        ),
    ]