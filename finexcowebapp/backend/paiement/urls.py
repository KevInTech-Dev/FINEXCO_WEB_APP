from django.urls import path
from .views import SoumissionPaiementView, ValidationPaiementView, RefusPaiementView, PaiementAVerifierView, MesPaiementsView, TousLesPaiementsView

urlpatterns = [
    path("", SoumissionPaiementView.as_view(), name="soumission-paiement"),
    path("<uuid:paiement_id>/valider/", ValidationPaiementView.as_view(), name="validation-paiement"),
    path("<uuid:paiement_id>/refuser/", RefusPaiementView.as_view(), name="refus-paiement"),
    path("a-verifier/", PaiementAVerifierView.as_view(), name="paiements-a-verifier"),
    path("mes-paiements/", MesPaiementsView.as_view(), name="mes-paiements"),
    path("tous/", TousLesPaiementsView.as_view(), name="tous-les-paiements"),
]