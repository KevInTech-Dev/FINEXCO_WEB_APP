/* Envoie la preuve de paiement manuel à l’API. */
import { appeler } from "./auth";

// FormData permet d’envoyer l’image et les champs dans une seule requête.
export function soumettrePaiementApi(jeton, { inscriptionId, mode, preuvePaiement }) {
  const donnees = new FormData();
  donnees.append("inscription_id", inscriptionId);
  donnees.append("mode", mode);
  donnees.append("preuve_paiement", preuvePaiement);

  return appeler("/api/paiements/", {
    methode: "POST",
    corps: donnees,
    jeton,
  });
}


/* Historique des paiements de l’apprenant connecté. */
export const mesPaiementsApi = (jeton) =>
  appeler("/api/paiements/mes-paiements/", { jeton });
