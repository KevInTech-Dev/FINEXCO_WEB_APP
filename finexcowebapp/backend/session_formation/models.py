from datetime import datetime, time, timedelta
import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import F
from django.utils import timezone


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
        limit_choices_to={"role":"FORMATEUR"},
    )

    date_debut = models.DateField()
    date_fin = models.DateField()

    place_total = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
    )
    lieu = models.CharField(max_length=255)
    prix = models.DecimalField(max_digits=10, decimal_places=0)
    image = models.ImageField(upload_to="formations/", blank=True)

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

    # clôture à la dernière seconde du jour précédant la session.
    @property
    def date_cloture_paiement(self):
        if not self.date_debut:
            return None

        veille = self.date_debut - timedelta(days=1)
        fin_de_jour = datetime.combine(veille, time.max)

        return timezone.make_aware(
            fin_de_jour,
            timezone.get_current_timezone(),
        )

    @property
    def duree_jours(self):
        if not self.date_debut or not self.date_fin:
            return None

        return (self.date_fin - self.date_debut).days + 1

    def __str__(self):
        return f"{self.formation.nom} - {self.date_debut}"

    # Vérifier que la session ne se termine pas avant son début.
    def clean(self):
        super().clean()

        erreurs = {}

        if self.date_debut and self.date_fin and self.date_fin < self.date_debut:
            erreurs["date_fin"] = (
                "La date de fin doit être égale ou postérieure "
                "à la date de début."
            )
        
        if self.formateur_id and self.formateur.role != "FORMATEUR":
            erreurs["formateur"] = (
                "L'utilisateur sélectionné doit avoir le rôle Formateur."
            )

        if erreurs:
            raise ValidationError(erreurs)