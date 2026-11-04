import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SessionCard from "../components/SessionCard";
import { sessionsDuCatalogue } from "../api/formations";
import { useFormations } from "../context/FormationsContext";
import useTitre from "../hooks/useTitre";

/* Page /formations : le catalogue complet, avec recherche et filtres.
   La catégorie choisie est gardée dans l'adresse (/formations?categorie=Audit),
   ce qui permet de partager un lien déjà filtré. */
export default function Formations() {
  useTitre("Formations");
  const { formations, chargement, erreur } = useFormations();
  const sessions = sessionsDuCatalogue(formations);
  const navigate = useNavigate();
  const { search } = useLocation();
  const [recherche, setRecherche] = useState("");

  const categorie = new URLSearchParams(search).get("categorie") || "Toutes";
  const categories = [
    "Toutes",
    ...new Set(sessions.map((session) => session.categorie)),
  ];

  function choisirCategorie(nom) {
    navigate(
      nom === "Toutes"
        ? "/formations"
        : `/formations?categorie=${encodeURIComponent(nom)}`,
      { replace: true }
    );
  }

  const sessionsFiltrees = sessions.filter((session) => {
    const texte = recherche.toLowerCase();
    const correspondRecherche = [
      session.formationTitre,
      session.formationDescription,
      session.dates,
      session.lieu,
      session.formateur,
    ]
      .filter(Boolean)
      .some((valeur) => valeur.toLowerCase().includes(texte));
    const correspondCategorie =
      categorie === "Toutes" || session.categorie === categorie;

    return correspondRecherche && correspondCategorie;
  });

  return (
    <section className="catalogue section" id="catalogue">
      <div className="section-heading">
        <div>
          <span className="eyebrow">NOTRE CATALOGUE</span>
          <h2>Nos sessions de formation</h2>
          <p>Consultez les dates, le lieu et le tarif de chaque session.</p>
        </div>
        <span className="formation-count">
          {sessionsFiltrees.length} session(s)
        </span>
      </div>

      <div className="catalogue-tools">
        <input
          type="search"
          placeholder="Rechercher une session, une formation ou un lieu..."
          value={recherche}
          onChange={(event) => setRecherche(event.target.value)}
          aria-label="Rechercher une session, une formation ou un lieu"
        />

        <div className="category-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={categorie === item ? "filter active" : "filter"}
              onClick={() => choisirCategorie(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {chargement && (
        <div className="empty-state page-state" role="status">
          <h3>Chargement des sessions…</h3>
          <p>Merci de patienter quelques instants.</p>
        </div>
      )}

      {!chargement && erreur && (
        <div className="empty-state" role="alert">
          <h3>Catalogue indisponible</h3>
          <p>Les sessions ne peuvent pas être chargées depuis le serveur.</p>
        </div>
      )}

      <div className="formation-grid">
        {sessionsFiltrees.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>

      {!chargement && !erreur && sessionsFiltrees.length === 0 && (
        <div className="empty-state">
          <h3>Aucune session disponible</h3>
          <p>Il n’y a actuellement aucune session correspondant à ces critères.</p>
          <button
            className="secondary-button"
            onClick={() => {
              setRecherche("");
              choisirCategorie("Toutes");
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </section>
  );
}
