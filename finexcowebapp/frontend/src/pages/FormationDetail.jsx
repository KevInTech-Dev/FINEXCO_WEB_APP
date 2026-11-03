import { Link, useNavigate, useParams } from "react-router-dom";
import FormationImage from "../components/FormationImage";
import { formatPrix, libellePrix, symboleCategorie } from "../api/formations";
import { useFormations } from "../context/FormationsContext";
import useTitre from "../hooks/useTitre";

/* Page /formations/:id : la fiche d'une formation et ses sessions. */
export default function FormationDetail() {
  const { id } = useParams();
  const { formations, chargement, source } = useFormations();
  const navigate = useNavigate();

  const formation = formations.find((item) => String(item.id) === id);
  useTitre(formation ? formation.titre : "Formation");

  // L'inscription a sa propre page. Si la personne n'est pas connectée,
  // cette page la renvoie d'abord vers la connexion.
  function demanderInscription(session) {
    navigate(`/formations/${id}/sessions/${session.id}/inscription`);
  }

  if (chargement) {
    return (
      <section className="detail-page">
        <div className="empty-state page-state" role="status">
          <h3>Chargement de la formation…</h3>
          <p>Merci de patienter quelques instants.</p>
        </div>
      </section>
    );
  }

  if (!formation) {
    return (
      <section className="detail-page">
        <div className="empty-state">
          <h3>Formation introuvable</h3>
          <p>Cette formation n'existe pas ou n'est plus proposée.</p>
          <Link className="primary-button" to="/formations">
            Voir toutes les formations
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="detail-page">
      <Link className="back-button" to="/formations">
        ← Retour au catalogue
      </Link>

      <div className="detail-hero">
        <div>
          <span className="category-tag">{formation.categorie}</span>
          <h1>{formation.titre}</h1>
          <p className="detail-intro">{formation.description}</p>
        </div>

        <div className="detail-media">
          <FormationImage
            className="detail-image"
            src={formation.image}
            alt={`Illustration de la formation ${formation.titre}`}
            symbole={symboleCategorie(formation.categorie)}
          />
          <div className="detail-price">
            <span>Tarif de la formation</span>
            <strong>{libellePrix(formation)}</strong>
            <span>
              {source === "api"
                ? "Le tarif exact est indiqué pour chaque session."
                : "Tarif indicatif de démonstration"}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-section">
            <span className="eyebrow">À PROPOS</span>
            <h2>Présentation de la formation</h2>
            <p>{formation.details}</p>
          </section>

          <section className="detail-section sessions-section">
            <span className="eyebrow">CALENDRIER</span>
            <h2>Sessions de formation</h2>
            <p className="section-description">
              {formation.sessions.length > 0
                ? "Consultez les informations de chaque session et sélectionnez celle qui vous intéresse."
                : "Aucune session n'est ouverte pour le moment. Contactez-nous pour être informé(e) de la prochaine session."}
            </p>

            {formation.sessions.map((session) => (
              <article className="session-card" key={session.id}>
                <div className="session-heading">
                  <div>
                    <span className="session-label">SESSION DE FORMATION</span>
                    <h3>{session.titre}</h3>
                  </div>
                  <span className="session-status">Places limitées</span>
                </div>

                <div className="session-information">
                  <div className="session-info-item">
                    <span className="info-icon">◷</span>
                    <div>
                      <span>Période / Dates</span>
                      <strong>{session.dates}</strong>
                      {session.duree && <small>{session.duree}</small>}
                    </div>
                  </div>

                  <div className="session-info-item">
                    <span className="info-icon">⌖</span>
                    <div>
                      <span>Lieu</span>
                      <strong>{session.lieu}</strong>
                    </div>
                  </div>

                  {session.formateur && (
                    <div className="session-info-item">
                      <span className="info-icon">◉</span>
                      <div>
                        <span>Formateur</span>
                        <strong>{session.formateur}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="session-footer">
                  <span>
                    {session.placeTotal
                      ? `${session.placeTotal} places`
                      : "Places limitées"}{" "}
                    ·{" "}
                    {session.prix !== null
                      ? formatPrix(session.prix)
                      : "Tarif sur demande"}
                  </span>
                  <button
                    className="primary-button"
                    onClick={() => demanderInscription(session)}
                  >
                    S'inscrire à cette session
                  </button>
                </div>

              </article>
            ))}
          </section>
        </div>

        <aside className="detail-sidebar">
          <h3>En résumé</h3>
          <div className="sidebar-row">
            <span>Formation</span>
            <strong>{formation.titre}</strong>
          </div>
          {formation.duree && (
            <div className="sidebar-row">
              <span>Durée</span>
              <strong>{formation.duree}</strong>
            </div>
          )}
          {formation.modalite && (
            <div className="sidebar-row">
              <span>Modalité</span>
              <strong>{formation.modalite}</strong>
            </div>
          )}
          <div className="sidebar-row">
            <span>Sessions proposées</span>
            <strong>{formation.sessions.length}</strong>
          </div>
          <div className="sidebar-price">
            <span>Tarif affiché</span>
            <strong>{libellePrix(formation)}</strong>
          </div>
          <p>
            Choisissez une session puis confirmez votre inscription. Le
            paiement se fait ensuite sous 72 h.
          </p>
        </aside>
      </div>
    </section>
  );
}
