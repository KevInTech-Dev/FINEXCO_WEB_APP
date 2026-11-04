import { Link } from "react-router-dom";
import { libellePrix, symboleCategorie } from "../api/formations";
import FormationImage from "./FormationImage";

/* Une carte du catalogue (accueil et page Formations). */
export default function FormationCard({ formation }) {
  return (
    <article className="formation-card">
      <div className="card-media">
        <FormationImage
          src={formation.image}
          alt={`Illustration de la formation ${formation.titre}`}
          symbole={symboleCategorie(formation.categorie)}
        />
        <span className="media-badge badge-category">
          {formation.categorie}
        </span>
        {formation.modalite && (
          <span className="media-badge badge-mode">{formation.modalite}</span>
        )}
        {formation.duree && (
          <span className="media-badge badge-duree">{formation.duree}</span>
        )}
      </div>

      <div className="card-body">
        <h3>{formation.titre}</h3>
        <p className="card-description">{formation.description}</p>

        <div className="card-meta">
          <span>
            <strong>Tarif</strong>
            {libellePrix(formation)}
          </span>
          
        </div>

        <Link className="card-link" to={`/formations/${formation.id}`}>
          Voir la fiche et les sessions
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
