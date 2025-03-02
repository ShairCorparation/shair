from rest_framework import serializers
from django.contrib.auth import authenticate
from app.models import Request
from django.contrib.auth import get_user_model
from back.models import Profile
import json

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer class to serialize registration requests and create a new user.
    """
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "username", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer class to authenticate users with username and password.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
    


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer class to serialize CustomUser model.
    """
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "is_staff")