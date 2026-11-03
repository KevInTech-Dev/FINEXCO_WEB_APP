/* =====================================================================
   MÉMOIRE LOCALE DES INSCRIPTIONS (solution provisoire)
   Le backend n'a pas encore de route "mes inscriptions". En attendant, on
   garde dans le navigateur les inscriptions faites sur cet appareil, pour
   pouvoir retourner à la page de paiement après une actualisation.
   ➜ Quand la route existera, on la remplacera par un appel au backend.
   ===================================================================== */

const CLE = "finexco_inscriptions";

function lireTout() {
  try {
    return JSON.parse(localStorage.getItem(CLE)) || {};
  } catch {
    return {};
  }
}

function ecrireTout(donnees) {
  try {
    localStorage.setItem(CLE, JSON.stringify(donnees));
  } catch {
    /* stockage refusé : la mémoire durera le temps de la page */
  }
}

export const listerInscriptions = (utilisateurId) =>
  lireTout()[utilisateurId] || [];

export const trouverInscription = (utilisateurId, id) =>
  listerInscriptions(utilisateurId).find((item) => item.id === id) || null;

export const trouverParSession = (utilisateurId, sessionId) =>
  listerInscriptions(utilisateurId).find((item) => item.sessionId === sessionId) ||
  null;

/* item : { id, formationId, sessionId, dateLimite, preuveEnvoyee, demo } */
export function enregistrerInscription(utilisateurId, item) {
  const tout = lireTout();
  const autres = (tout[utilisateurId] || []).filter(
    (ancien) => ancien.id !== item.id && ancien.sessionId !== item.sessionId
  );
  tout[utilisateurId] = [...autres, item];
  ecrireTout(tout);
}

export function marquerPreuveEnvoyee(utilisateurId, id) {
  const tout = lireTout();
  tout[utilisateurId] = (tout[utilisateurId] || []).map((item) =>
    item.id === id ? { ...item, preuveEnvoyee: true } : item
  );
  ecrireTout(tout);
}
