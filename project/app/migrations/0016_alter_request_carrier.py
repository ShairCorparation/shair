# Generated by Django 4.2.3 on 2024-02-23 20:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0015_carrier_request_id_alter_request_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='request',
            name='carrier',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.carrier', verbose_name='Carrier'),
        ),
    ]
