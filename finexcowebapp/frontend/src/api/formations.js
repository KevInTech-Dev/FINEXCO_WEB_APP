/* =====================================================================
   INFOS QUI NE VIENNENT PAS DU BACKEND
   Le backend ne fournit ni photo, ni modalité, ni texte détaillé.
   On les garde ici, rattachés au NOM de la formation (peu importe les
   majuscules et les accents). Une formation absente de cette liste
   s'affiche quand même, avec un bloc rose à la place de la photo.
   Les photos se placent dans : public/images/formations/
   ===================================================================== */
const MEDIAS = {
  "atelier sycebnl": {
    image: "/images/formations/atelier-sycebnl.jpg",
    modalite: "Présentiel",
    details:
      "Découvrez les principes du SYCEBNL et familiarisez-vous avec son application pratique à travers un atelier orienté vers la compréhension des exigences comptables des organismes concernés.",
  },
  "marketing digital & social media": {
    image: "/images/formations/marketing-digital.png",
    modalite: "En ligne",
    details:
      "Découvrez les bases du marketing digital, apprenez à valoriser une marque sur les réseaux sociaux et explorez les principales approches de la publicité en ligne.",
  },
  "anglais professionnel intensif": {
    image: "/images/formations/anglais-professionnel.png",
    modalite: "Hybride",
    details:
      "Renforcez votre communication en anglais dans un contexte professionnel, notamment pour les réunions, les échanges avec des collègues et la préparation aux entretiens.",
  },
};

/* =====================================================================
   CONVERSION DES DONNÉES DU BACKEND
   Tout ce qui change entre le backend et le site est ici, au même endroit.
   ===================================================================== */
const normaliser = (texte = "") =>
  String(texte)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// "2026-11-10" -> date locale (sans décalage de fuseau horaire)
function lireDate(texte) {
  if (!texte) return null;
  const [annee, mois, jour] = String(texte).slice(0, 10).split("-").map(Number);
  if (!annee || !mois || !jour) return null;
  return new Date(annee, mois - 1, jour);
}

const formaterDate = (date, options) =>
  date.toLocaleDateString("fr-FR", options);

const jourFr = (date) => (date.getDate() === 1 ? "1er" : String(date.getDate()));
const moisFr = (date) => formaterDate(date, { month: "long" });
const dateComplete = (date) =>
  `${jourFr(date)} ${moisFr(date)} ${date.getFullYear()}`;

function formaterPeriode(debut, fin) {
  const d = lireDate(debut);
  const f = lireDate(fin);
  if (!d) return "Dates à confirmer";

  if (!f || d.getTime() === f.getTime()) {
    return `Le ${dateComplete(d)}`;
  }

  if (d.getFullYear() !== f.getFullYear()) {
    return `Session du ${dateComplete(d)} au ${dateComplete(f)}`;
  }
  if (d.getMonth() === f.getMonth()) {
    return `Session du ${jourFr(d)} au ${dateComplete(f)}`;
  }
  return `Session du ${jourFr(d)} ${moisFr(d)} au ${dateComplete(f)}`;
}

function joursEntre(debut, fin) {
  const d = lireDate(debut);
  const f = lireDate(fin);
  if (!d || !f) return null;
  return Math.round((f - d) / 86400000) + 1;
}

const libelleJours = (n) => (n ? `${n} jour${n > 1 ? "s" : ""}` : null);

// Si la formation n'est pas dans MEDIAS, on devine la modalité d'après le lieu.
function devinerModalite(lieu) {
  if (!lieu) return null;
  return /en ligne|zoom|meet|teams|distance/i.test(lieu)
    ? "En ligne"
    : "Présentiel";
}

function adapterSession(session) {
  const debut = lireDate(session.date_debut);
  const prix = Number(session.prix);

  return {
    id: session.id,
    dates: formaterPeriode(session.date_debut, session.date_fin),
    duree: libelleJours(
      session.duree_jours ?? joursEntre(session.date_debut, session.date_fin)
    ),
    lieu: session.lieu || "Lieu à confirmer",
    prix:
      session.prix !== null && session.prix !== undefined && Number.isFinite(prix)
        ? prix
        : null,
    placeTotal: session.place_total ?? null,
    // On récupère la photo propre à cette session depuis l’API.
    image: session.image ?? null,
    // La date sert au tri du catalogue lorsque l’API la fournit.
    createdAt: session.created_at ?? null,
    formateur: session.formateur?.nom_complet ?? null,
  };
}

function adapterFormation(formation, sessionsBrutes = []) {
  const sessions = sessionsBrutes.map(adapterSession);
  const prix = sessions
    .map((session) => session.prix)
    .filter((valeur) => valeur !== null);
  const prixMin = prix.length ? Math.min(...prix) : null;
  const prixVariable = prix.length > 0 && Math.max(...prix) !== prixMin;
  const media = MEDIAS[normaliser(formation.nom)] ?? {};

  return {
    id: formation.id,
    titre: formation.nom,
    categorie: formation.categorie?.nom ?? "Autres",
    description: formation.description || "",
    details: media.details ?? formation.description ?? "",
    image: formation.image ?? null,
    modalite: media.modalite ?? devinerModalite(sessionsBrutes[0]?.lieu),
    // La durée est calculée par le backend pour chaque session :
    // on affiche celle de la prochaine session.
    duree: sessions[0]?.duree ?? null,
    prixMin,
    prixVariable,
    sessions,
  };
}

async function recupererListe(url, signal) {
  const reponse = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!reponse.ok) throw new Error(`Erreur ${reponse.status} sur ${url}`);
  const donnees = await reponse.json();
  return Array.isArray(donnees) ? donnees : (donnees.results ?? []);
}

/* Charge les formations publiées et leurs sessions depuis l’API.
   En cas d’échec, renvoie une erreur au contexte sans inventer de données. */
export async function chargerFormations(signal) {
  try {
    const liste = await recupererListe("/api/formations/", signal);
    const formations = await Promise.all(
      liste.map(async (formation) => {
        const sessions = await recupererListe(
          `/api/formations/${formation.id}/sessions/`,
          signal
        );
        return adapterFormation(formation, sessions);
      })
    );

    return { formations, source: "api", erreur: null };
  } catch (erreur) {
    return {
      formations: [],
      source: "erreur",
      erreur: erreur.message,
    };
  }
}

/* Aplati les sessions pour que le catalogue affiche chaque session séparément.
   Les plus récemment créées apparaissent d'abord quand created_at est fourni. */
export function sessionsDuCatalogue(formations) {
  return formations
    .flatMap((formation) =>
      formation.sessions.map((session) => ({
        ...session,
        formationId: formation.id,
        formationTitre: formation.titre,
        formationDescription: formation.description,
        image: session.image ?? formation.image ?? null,
        categorie: formation.categorie,
        modalite: formation.modalite,
      }))
    )
    .sort((sessionA, sessionB) => {
      const dateA = Date.parse(sessionA.createdAt);
      const dateB = Date.parse(sessionB.createdAt);
      const aValide = Number.isFinite(dateA);
      const bValide = Number.isFinite(dateB);

      // Les sessions datées sont classées de la création la plus récente à la plus ancienne.
      if (aValide && bValide) return dateB - dateA;
      if (aValide) return -1;
      if (bValide) return 1;

      // Si l’API n’envoie pas created_at, on garde l’ordre reçu.
      return 0;
    });
}

/* ----- Affichage ----- */

export const formatPrix = (prix) =>
  `${prix.toLocaleString("fr-FR")} FCFA`;

export const libellePrix = (formation) =>
  formation.prixMin === null
    ? "Sur demande"
    : `${formation.prixVariable ? "À partir de " : ""}${formatPrix(formation.prixMin)}`;

export const symboleCategorie = (categorie) =>
  categorie === "Comptabilité"
    ? "§"
    : categorie === "Marketing"
      ? "↗"
      : categorie === "Langues"
        ? "Aa"
        : (categorie || "F").charAt(0).toUpperCase();
