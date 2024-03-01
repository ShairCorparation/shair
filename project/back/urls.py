from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from back.view import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users_info', views.UserViewSet, basename='users_info')

app_name="users"
urlpatterns = [
    path("", include(router.urls)),
    path("register/", views.UserRegistrationAPIView.as_view(), name="create-user"),
    path("login/", views.UserLoginAPIView.as_view(), name="login-user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", views.UserLogoutAPIView.as_view(), name="logout-user"),
]