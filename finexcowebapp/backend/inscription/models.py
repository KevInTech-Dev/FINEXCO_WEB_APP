from django.db import models
from django.conf import settings

class Inscription(models.Model):
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

    date_inscription = models.DateTimeField(auto_now_add=True)

    statut = models.CharField(
        max_length=30,
        choices=Statut.choices,
        default=Statut.EN_ATTENTE_PAIEMENT,
    )

    date_limit_paiement = models.DateTimeField()

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