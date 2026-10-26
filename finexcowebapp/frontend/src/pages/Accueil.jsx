import { Link } from "react-router-dom";
import FormationCard from "../components/FormationCard";
import SectionContact from "../components/SectionContact";
import { DOMAINES } from "../config/infos";
import { useFormations } from "../context/FormationsContext";
import useTitre from "../hooks/useTitre";

// Nombre de formations montrées sur l'accueil : les autres sont sur /formations
const NOMBRE_APERCU = 3;

export default function Accueil() {
  useTitre("");
  const { formations, chargement } = useFormations();
  const apercu = formations.slice(0, NOMBRE_APERCU);

  return (
    <>
      <section className="hero" id="accueil">
        <div className="hero-content">
          <span className="eyebrow">FINEXCO · FORMATION PROFESSIONNELLE</span>

          <h1>
            Développez vos compétences.
            <span> Donnez de la valeur à votre avenir.</span>
          </h1>

          <p>
            Découvrez nos formations et ateliers pour renforcer vos
            compétences et accompagner votre évolution professionnelle.
          </p>

          <Link className="primary-button" to="/formations">
            Découvrir les formations
          </Link>

          <div className="hero-stats">
            <div>
              <strong>{String(formations.length).padStart(2, "0")}</strong>
              <span>Formations présentées</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Orienté compétences</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <span className="panel-label">NOTRE ENGAGEMENT</span>
          <div className="panel-line" />
          <h2>Apprendre aujourd'hui, progresser demain.</h2>
          <p>
            Des parcours conçus pour soutenir le développement des
            compétences professionnelles.
          </p>
          <span className="panel-mark">F.</span>
        </div>
      </section>

      <section className="domains">
        <p>DES COMPÉTENCES POUR VOTRE PARCOURS</p>
        <div className="domain-list">
          {DOMAINES.map((domaine) => (
            <span key={domaine}>{domaine}</span>
          ))}
        </div>
      </section>

      <section className="catalogue section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">NOS FORMATIONS</span>
            <h2>Découvrez nos formations</h2>
            <p>Un aperçu de notre catalogue et de nos prochaines sessions.</p>
          </div>
        </div>

        {chargement && (
          <div className="empty-state page-state" role="status">
            <h3>Chargement des formations…</h3>
            <p>Merci de patienter quelques instants.</p>
          </div>
        )}

        <div className="formation-grid">
          {apercu.map((formation) => (
            <FormationCard key={formation.id} formation={formation} />
          ))}
        </div>

        {!chargement && (
          <div className="section-more">
            <Link className="primary-button" to="/formations">
              {formations.length > NOMBRE_APERCU
                ? "Voir plus de formations"
                : "Voir toutes les formations"}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>

      <SectionContact />
    </>
  );
}
