from django.db import models
from django.contrib.auth.models import User



class Profile(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    is_logistics = models.BooleanField(default=False)
