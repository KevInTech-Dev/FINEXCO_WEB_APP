import { Link } from "react-router-dom";
import SectionContact from "../components/SectionContact";
import { ETAPES, SERVICES } from "../config/contenu";
import useTitre from "../hooks/useTitre";

export default function NosServices() {
  useTitre("Nos services");

  return (
    <>
      <section className="presentation-bandeau">
        <nav className="presentation-fil" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Nos services</span>
        </nav>
        <h1>Nos services</h1>
        <p>
          Audit, direction financière et comptable, conseil et formation : une
          expertise complète pour vous accompagner.
        </p>
      </section>

      <section className="presentation-section">
        <span className="eyebrow">CE QUE NOUS FAISONS</span>
        <h2>Quatre domaines d'expertise</h2>
        <div className="presentation-grille services-grille">
          {SERVICES.map((service, index) => (
            <article className="presentation-carte service-carte" key={service.titre}>
              <span className="presentation-numero">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{service.titre}</h3>
              <p>{service.description}</p>
              <ul>
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {service.titre === "Formations" && (
                <Link className="presentation-lien" to="/formations">
                  Voir les formations <span aria-hidden="true">→</span>
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="presentation-section presentation-fond">
        <span className="eyebrow">NOTRE FAÇON DE TRAVAILLER</span>
        <h2>Simple, claire, efficace</h2>
        <ol className="presentation-etapes">
          {ETAPES.map((etape, index) => (
            <li key={etape.titre}>
              <span>{index + 1}</span>
              <h3>{etape.titre}</h3>
              <p>{etape.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <SectionContact />
    </>
  );
}
