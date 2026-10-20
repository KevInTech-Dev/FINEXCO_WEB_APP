import uuid

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Paiement(models.Model):
    class Mode(models.TextChoices):
        FLOOZ = "FLOOZ", "Flooz"
        TMONEY = "TMONEY", "TMoney"

    class Statut(models.TextChoices):
        INITIE = "INITIE", "Initié"
        A_VERIFIER = "A_VERIFIER", "À vérifier"
        VALIDE = "VALIDE", "Validé"
        REFUSE = "REFUSE", "Refusé"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    inscription = models.ForeignKey(
        "inscription.Inscription",
        on_delete=models.PROTECT,
        related_name="paiements",
    )
    traite_par = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="paiements_traites",
        null=True,
        blank=True,
    )

    montant = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
    )
    mode = models.CharField(max_length=10, choices=Mode.choices)

    preuve_paiement = models.FileField(
        upload_to="preuves_paiement/",
        blank=True,
    )

    statut = models.CharField(
        max_length=12,
        choices=Statut.choices,
        default=Statut.INITIE,
    )
    motif_refus = models.TextField(blank=True)
    date_traitement = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "paiement"
        verbose_name_plural = "paiements"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(montant__gt=0),
                name="paiement_montant_positif",
            ),
        ]

    def __str__(self):
        return f"{self.montant} — {self.get_statut_display()}"