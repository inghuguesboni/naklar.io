# Generated by Django 3.0.5 on 2020-04-13 14:55

import account.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0008_passwordresettoken'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tutordata',
            name='verification_file',
            field=models.FileField(blank=True, null=True, upload_to=account.models.tutor_upload_path, verbose_name='Vefizierungsdatei'),
        ),
    ]