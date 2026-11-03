import { Link } from "react-router-dom";
import BandeauContact from "../components/BandeauContact";
import BandeauPage from "../components/BandeauPage";
import { ETAPES, SERVICES } from "../config/contenu";
import useTitre from "../hooks/useTitre";

export default function NosServices() {
  useTitre("Nos services");

  return (
    <>
      <BandeauPage
        etiquette="Nos services"
        titre="Nos services"
        texte="Audit, direction financière et comptable, conseil et formation : une expertise complète pour vous accompagner."
      />

      <section className="vt-section">
        <span className="eyebrow">CE QUE NOUS FAISONS</span>
        <h2 className="vt-titre">Quatre domaines d'expertise</h2>
        <div className="vt-grille vt-grille-2">
          {SERVICES.map((service) => (
            <article className="vt-carte vt-service" key={service.titre}>
              <span className="vt-numero">{service.numero}</span>
              <h3>{service.titre}</h3>
              <p>{service.description}</p>
              <ul>
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {service.lien && (
                <Link className="vt-lien" to={service.lien.vers}>
                  {service.lien.texte} <span aria-hidden="true">→</span>
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="vt-section vt-fond">
        <span className="eyebrow">NOTRE FAÇON DE TRAVAILLER</span>
        <h2 className="vt-titre">Simple, claire, efficace</h2>
        <ol className="vt-etapes">
          {ETAPES.map((etape, index) => (
            <li key={etape.titre}>
              <span className="vt-etape-numero">{index + 1}</span>
              <h3>{etape.titre}</h3>
              <p>{etape.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <BandeauContact
        titre="Un projet ? Un besoin ?"
        texte="Dites-nous ce dont vous avez besoin, nous vous répondons rapidement."
      />
    </>
  );
}
