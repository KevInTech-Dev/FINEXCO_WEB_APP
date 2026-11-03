import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormationCard from "../components/FormationCard";
import { useFormations } from "../context/FormationsContext";
import useTitre from "../hooks/useTitre";

/* Page /formations : le catalogue complet, avec recherche et filtres.
   La catégorie choisie est gardée dans l'adresse (/formations?categorie=Audit),
   ce qui permet de partager un lien déjà filtré. */
export default function Formations() {
  useTitre("Formations");
  const { formations, chargement } = useFormations();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [recherche, setRecherche] = useState("");

  const categorie = new URLSearchParams(search).get("categorie") || "Toutes";
  const categories = [
    "Toutes",
    ...new Set(formations.map((formation) => formation.categorie)),
  ];

  function choisirCategorie(nom) {
    navigate(
      nom === "Toutes"
        ? "/formations"
        : `/formations?categorie=${encodeURIComponent(nom)}`,
      { replace: true }
    );
  }

  const formationsFiltrees = formations.filter((formation) => {
    const texte = recherche.toLowerCase();
    const correspondRecherche =
      formation.titre.toLowerCase().includes(texte) ||
      formation.description.toLowerCase().includes(texte);
    const correspondCategorie =
      categorie === "Toutes" || formation.categorie === categorie;

    return correspondRecherche && correspondCategorie;
  });

  return (
    <section className="catalogue section" id="catalogue">
      <div className="section-heading">
        <div>
          <span className="eyebrow">NOTRE CATALOGUE</span>
          <h2>Nos formations</h2>
          <p>
            Choisissez une formation pour consulter son programme et ses
            sessions.
          </p>
        </div>
        <span className="formation-count">
          {formationsFiltrees.length} formation(s)
        </span>
      </div>

      <div className="catalogue-tools">
        <input
          type="search"
          placeholder="Rechercher une formation..."
          value={recherche}
          onChange={(event) => setRecherche(event.target.value)}
          aria-label="Rechercher une formation"
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
          <h3>Chargement des formations…</h3>
          <p>Merci de patienter quelques instants.</p>
        </div>
      )}

      <div className="formation-grid">
        {formationsFiltrees.map((formation) => (
          <FormationCard key={formation.id} formation={formation} />
        ))}
      </div>

      {!chargement && formationsFiltrees.length === 0 && (
        <div className="empty-state">
          <h3>Aucune formation trouvée</h3>
          <p>Essayez un autre mot-clé ou une autre catégorie.</p>
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
