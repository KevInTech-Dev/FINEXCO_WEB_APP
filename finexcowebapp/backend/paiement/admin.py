from django import forms
from django.contrib import admin, messages
from django.contrib.admin.helpers import ActionForm
from django.core.exceptions import ValidationError

from .models import Paiement
from .services import refuser_paiement, valider_paiement


class PaiementActionForm(ActionForm):
    motif_refus = forms.CharField(
        label="Motif du refus",
        required=False,
        widget=forms.Textarea(attrs={"rows": 2}),
    )


@admin.register(Paiement)
class PaiementAdmin(admin.ModelAdmin):
    list_display = (
        "inscription",
        "montant",
        "mode",
        "statut",
        "traite_par",
        "created_at",
    )
    list_filter = ("statut", "mode")
    search_fields = ("inscription__apprenant__email", "inscription__apprenant__nom")

    readonly_fields = (
        "id",
        "inscription",
        "montant",
        "mode",
        "preuve_paiement",
        "statut",
        "motif_refus",
        "traite_par",
        "date_traitement",
        "created_at",
        "updated_at",
    )

    action_form = PaiementActionForm
    actions = ("valider_paiements", "refuser_paiements")

    def has_add_permission(self, request):
        return False

    # Empêcher la suppression 
    def has_delete_permission(self, request, obj=None):
        return False

    @admin.action(description="Valider les paiements sélectionnés")
    def valider_paiements(self, request, queryset):
        nombre_valides = 0
        for paiement in queryset:
            try:
                valider_paiement(
                    paiement_id=paiement.pk,
                    administrateur=request.user,
                )
                nombre_valides += 1
            except ValidationError as erreur:
                # Aficher l'erreur métier sans interrompre le traitement des autre paiements.
                self.message_user(
                    request,
                    f"{paiement} : {erreur}",
                    level=messages.ERROR,
                )

        if nombre_valides:
            self.message_user(
                request,
                f"{nombre_valides} paiement(s) validé(s).",
                level=messages.SUCCESS,
            )

    @admin.action(description="Refuser les paiements sélectionnés")
    def refuser_paiements(self, request, queryset):
        motif = request.POST.get("motif_refus", "").strip()

        if not motif:
            self.message_user(
                request,
                "Saisis un motif dans le champ « Motif du refus ».",
                level=messages.ERROR,
            )
            return

        nombre_refuses = 0
        for paiement in queryset:
            try:
                refuser_paiement(
                    paiement_id=paiement.pk,
                    administrateur=request.user,
                    motif=motif,
                )
                nombre_refuses += 1
            except ValidationError as erreur:
                # On affiche l'erreur métier sans interrompre le traitement des autres paiements.
                self.message_user(
                    request,
                    f"{paiement} : {erreur}",
                    level=messages.ERROR,
                )

        if nombre_refuses:
            self.message_user(
                request,
                f"{nombre_refuses} paiement(s) refusé(s).",
                level=messages.SUCCESS,
            )