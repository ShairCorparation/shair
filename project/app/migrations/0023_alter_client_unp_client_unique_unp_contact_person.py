# Generated by Django 4.2.3 on 2024-04-27 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_rename_eur_currency_eur_rename_rub_currency_rub_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='unp',
            field=models.CharField(max_length=256, verbose_name='УНП'),
        ),
        migrations.AddConstraint(
            model_name='client',
            constraint=models.UniqueConstraint(fields=('unp', 'contact_person'), name='unique_unp_contact_person', violation_error_message='Клиент с таким УНП уже существует.'),
        ),
    ]