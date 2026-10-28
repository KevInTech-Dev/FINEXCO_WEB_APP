from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from inscription.models import Inscription
from .models import Paiement


@transaction.atomic
def soumettre_paiement(*, apprenant, inscription_id, mode, preuve_paiement):
    inscription = (
        Inscription.objects.select_for_update()
        .select_related("session")
        .filter(id=inscription_id, apprenant=apprenant)
        .first()
    )

    if inscription is None:
        raise ValidationError("Inscription introuvable.")

    if apprenant.role != apprenant.Role.APPRENANT:
        raise ValidationError("Seul un apprenant peut soumettre un paiement.")
    
    if inscription.statut not in (
        Inscription.Statut.EN_ATTENTE_PAIEMENT,
        Inscription.Statut.PAIEMENT_REFUSE,
    ):
        raise ValidationError("Cette inscription n'attend pas de paiement.")
        

    if timezone.now() > inscription.date_limite_paiement:
        raise ValidationError("Le délai de paiement de cette inscription est dépassé.")

    if not preuve_paiement:
        raise ValidationError("Ajoute la preuve de paiement.")

    paiement_en_attente = inscription.paiements.filter(
        statut=Paiement.Statut.A_VERIFIER
    ).exists()
    if paiement_en_attente:
        raise ValidationError("Une preuve de paiement est déjà en attente de vérification.")

    montant_a_payer = inscription.session.prix

    if montant_a_payer <= 0:
        raise ValidationError("Le prix de cette session ne permet pas de créer un paiement.")
    
    paiement = Paiement.objects.create(
        inscription=inscription,
        montant=montant_a_payer,
        mode=mode,
        preuve_paiement=preuve_paiement,
        statut=Paiement.Statut.A_VERIFIER,
    )

    inscription.statut = Inscription.Statut.EN_ATTENTE_PAIEMENT
    inscription.save(update_fields=["statut", "updated_at"])

    return paiement

@transaction.atomic
def valider_paiement(*, paiement_id, administrateur):
    paiement = (
        Paiement.objects.select_for_update()
        .select_related("inscription__session")
        .filter(id=paiement_id)
        .first()
    )


    if paiement is None:
        raise ValidationError("Paiement introuvable.")

    if not (
        administrateur.is_superuser
        or administrateur.role == administrateur.Role.ADMIN
    ):
        raise ValidationError("Seul un administrateur peut traiter un paiement.")

    if paiement.statut != Paiement.Statut.A_VERIFIER:
        raise ValidationError("Ce paiement n'est pas en attente de vérification.")

    inscription = paiement.inscription
    
    if inscription.statut != Inscription.Statut.EN_ATTENTE_PAIEMENT:
        raise ValidationError("Cette inscription n'attend plus de paiement.")
    if paiement.created_at > inscription.date_limite_paiement:
        raise ValidationError("La preuve a été déposée après la date limite de paiement.")

    if paiement.montant != inscription.session.prix:
        raise ValidationError("Le montant du paiement ne correspond pas au prix de la session.")

    paiement.statut = Paiement.Statut.VALIDE
    paiement.traite_par = administrateur
    paiement.date_traitement = timezone.now()
    paiement.save(
        update_fields=["statut", "traite_par", "date_traitement", "updated_at"]
    )

    inscription.statut = Inscription.Statut.CONFIRMEE
    inscription.save(update_fields=["statut", "updated_at"])

    return paiement


@transaction.atomic
def refuser_paiement(*, paiement_id, administrateur, motif):
    paiement = Paiement.objects.select_for_update().filter(id=paiement_id).first()

    if paiement is None:
        raise ValidationError("Paiement introuvable.")

    if administrateur.role != administrateur.Role.ADMIN:
        raise ValidationError("Seul un administrateur peut refuser un paiement.")

    if paiement.statut != Paiement.Statut.A_VERIFIER:
        raise ValidationError("Ce paiement n'est pas en attente de vérification.")

    if not motif or not motif.strip():
        raise ValidationError("Indique le motif du refus.")

    paiement.statut = Paiement.Statut.REFUSE
    paiement.motif_refus = motif.strip()
    paiement.traite_par = administrateur
    paiement.date_traitement = timezone.now()
    paiement.save(
        update_fields=[
            "statut",
            "motif_refus",
            "traite_par",
            "date_traitement",
            "updated_at",
        ]
    )
    inscription = paiement.inscription
    inscription.statut = Inscription.Statut.PAIEMENT_REFUSE
    inscription.save(update_fields=["statut", "updated_at"])
    return paiement