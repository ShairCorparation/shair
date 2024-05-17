from django.contrib import admin
from back.models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'is_logistics']
    list_filter = ['user_id', 'is_logistics']
    
    class Meta:
        verbose_name ='Профиль'
        verbose_name_plural ='Профиль'
        
