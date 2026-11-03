import BandeauContact from "../components/BandeauContact";
import BandeauPage from "../components/BandeauPage";
import { A_PROPOS } from "../config/contenu";
import { INFOS } from "../config/infos";
import useTitre from "../hooks/useTitre";

export default function QuiSommesNous() {
  useTitre("Qui sommes-nous");

  return (
    <>
      <BandeauPage etiquette="Qui sommes-nous" titre="Qui sommes-nous ?" texte={A_PROPOS.accroche} />

      <section className="vt-section vt-deux-colonnes">
        <div>
          <span className="eyebrow">{A_PROPOS.mission.titre.toUpperCase()}</span>
          <h2 className="vt-titre">Expertise, conseil et transmission</h2>
          {A_PROPOS.mission.paragraphes.map((texte) => (
            <p className="vt-texte" key={texte}>
              {texte}
            </p>
          ))}
        </div>

        <aside className="vt-carte-identite">
          <span className="panel-label">FINEXCO EN BREF</span>
          <div className="panel-line" />
          <ul>
            {A_PROPOS.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="vt-slogan">{INFOS.slogan}</p>
        </aside>
      </section>

      <section className="vt-section vt-fond">
        <span className="eyebrow">NOS VALEURS</span>
        <h2 className="vt-titre">Ce qui guide notre travail</h2>
        <div className="vt-grille vt-grille-4">
          {A_PROPOS.valeurs.map((valeur, index) => (
            <article className="vt-carte" key={valeur.titre}>
              <span className="vt-numero">{String(index + 1).padStart(2, "0")}</span>
              <h3>{valeur.titre}</h3>
              <p>{valeur.texte}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="vt-section vt-localisation">
        <div>
          <span className="eyebrow">OÙ NOUS TROUVER</span>
          <h2 className="vt-titre">Au cœur de Lomé</h2>
          <p className="vt-texte">
            Venez nous rencontrer ou contactez-nous : nous répondons à toutes
            vos questions sur nos services et nos formations.
          </p>
        </div>
        <dl className="vt-coordonnees">
          <div>
            <dt>Adresse</dt>
            <dd>{INFOS.adresse}</dd>
          </div>
          <div>
            <dt>Téléphone / WhatsApp</dt>
            <dd>
              <a href={`tel:${INFOS.telephone.replace(/\s/g, "")}`}>{INFOS.telephone}</a>
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

      <BandeauContact
        titre="Travaillons ensemble"
        texte="Une question, un besoin d'accompagnement ou de formation ? Parlons-en."
      />
    </>
  );
}
