from rest_framework import routers
from django.urls import path, include
from app import views

router = routers.DefaultRouter()
router.register(r'clients', views.ClientViewSet, basename='clients')
router.register(r'requests', views.RequestViewSet, basename='requests')
router.register(r'carriers', views.CarrierViewSet, basename='carriers')
router.register(r"docs", views.DocsRequestsViewSet, basename='docs')


urlpatterns = [
    path('', include(router.urls))
]