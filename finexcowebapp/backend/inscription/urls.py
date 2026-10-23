from django.urls import path
from .views import CreationInscriptionView


urlpatterns = [
    path("", CreationInscriptionView.as_view(), name="inscriptions"),
]