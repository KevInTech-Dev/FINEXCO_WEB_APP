import { Link } from "react-router-dom";
import { LIEN_WHATSAPP } from "../config/infos";

/* Bande rose d'appel à l'action, en bas des deux nouvelles pages. */
export default function BandeauContact({ titre, texte }) {
  return (
    <section className="vt-appel">
      <div>
        <h2>{titre}</h2>
        <p>{texte}</p>
      </div>
      <div className="vt-appel-boutons">
        <a className="vt-bouton-blanc" href={LIEN_WHATSAPP} target="_blank" rel="noreferrer">
          Nous écrire sur WhatsApp
        </a>
        <Link className="vt-bouton-contour" to="/formations">
          Voir les formations
        </Link>
      </div>
    </section>
  );
}
