from django.urls import path
from .views import CreationInscriptionView, AnnulationInscriptionView

urlpatterns = [
    path("", CreationInscriptionView.as_view(), name="inscriptions"),
    path("<uuid:inscription_id>/annuler", AnnulationInscriptionView.as_view(), name="annuler-inscription"),
]