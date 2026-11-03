/* =====================================================================
   PAIEMENT D'UNE INSCRIPTION
     POST /api/paiements/   (envoi avec fichier)
       inscription_id   identifiant de l'inscription
       mode             "FLOOZ" ou "TMONEY"
       preuve_paiement  le fichier (capture d'écran ou PDF du reçu)
   Le montant n'est pas envoyé : le backend prend le prix de la session.
   Réponse : { id, montant, statut: "A_VERIFIER" }
   ===================================================================== */
import { appeler } from "./auth";

export const MODES_PAIEMENT = [
  { code: "FLOOZ", nom: "Flooz" },
  { code: "TMONEY", nom: "TMoney" },
];

export const TAILLE_MAX_PREUVE = 5 * 1024 * 1024; // 5 Mo
export const TYPES_PREUVE = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export function soumettrePaiementApi(jeton, { inscriptionId, mode, fichier }) {
  const donnees = new FormData();
  donnees.append("inscription_id", inscriptionId);
  donnees.append("mode", mode);
  donnees.append("preuve_paiement", fichier);
  return appeler("/api/paiements/", { methode: "POST", corps: donnees, jeton });
}
