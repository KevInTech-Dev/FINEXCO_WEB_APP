import { Link } from "react-router-dom";
import { A_PROPOS } from "../config/contenu";
import { DOMAINES } from "../config/infos";

/* Aperçu de la page "Qui sommes-nous" sur l'accueil. */
export default function TeasingAPropos() {
  return (
    <section className="vt-teasing">
      <div className="vt-teasing-visuel">
        <span className="panel-label">QUI SOMMES-NOUS</span>
        <div className="panel-line" />
        <h2>Expertise, conseil et formation.</h2>
        <span className="vt-teasing-marque" aria-hidden="true">
          F.
        </span>
      </div>

      <div className="vt-teasing-texte">
        <span className="eyebrow">À PROPOS DE FINEXCO</span>
        <h2 className="vt-titre">Un cabinet qui vous accompagne et vous forme</h2>
        <p className="vt-texte">{A_PROPOS.teasing}</p>
        <ul className="vt-puces">
          {DOMAINES.map((domaine) => (
            <li key={domaine}>{domaine}</li>
          ))}
        </ul>
        <div className="vt-teasing-actions">
          <Link className="primary-button" to="/qui-sommes-nous">
            En savoir plus <span aria-hidden="true">→</span>
          </Link>
          <Link className="vt-lien" to="/services">
            Découvrir nos services
          </Link>
        </div>
      </div>
    </section>
  );
}
