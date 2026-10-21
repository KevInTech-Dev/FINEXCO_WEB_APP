from datetime import timedelta

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import F, Q
from django.utils import timezone

from .models import Inscription

from django.db.models import F, Q, Subquery
from paiement.models import Paiement

@transaction.atomic
def creer_inscription(*, apprenant, session_id):
    # On récupère et verrouille la session pour regrouper ses vérifications dans cette opération.
    from session_formation.models import SessionFormation

    session = (
        SessionFormation.objects.select_for_update()
        .select_related("formation")
        .filter(id=session_id)
        .first()
    )

    # On refuse la demande si la session n'existe pas.
    if session is None:
        raise ValidationError("Session introuvable.")

    if apprenant.role != apprenant.Role.APPRENANT:
        raise ValidationError("Seul un apprenant peut s'inscrire à une session.")

    if session.formation.etat_publication != session.formation.EtatPublication.PUBLIE:
        raise ValidationError("La formation n'est pas publiée.")

    if session.etat != session.EtatSession.OUVERTE:
        raise ValidationError("Cette session n'est pas ouverte aux inscriptions.")

    maintenant = timezone.now()
    if session.date_cloture_paiement <= maintenant:
        raise ValidationError("La période d'inscription et de paiement est terminée.")

    deja_inscrit = Inscription.objects.filter(
        apprenant=apprenant,
        session=session,
    ).exists()
    if deja_inscrit:
        raise ValidationError("Tu es déjà inscrit à cette session.")
    
    # On compte les inscriptions confirmées et les places encore temporairement réservées.
    places_occupees = (
        Inscription.objects.filter(session=session)
        .filter(
            Q(statut=Inscription.Statut.CONFIRMEE)
            | Q(
                statut=Inscription.Statut.EN_ATTENTE_PAIEMENT,
                date_limite_paiement__gt=maintenant,
            )
            | Q(
                statut=Inscription.Statut.EN_ATTENTE_PAIEMENT,
                paiements__statut=Paiement.Statut.A_VERIFIER,
                paiements__created_at__lte=F("date_limite_paiement"),
            )
        )
        .distinct()
        .count()
    )

    if places_occupees >= session.place_total:
        raise ValidationError("Il n'y a plus de place disponible pour cette session.")

    limite_72h = maintenant + timedelta(hours=72)

    date_limite = min(limite_72h, session.date_cloture_paiement)

    return Inscription.objects.create(
        apprenant=apprenant,
        session=session,
        date_inscription=maintenant,
        date_limite_paiement=date_limite,
    )

@transaction.atomic
def expirer_inscriptions():
    maintenant = timezone.now()

    preuves_deposees_a_temps = Paiement.objects.filter(
        statut=Paiement.Statut.A_VERIFIER,
        created_at__lte=F("inscription__date_limite_paiement"),
    ).values("inscription_id")

    # On expire les inscriptions en attente dont le délai est passé,
    # sauf celles qui ont une preuve déposée à temps et toujours en vérification.
    return Inscription.objects.filter(
        statut=Inscription.Statut.EN_ATTENTE_PAIEMENT,
        date_limite_paiement__lte=maintenant,
    ).exclude(
        id__in=Subquery(preuves_deposees_a_temps)
    ).update(
        statut=Inscription.Statut.EXPIREE,
        updated_at=maintenant,
    )