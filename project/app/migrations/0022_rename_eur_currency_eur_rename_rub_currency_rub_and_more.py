# Generated by Django 4.2.3 on 2024-04-06 19:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0021_remove_currency_byn'),
    ]

    operations = [
        migrations.RenameField(
            model_name='currency',
            old_name='eur',
            new_name='EUR',
        ),
        migrations.RenameField(
            model_name='currency',
            old_name='rub',
            new_name='RUB',
        ),
        migrations.RenameField(
            model_name='currency',
            old_name='usd',
            new_name='USD',
        ),
    ]