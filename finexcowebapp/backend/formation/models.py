from django.db import models
from django.core.validators import MinValueValidator
from django.db.models import Q
import uuid

class Categorie(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ["nom"]
        verbose_name = "catégorie"
        verbose_name_plural = "catégories"

    def __str__(self):
        return self.nom

class Formation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class EtatPublication(models.TextChoices):
        BROUILLON = "BROUILLON", "Brouillon"
        PUBLIE = "PUBLIE", "Publié"
        ARCHIVE = "ARCHIVE", "Archivé"

    nom = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    #la durée est en mois pour le moment
    duree = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
    )

    etat_publication = models.CharField(
        max_length=10,
        choices=EtatPublication.choices,
        default=EtatPublication.BROUILLON,
    )

    categorie = models.ForeignKey(
        Categorie,
        on_delete=models.PROTECT,
        related_name="formation",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["nom"]
        verbose_name = "formation"
        verbose_name_plural = "formations"
        constraints = [
            models.CheckConstraint(
                condition=Q(duree__gte=1),
                name="formation_duree_min_1",
            ),
        ]

        def __str__(self):
            return self.nom