from django.urls import path
from .views import (
    AnnulationInscriptionView,
    CreationInscriptionView,
    InscriptionAdminListView,
)

urlpatterns = [
    path("admin/", InscriptionAdminListView.as_view(), name="admin-inscriptions"),
    path("", CreationInscriptionView.as_view(), name="inscriptions"),
    path("<uuid:inscription_id>/annuler/", AnnulationInscriptionView.as_view(), name="annuler-inscription"),
]