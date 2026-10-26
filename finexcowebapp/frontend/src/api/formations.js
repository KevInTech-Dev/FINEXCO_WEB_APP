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
   DONNÉES DE SECOURS
   Affichées seulement si le serveur ne répond pas (ou n'a encore aucune
   formation publiée). Elles ont exactement la forme de la réponse du
   backend, donc elles passent par le même code que les vraies données.
   ===================================================================== */
const DONNEES_SECOURS = [
  {
    id: "secours-1",
    nom: "Atelier SYCEBNL",
    description: "Formation pratique pour comprendre le SYCEBNL.",
    categorie: { id: "cat-1", nom: "Comptabilité" },
    sessions: [
      {
        id: "secours-1-a",
        date_debut: "2026-11-10",
        date_fin: "2026-11-15",
        duree_jours: 6,
        lieu: "Salle B2, Siège Lomé",
        prix: "75000",
        place_total: null,
        formateur: null,
      },
    ],
  },
  {
    id: "secours-2",
    nom: "Marketing Digital & Social Media",
    description:
      "Développez votre marque et maîtrisez les publicités en ligne.",
    categorie: { id: "cat-2", nom: "Marketing" },
    sessions: [
      {
        id: "secours-2-a",
        date_debut: "2026-11-07",
        date_fin: "2026-11-28",
        duree_jours: 22,
        lieu: "En ligne (Google Meet)",
        prix: "30000",
        place_total: null,
        formateur: null,
      },
    ],
  },
  {
    id: "secours-3",
    nom: "Anglais Professionnel Intensif",
    description:
      "Gagnez en fluidité à l'oral pour vos réunions et entretiens professionnels.",
    categorie: { id: "cat-3", nom: "Langues" },
    sessions: [
      {
        id: "secours-3-a",
        date_debut: "2026-12-01",
        date_fin: "2026-12-30",
        duree_jours: 30,
        lieu: "Format hybride : Lomé + replay Zoom",
        prix: "25000",
        place_total: null,
        formateur: null,
      },
    ],
  },
];

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
    return `Du ${dateComplete(d)} au ${dateComplete(f)}`;
  }
  if (d.getMonth() === f.getMonth()) {
    return `Du ${jourFr(d)} au ${dateComplete(f)}`;
  }
  return `Du ${jourFr(d)} ${moisFr(d)} au ${dateComplete(f)}`;
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
    titre: debut ? `Session du ${dateComplete(debut)}` : "Session de formation",
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
    image: media.image ?? null,
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

/* Charge les formations publiées puis les sessions de chacune.
   Ne plante jamais : en cas de problème, renvoie les données de secours. */
export async function chargerFormations(signal) {
  try {
    const liste = await recupererListe("/api/formations/", signal);
    if (liste.length === 0) {
      throw new Error("Aucune formation publiée pour le moment");
    }

    const formations = await Promise.all(
      liste.map(async (formation) => {
        let sessions = [];
        try {
          sessions = await recupererListe(
            `/api/formations/${formation.id}/sessions/`,
            signal
          );
        } catch {
          sessions = [];
        }
        return adapterFormation(formation, sessions);
      })
    );

    return { formations, source: "api", erreur: null };
  } catch (erreur) {
    return {
      formations: DONNEES_SECOURS.map((formation) =>
        adapterFormation(formation, formation.sessions)
      ),
      source: "secours",
      erreur: erreur.message,
    };
  }
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
