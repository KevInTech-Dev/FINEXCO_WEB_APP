import { Link } from "react-router-dom";
import { formatPrix, symboleCategorie } from "../api/formations";
import FormationImage from "./FormationImage";

/* Une carte du catalogue représente une session réelle et sa formation. */
export default function SessionCard({ session }) {
  return (
    <article className="formation-card">
      <div className="card-media">
        <FormationImage
          src={session.image}
          alt={"Illustration de la formation " + session.formationTitre}
          symbole={symboleCategorie(session.categorie)}
        />
        <span className="media-badge badge-category">{session.categorie}</span>
        {session.duree && (
          <span className="media-badge badge-duree">{session.duree}</span>
        )}
      </div>

      <div className="card-body">
        <h3>{session.formationTitre}</h3>
        <p className="card-description">
          {session.titre} · {session.dates}
        </p>

        <div className="card-meta">
          <span>
            <strong>Lieu</strong>
            {session.lieu}
          </span>
          <span>
            <strong>Tarif</strong>
            {session.prix !== null ? formatPrix(session.prix) : "Sur demande"}
          </span>
          {session.formateur && (
            <span>
              <strong>Formateur</strong>
              {session.formateur}
            </span>
          )}
        </div>

        <Link
          className="card-link"
          to={"/formations/" + session.formationId + "/sessions/" + session.id + "/inscription"}
        >
          S’inscrire à cette session
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
