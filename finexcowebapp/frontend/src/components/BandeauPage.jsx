import { Link } from "react-router-dom";

/* Grand titre en haut des pages "Qui sommes-nous" et "Nos services". */
export default function BandeauPage({ etiquette, titre, texte }) {
  return (
    <section className="vt-bandeau">
      <div className="vt-bandeau-contenu">
        <nav className="vt-fil" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{etiquette}</span>
        </nav>
        <h1>{titre}</h1>
        <p>{texte}</p>
      </div>
      <span className="vt-bandeau-marque" aria-hidden="true">
        F.
      </span>
    </section>
  );
}
