from .models import Paiement

def paiements_a_verifier():
    return (
        Paiement.objects.filter(statut=Paiement.Statut.A_VERIFIER)
        .select_related(
            "inscription__apprenant",
            "inscription__session__formation__categorie",
            "inscription__session__formateur",
        )
    )

def paiements_de_apprenant(*, apprenant):
    return (
        Paiement.objects.filter(inscription__apprenant=apprenant)
        .select_related(
            "inscription__session__formation__categorie",
            "inscription__session__formateur",
        )
    )

def tous_les_paiements():
    return Paiement.objects.select_related(
        "inscription__apprenant",
        "inscription__session__formation__categorie",
        "inscription__session__formateur",
        "traite_par",
    )