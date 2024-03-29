# Generated by Django 4.2.3 on 2024-02-20 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_request_payment_from_carrier_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='note',
            field=models.CharField(default='', verbose_name='Note'),
        ),
        migrations.AlterField(
            model_name='request',
            name='status',
            field=models.CharField(choices=[('created', 'Created'), ('On it', 'On it'), ('Archived', 'Archived'), ('Complete', 'Complete')], default='created', verbose_name='Request status'),
        ),
    ]
