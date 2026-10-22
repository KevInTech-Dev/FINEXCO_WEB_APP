from django.urls import path
from .views import SoumissionPaiementView, ValidationPaiementView, RefusPaiementView

urlpatterns = [
    path("", SoumissionPaiementView.as_view(), name="soumission-paiement"),
    path("<uuid:paiement_id>/valider/", ValidationPaiementView.as_view(), name="validation-paiement"),
    path("<uuid:paiement_id>/refuser/", RefusPaiementView.as_view(), name="refus-paiement"),
]