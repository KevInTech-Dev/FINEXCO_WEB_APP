from django.db import models
from django.conf import settings
import uuid
from django.utils import timezone

class Inscription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class Statut(models.TextChoices):
        EN_ATTENTE_PAIEMENT = "EN_ATTENTE_PAIEMENT", "En attente de paiement"
        CONFIRMEE = "CONFIRMEE", "Confirmée"
        ANNULEE = "ANNULEE", "Annulée"
        EXPIREE = "EXPIREE", "Expirée"

    apprenant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="inscriptions",
        limit_choices_to={"role":"APPRENANT"},
    )

    session = models.ForeignKey(
        "session_formation.SessionFormation",
        on_delete=models.PROTECT,
        related_name="inscriptions",
    )

    date_inscription = models.DateTimeField(default=timezone.now, editable=False)
    date_limite_paiement = models.DateTimeField(editable=False)

    statut = models.CharField(
        max_length=30,
        choices=Statut.choices,
        default=Statut.EN_ATTENTE_PAIEMENT,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date_inscription"]
        verbose_name = "inscription"
        verbose_name_plural = "inscriptions"

        #Pas plus d'une inscription à une même formation
        constraints = [
            models.UniqueConstraint(
                fields=["apprenant", "session"],
                name="unique_inscription_apprenant_session",
            ),
        ]

    def __str__(self):
        return f"{self.apprenant.email} - {self.session}"