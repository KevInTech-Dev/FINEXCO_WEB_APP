import { Link } from "react-router-dom";
import SessionCard from "../components/SessionCard";
import { sessionsDuCatalogue } from "../api/formations";
import SectionContact from "../components/SectionContact";
import { DOMAINES } from "../config/infos";
import { useFormations } from "../context/FormationsContext";
import useTitre from "../hooks/useTitre";

// Nombre de sessions montrées sur l’accueil : les autres sont sur /formations.
const NOMBRE_APERCU = 3;

export default function Accueil() {
  useTitre("");
  const { formations, chargement, erreur } = useFormations();
  const sessions = sessionsDuCatalogue(formations);
  const apercu = sessions.slice(0, NOMBRE_APERCU);

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
            Les prochaines sessions et ateliers pour renforcer vos
            compétences et accompagner votre évolution professionnelle.
          </p>

          <Link className="primary-button" to="/formations">
            Découvrir les formations
          </Link>

          <div className="hero-stats">
            <div>
              <strong>{String(sessions.length).padStart(2, "0")}</strong>
              <span>Sessions à venir</span>
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
            <span className="eyebrow">NOS SESSIONS</span>
            <h2>Les prochaines sessions</h2>
            <p>Les sessions ouvertes et à venir proposées par FINEXCO.</p>
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

        {!chargement && !erreur && sessions.length === 0 && (
          <div className="empty-state">
            <h3>Aucune session disponible</h3>
            <p>Il n’y a actuellement aucune session ouverte à venir.</p>
          </div>
        )}

        <div className="formation-grid">
          {apercu.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>

        {!chargement && !erreur && sessions.length > 0 && (
          <div className="section-more">
            <Link className="primary-button" to="/formations">
              {sessions.length > NOMBRE_APERCU
                ? "Voir plus de sessions"
                : "Voir toutes les sessions"}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>

      <SectionContact />
    </>
  );
}
