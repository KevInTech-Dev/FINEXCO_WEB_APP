from django.utils import timezone

from .models import SessionFormation


def sessions_publiques(*, formation_id):
    return (
        SessionFormation.objects
        .filter(
            formation_id=formation_id,
            formation__etat_publication="PUBLIE",
            etat=SessionFormation.EtatSession.OUVERTE,
            date_debut__gte=timezone.localdate(),
        )
        .select_related("formation", "formation__categorie", "formateur")
        .order_by("date_debut")
    )