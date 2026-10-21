from .models import Formation


def formations_publiques():
    return (
        Formation.objects
        .filter(etat_publication=Formation.EtatPublication.PUBLIE)
        .select_related("categorie")
    )