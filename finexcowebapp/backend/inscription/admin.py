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
        "apprenant",
        "session",
        "date_inscription",
        "date_limite_paiement",
        "statut",
        "created_at",
        "updated_at",
    )

    # On empêche la création manuelle qui contournerait le service d'inscription
    def has_add_permission(self, request):
        return False
    
    # On conserve les inscriptions comme historique, sans suppression manuelle.
    def has_delete_permission(self, request, obj=None):
        return False
