from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings
from django.db.models import F
import uuid

class SessionFormation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    formation = models.ForeignKey(
        "formation.Formation",
        on_delete=models.PROTECT,
        related_name="sessions",
    )

    formateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="sessions_animées",
    )

    date_debut = models.DateField()
    date_fin = models.DateField()

    date_cloture_paiement = models.DateTimeField()
    place_total = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
    )
    lieu = models.CharField(max_length=255)
    prix = models.DecimalField(max_digits=10, decimal_places=2)

    class EtatSession(models.TextChoices):
        OUVERTE = "OUVERTE", "Ouverte"
        FERMEE = "FERMEE", "Fermée"
        TERMINEE = "TERMINEE", "Terminée"

    etat = models.CharField(
        max_length=10,
        choices=EtatSession.choices,
        default=EtatSession.OUVERTE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["date_debut"]
        verbose_name = "session de formation"
        verbose_name_plural = "sessions de formation"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(place_total__gte=1),
                name="session_place_total_min_1",
            ),
            models.CheckConstraint(
                condition=models.Q(prix__gte=0),
                name="session_prix_positif_ou_null",
            ),
            models.CheckConstraint(
                condition=models.Q(date_fin__gte=F("date_debut")),
                name="session_date_fin_apres_debut",
            ),
        ]

    def __str__(self):
        return f"{self.formation.nom} - {self.date_debut}"
    