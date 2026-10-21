from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import CreationCompteView, MonProfilView


urlpatterns = [
    path("auth/inscription/", CreationCompteView.as_view(), name="creation-compte"),
    path("auth/connexion/", TokenObtainPairView.as_view(), name="connexion"),
    path("auth/rafraichir/", TokenRefreshView.as_view(), name="rafraichir-token"),
    path("auth/me/", MonProfilView.as_view(), name="mon-profil"),
]