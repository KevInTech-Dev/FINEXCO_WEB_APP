import { appeler } from "./auth";

function listeApi(donnees) {
  return Array.isArray(donnees) ? donnees : (donnees?.results ?? []);
}

export async function chargerFormationsAdminApi(jeton) {
  return listeApi(await appeler("/api/admin/formations/", { jeton }));
}

export async function chargerFormateursApi(jeton) {
  return listeApi(await appeler("/api/admin/formateurs/", { jeton }));
}

export async function creerFormateurApi(jeton, donnees) {
  return appeler("/api/admin/formateurs/", {
    methode: "POST",
    corps: donnees,
    jeton,
  });
}

export async function chargerSessionsAdminApi(jeton) {
  return listeApi(await appeler("/api/admin/sessions/", { jeton }));
}

export async function chargerInscriptionsAdminApi(jeton) {
  return listeApi(await appeler("/api/inscriptions/admin/", { jeton }));
}

export async function chargerCategoriesApi() {
  return listeApi(await appeler("/api/categories/"));
}

export async function creerFormationAdminApi(jeton, donnees) {
  return appeler("/api/admin/formations/", {
    methode: "POST",
    corps: donnees,
    jeton,
  });
}

export async function modifierFormationAdminApi(jeton, id, donnees) {
  return appeler(`/api/admin/formations/${id}`, {
    methode: "PATCH",
    corps: donnees,
    jeton,
  });
}

export async function creerSessionAdminApi(jeton, donnees) {
  return appeler("/api/sessions/", {
    methode: "POST",
    corps: donnees,
    jeton,
  });
}

export async function modifierSessionAdminApi(jeton, id, donnees) {
  return appeler(`/api/admin/sessions/${id}/`, {
    methode: "PATCH",
    corps: donnees,
    jeton,
  });
}

export async function chargerPaiementsAverifierApi(jeton) {
  return listeApi(await appeler("/api/paiements/a-verifier/", { jeton }));
}

export async function chargerTousPaiementsApi(jeton) {
  return listeApi(await appeler("/api/paiements/tous/", { jeton }));
}

export async function validerPaiementApi(jeton, id) {
  return appeler(`/api/paiements/${id}/valider/`, {
    methode: "POST",
    jeton,
  });
}

export async function refuserPaiementApi(jeton, id, motif) {
  return appeler(`/api/paiements/${id}/refuser/`, {
    methode: "POST",
    corps: { motif },
    jeton,
  });
}
