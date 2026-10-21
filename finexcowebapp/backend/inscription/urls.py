from django.urls import path

from .views import CreationCompteView


urlpatterns = [
    path("auth/inscription/", CreationCompteView.as_view(), name="creation-compte"),
]