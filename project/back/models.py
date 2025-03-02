from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_logistics = models.BooleanField(default=False)
