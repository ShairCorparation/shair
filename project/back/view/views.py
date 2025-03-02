
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.viewsets import mixins, GenericViewSet
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from app.helpers import get_currencies
from app.models import Request
from back import serializers, models
from django.contrib.auth.models import User


class UserRegistrationAPIView(GenericAPIView):
    """
    An endpoint for the client to create a new User.
    """
    permission_classes = (AllowAny,)
    serializer_class = serializers.UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}
        return Response(data, status=status.HTTP_201_CREATED)


class UserLoginAPIView(GenericAPIView):
    """
    An endpoint to authenticate existing users using their email and password.
    """

    permission_classes = (AllowAny,)
    serializer_class = serializers.UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        
        serializer = serializers.CustomUserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}
        return Response(data, status=status.HTTP_200_OK)


class UserLogoutAPIView(GenericAPIView):
    """
    An endpoint to logout users.
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.UserLoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        

class UserViewSet(mixins.ListModelMixin, mixins.DestroyModelMixin, GenericViewSet):

    serializer_class = serializers.CustomUserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return User.objects.all()
    
    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def destroy(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(User, pk=pk)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['GET'])
    def current_user(self, request, *args, **kwargs):
        instance = get_object_or_404(User, pk=request.user.pk)
        serializer = self.serializer_class(instance)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
    @action(detail=False, methods=['PATCH'])
    def change_password(self, request, *args, **kwargs):
        instance = get_object_or_404(User, pk=request.user.pk)
        instance.password = make_password(request.data['password'])
        instance.save()
        return Response({'message': 'Пароль был успешно изменен!'}, status=status.HTTP_200_OK)
    
class ProfileViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    
    serializer_class = serializers.ProfileSerializer
    permission_classes = (IsAuthenticated,)
    queryset = models.Profile.objects.all()
    
    def list(self, request, *args, **kwargs):
        instance = self.queryset.get(user_id=request.query_params['user_id'])
        serializer = self.serializer_class(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def update(self, request, pk, *args, **kwargs):
        instance = get_object_or_404(models.Profile, user_id=pk)
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(status=status.HTTP_200_OK)