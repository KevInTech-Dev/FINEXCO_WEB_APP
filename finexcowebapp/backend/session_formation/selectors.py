from django.utils import timezone

from .models import SessionFormation


def sessions_publiques_de_formation(formation_id):
    # On conserve les sessions ouvertes, à venir, liées à une formation publiée.
    return (
        SessionFormation.objects
        .filter(
            formation_id=formation_id,
            formation__etat_publication="PUBLIE",
            etat=SessionFormation.EtatSession.OUVERTE,
            date_debut__gte=timezone.localdate(),
            date_cloture_paiement__gt=timezone.now(),
        )
        .select_related("formation")
    )