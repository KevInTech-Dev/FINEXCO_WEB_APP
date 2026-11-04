import { Link } from "react-router-dom";
import SectionContact from "../components/SectionContact";
import { A_PROPOS } from "../config/contenu";
import { INFOS } from "../config/infos";
import useTitre from "../hooks/useTitre";

export default function QuiSommesNous() {
  useTitre("Qui sommes-nous");

  return (
    <>
      <section className="presentation-bandeau">
        <nav className="presentation-fil" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Qui sommes-nous</span>
        </nav>
        <h1>Qui sommes-nous ?</h1>
        <p>{A_PROPOS.accroche}</p>
      </section>

      <section className="presentation-section presentation-colonnes">
        <div>
          <span className="eyebrow">NOTRE MISSION</span>
          <h2>Expertise, conseil et transmission</h2>
          {A_PROPOS.mission.paragraphes.map((texte) => (
            <p className="presentation-texte" key={texte}>
              {texte}
            </p>
          ))}
        </div>

        <aside className="presentation-identite">
          <span className="panel-label">FINEXCO EN BREF</span>
          <div className="panel-line" />
          <ul>
            {A_PROPOS.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p>{INFOS.slogan}</p>
        </aside>
      </section>

      <section className="presentation-section presentation-fond">
        <span className="eyebrow">NOS VALEURS</span>
        <h2>Ce qui guide notre travail</h2>
        <div className="presentation-grille valeurs-grille">
          {A_PROPOS.valeurs.map((valeur, index) => (
            <article className="presentation-carte" key={valeur.titre}>
              <span className="presentation-numero">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{valeur.titre}</h3>
              <p>{valeur.texte}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="presentation-section presentation-colonnes">
        <div>
          <span className="eyebrow">OÙ NOUS TROUVER</span>
          <h2>Au cœur de Lomé</h2>
          <p className="presentation-texte">
            Venez nous rencontrer ou contactez-nous : nous répondons à vos
            questions sur nos services et nos formations.
          </p>
        </div>
        <dl className="presentation-coordonnees">
          <div>
            <dt>Adresse</dt>
            <dd>{INFOS.adresse}</dd>
          </div>
          <div>
            <dt>Téléphone</dt>
            <dd>
              <a href={`tel:${INFOS.telephone.replace(/\s/g, "")}`}>
                {INFOS.telephone}
              </a>
            </dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>
              <a href={`mailto:${INFOS.email}`}>{INFOS.email}</a>
            </dd>
          </div>
        </dl>
      </section>

      <SectionContact />
    </>
  );
}
