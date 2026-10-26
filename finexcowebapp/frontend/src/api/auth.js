/* =====================================================================
   APPELS AU BACKEND POUR LES COMPTES
   Routes du backend (Django) :
     POST /api/auth/inscription/  -> crée un compte apprenant
     POST /api/auth/connexion/    -> renvoie { access, refresh }
     POST /api/auth/rafraichir/   -> renvoie un nouveau { access }
     GET  /api/auth/me/           -> profil de la personne connectée
   ===================================================================== */

const CLE_STOCKAGE = "finexco_jetons";

/* ----- Jetons de connexion, gardés dans le navigateur ----- */

export function lireJetons() {
  try {
    return JSON.parse(localStorage.getItem(CLE_STOCKAGE)) || null;
  } catch {
    return null;
  }
}

export function sauverJetons(jetons) {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(jetons));
  } catch {
    /* navigateur qui refuse le stockage : la connexion durera le temps de la page */
  }
}

export function effacerJetons() {
  try {
    localStorage.removeItem(CLE_STOCKAGE);
  } catch {
    /* rien à faire */
  }
}

/* ----- Appel générique ----- */

export class ErreurApi extends Error {
  constructor(statut, donnees) {
    super(`Erreur ${statut}`);
    this.statut = statut; // 0 = serveur injoignable
    this.donnees = donnees;
  }
}

export async function appeler(chemin, { methode = "GET", corps, jeton } = {}) {
  let reponse;
  try {
    reponse = await fetch(chemin, {
      method: methode,
      headers: {
        Accept: "application/json",
        ...(corps ? { "Content-Type": "application/json" } : {}),
        ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}),
      },
      body: corps ? JSON.stringify(corps) : undefined,
    });
  } catch {
    throw new ErreurApi(0, null);
  }

  let donnees = null;
  try {
    const texte = await reponse.text();
    donnees = texte ? JSON.parse(texte) : null;
  } catch {
    donnees = null;
  }

  if (!reponse.ok) throw new ErreurApi(reponse.status, donnees);
  return donnees;
}

export const connexionApi = (email, motDePasse) =>
  appeler("/api/auth/connexion/", {
    methode: "POST",
    corps: { email, password: motDePasse },
  });

export const inscriptionApi = (donnees) =>
  appeler("/api/auth/inscription/", { methode: "POST", corps: donnees });

export const profilApi = (jeton) => appeler("/api/auth/me/", { jeton });

export const rafraichirApi = (refresh) =>
  appeler("/api/auth/rafraichir/", { methode: "POST", corps: { refresh } });

/* ----- Messages d'erreur en français ----- */

const TRADUCTIONS = [
  [/no active account/i, "E-mail ou mot de passe incorrect."],
  [/already exists/i, "Un compte existe déjà avec cette adresse e-mail."],
  [/may not be blank|field is required/i, "Ce champ est obligatoire."],
  [/valid email/i, "Saisissez une adresse e-mail valide."],
  [/too common/i, "Ce mot de passe est trop courant."],
  [/entirely numeric/i, "Le mot de passe ne peut pas contenir que des chiffres."],
  [/too similar/i, "Ce mot de passe ressemble trop à vos informations personnelles."],
  [/too short|at least 8|no less than 8/i, "Le mot de passe est trop court (8 caractères minimum)."],
  [/no more than/i, "Ce texte est trop long."],
  [/déjà inscrit/i, "Vous êtes déjà inscrit(e) à cette session."],
  [/not valid|token/i, "Votre connexion a expiré. Reconnectez-vous."],
];

function traduire(message) {
  const trouve = TRADUCTIONS.find(([motif]) => motif.test(message));
  return trouve ? trouve[1] : message;
}

/* Transforme une erreur du backend en :
   { champs: { email: "...", password: "..." }, general: "..." } */
export function analyserErreur(erreur) {
  if (!(erreur instanceof ErreurApi)) {
    return {
      champs: {},
      general: "Une erreur inattendue est survenue. Réessayez.",
    };
  }

  if (erreur.statut === 0 || erreur.statut >= 500) {
    return {
      champs: {},
      general:
        "Le serveur est indisponible pour le moment. Réessayez dans quelques instants.",
    };
  }

  const champs = {};
  const generaux = [];
  const donnees = erreur.donnees;

  if (donnees && typeof donnees === "object" && !Array.isArray(donnees)) {
    for (const [cle, valeur] of Object.entries(donnees)) {
      const messages = (Array.isArray(valeur) ? valeur : [valeur]).map((m) =>
        traduire(String(m))
      );
      if (cle === "detail" || cle === "non_field_errors") {
        generaux.push(...messages);
      } else {
        champs[cle] = messages.join(" ");
      }
    }
  }

  if (generaux.length === 0 && erreur.statut === 401) {
    generaux.push("E-mail ou mot de passe incorrect.");
  }

  return {
    champs,
    general:
      generaux[0] ||
      (Object.keys(champs).length > 0
        ? ""
        : "La demande n'a pas pu aboutir. Vérifiez les informations saisies."),
  };
}
