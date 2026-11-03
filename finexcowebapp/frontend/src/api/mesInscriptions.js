/* =====================================================================
   « MES INSCRIPTIONS » (pour le menu de profil)
   POUR L'INSTANT : on lit les inscriptions gardées dans le navigateur
   (celles faites sur cet appareil), voir inscriptionsLocales.js.

   ➜ QUAND KEVIN AURA AJOUTÉ SA ROUTE (ex. GET /api/inscriptions/mes/),
     c'est ICI qu'on remplacera la lecture locale par un appel au backend :
     on n'aura rien d'autre à changer dans le menu de profil.
   ===================================================================== */
import { listerInscriptions } from "./inscriptionsLocales";

export function lireMesInscriptions(utilisateurId) {
  // Les plus récentes d'abord
  return [...listerInscriptions(utilisateurId)].reverse();
}

/* Texte et couleur du statut d'une inscription.
   Les statuts "confirmée" et "refusée" viendront avec la route de Kevin. */
export function statutInscription(inscription) {
  if (inscription.preuveEnvoyee) {
    return { code: "verification", libelle: "Preuve envoyée · à vérifier", paiementPossible: false };
  }
  if (new Date(inscription.dateLimite).getTime() < Date.now()) {
    return { code: "depasse", libelle: "Délai de paiement dépassé", paiementPossible: false };
  }
  return { code: "attente", libelle: "En attente de paiement", paiementPossible: true };
}
