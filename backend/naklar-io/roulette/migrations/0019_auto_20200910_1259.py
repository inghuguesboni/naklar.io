# Generated by Django 3.0.10 on 2020-09-10 10:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('roulette', '0018_auto_20200624_1536'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentrequest',
            name='is_connected',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tutorrequest',
            name='is_connected',
            field=models.BooleanField(default=False),
        ),
    ]
