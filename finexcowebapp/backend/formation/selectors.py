from .models import Formation, Categorie

def formations_publiques():
    return (
        Formation.objects
        .filter(etat_publication=Formation.EtatPublication.PUBLIE)
        .select_related("categorie")
    )

def categories_publiques():
    return Categorie.objects.order_by("nom")

def formations_administrations():
    return Formation.objects.select_related("categorie").order_by("nom")
