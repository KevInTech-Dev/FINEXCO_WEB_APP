from django.db import models

class Paiement(models.Model):
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Mode(models.TextChoices):
        FLOOZ = "FLOOZ", "Flooz"
        MIX_BY_YAS = "MIX_BY_YAS", "MIX BY YAS"

    
        #montant, date_creation, mode, statut_paiement, preuve_paiement, date_traitement, inscription_id -> FK, admin_validateur_id -> FK