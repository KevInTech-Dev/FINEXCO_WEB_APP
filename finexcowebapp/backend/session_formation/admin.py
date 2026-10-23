from django.contrib import admin
from .models import SessionFormation

@admin.register(SessionFormation)
class SessionFormationAdmin(admin.ModelAdmin):
    list_display = (
        "formation",
        "formateur",
        "date_debut",
        "date_fin",
        "duree_jours",
        "date_cloture_paiement",
        "lieu",
        "place_total",
        "prix",
        "etat",
    )

    list_filter =("etat", "date_debut", "formation")

    search_fields = (
        "formation__nom",
        "formateur__nom",
        "formateur__prenoms",
        "formateur__email",
        "lieu",
    )

    date_hierarchy = "date_debut"
    readonly_fields = ("id", "created_at", "updated_at", "date_cloture_paiement", "duree_jours")