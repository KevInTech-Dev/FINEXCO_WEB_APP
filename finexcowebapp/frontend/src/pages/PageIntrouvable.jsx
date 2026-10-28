import { Link } from "react-router-dom";
import useTitre from "../hooks/useTitre";

/* Affichée pour toute adresse qui n'existe pas. */
export default function PageIntrouvable() {
  useTitre("Page introuvable");

  return (
    <section className="detail-page">
      <div className="empty-state">
        <h3>Page introuvable</h3>
        <p>L'adresse demandée n'existe pas ou a été déplacée.</p>
        <Link className="primary-button" to="/">
          Retour à l'accueil
        </Link>
      </div>
    </section>
  );
}
