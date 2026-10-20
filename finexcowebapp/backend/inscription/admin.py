from django.contrib import admin
from .models import Inscription


@admin.register(Inscription)
class InscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "apprenant",
        "session",
        "statut",
        "date_inscription",
        "date_limite_paiement",
    )

    list_filter = ("statut", "session")

    search_fields = ("apprenant__email", "session__formation__nom")

    readonly_fields = (
        "id",
        "date_inscription",
        "date_limite_paiement",
        "created_at",
        "updated_at",
    )