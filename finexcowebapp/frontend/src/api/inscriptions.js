/* =====================================================================
   INSCRIPTION À UNE SESSION
     POST /api/inscriptions/   corps : { session_id }
   Il faut être connecté. Le backend sait qui s'inscrit grâce au jeton,
   on n'envoie donc que l'identifiant de la session.
   Réponse : { id, session, date_inscription, date_limite_paiement, statut }
   (statut "EN_ATTENTE_PAIEMENT" : jusqu’à 72 h, sans dépasser la clôture de la session)
   ===================================================================== */
import { appeler } from "./auth";

export const creerInscriptionApi = (jeton, sessionId) =>
  appeler("/api/inscriptions/", {
    methode: "POST",
    corps: { session_id: sessionId },
    jeton,
  });


/* Historique des inscriptions de l’apprenant connecté. */
export const mesInscriptionsApi = (jeton) =>
  appeler("/api/inscriptions/", { jeton });

/* Annule une inscription si les règles backend l’autorisent. */
export const annulerInscriptionApi = (jeton, inscriptionId) =>
  appeler("/api/inscriptions/" + inscriptionId + "/annuler/", {
    methode: "POST",
    jeton,
  });
