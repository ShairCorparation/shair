from celery import Celery
from celery.schedules import crontab
import os
import ssl


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.settings")
redbeat_redis_url = os.environ.get('REDIS_URL', 'redis://redis:6379') + "/1"


def get_celery_ssl():
    return Celery(
        "go4invest",
        broker_use_ssl={
            'ssl_cert_reqs': ssl.CERT_NONE
        },
        redis_backend_use_ssl={
            'ssl_cert_reqs': ssl.CERT_NONE
        }
    )

def get_celery():
    return Celery("project")


use_ssl = redbeat_redis_url.startswith('rediss://')
app = get_celery_ssl() if use_ssl else get_celery()
app.config_from_object("django.conf:settings", namespace='CELERY')
app.autodiscover_tasks()


app.conf.beat_schedule = {
    'get_currencies_from_bank': {
        'task': 'app.tasks.get_currencies',
        'schedule': crontab(minute=0, hour='*/2')
    },
    
}