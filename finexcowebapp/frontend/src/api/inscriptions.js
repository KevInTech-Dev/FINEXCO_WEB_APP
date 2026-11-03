/* =====================================================================
   INSCRIPTION À UNE SESSION
     POST /api/inscriptions/   corps : { session_id }
   Il faut être connecté. Le backend sait qui s'inscrit grâce au jeton,
   on n'envoie donc que l'identifiant de la session.
   Réponse : { id, session, date_inscription, date_limite_paiement, statut }
   (statut "EN_ATTENTE_PAIEMENT" : la personne a 72 h pour payer)
   ===================================================================== */
import { appeler } from "./auth";

export const creerInscriptionApi = (jeton, sessionId) =>
  appeler("/api/inscriptions/", {
    methode: "POST",
    corps: { session_id: sessionId },
    jeton,
  });
