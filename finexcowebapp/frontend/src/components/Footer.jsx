import { useState } from "react";
import { Link } from "react-router-dom";
import { INFOS, LIEN_WHATSAPP } from "../config/infos";
import { useAuth } from "../context/AuthContext";
import { useFormations } from "../context/FormationsContext";
import IconeReseau from "./Icones";

/* Pied de page, sur toutes les pages. */
export default function Footer() {
  const { formations } = useFormations();
  const { utilisateur } = useAuth();
  const [emailNewsletter, setEmailNewsletter] = useState("");
  const [messageNewsletter, setMessageNewsletter] = useState("");

  const categories = [...new Set(formations.map((f) => f.categorie))];

  function sabonner(event) {
    event.preventDefault();
    setMessageNewsletter(
      "Mode démonstration : l'abonnement sera activé après la connexion au backend."
    );
    setEmailNewsletter("");
  }

  return (
    <footer className="site-footer">
      <div className="newsletter">
        <div>
          <span className="newsletter-tag">RESTEZ INFORMÉ(E)</span>
          <h3>Abonnez-vous à la newsletter FINEXCO</h3>
          <p>
            Soyez averti(e) par e-mail de chaque nouvelle session de formation
            et de nos actualités.
          </p>
        </div>

        <div>
          <form className="newsletter-form" onSubmit={sabonner}>
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              value={emailNewsletter}
              onChange={(event) => setEmailNewsletter(event.target.value)}
              aria-label="Votre adresse e-mail"
              required
            />
            <button className="primary-button" type="submit">
              S'abonner →
            </button>
          </form>
          <p className="newsletter-note">Zéro spam. Désabonnement en 1 clic.</p>
          {messageNewsletter && (
            <p className="newsletter-message" role="status">
              {messageNewsletter}
            </p>
          )}
        </div>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="footer-logo" to="/">
            <span className="logo-f">F</span>INEXCO
          </Link>
          <p>{INFOS.description}</p>
          <span className="footer-slogan">{INFOS.slogan}</span>

          <a
            className="primary-button footer-whatsapp"
            href={LIEN_WHATSAPP}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp : {INFOS.telephone}
          </a>

          <p className="footer-follow">SUIVEZ-NOUS :</p>
          <div className="social-links">
            {Object.entries(INFOS.reseaux).map(([nom, lien]) => (
              <a
                key={nom}
                href={lien}
                target="_blank"
                rel="noreferrer"
                aria-label={nom}
              >
                <IconeReseau nom={nom} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h4>Nos domaines</h4>
          <ul>
            {categories.map((item) => (
              <li key={item}>
                <Link to={`/formations?categorie=${encodeURIComponent(item)}`}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4>Navigation</h4>
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/formations">Nos formations</Link>
            </li>
            {!utilisateur && (
              <>
                <li>
                  <Link to="/connexion">Connexion</Link>
                </li>
                <li>
                  <Link to="/inscription">Créer un compte</Link>
                </li>
              </>
            )}
            <li>
              <Link to="/#contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Siège &amp; Contacts</h4>
          <div className="footer-contact-item">
            <span>ADRESSE</span>
            <p>{INFOS.adresse}</p>
          </div>
          <div className="footer-contact-item">
            <span>TÉL / WHATSAPP</span>
            <a href={`tel:${INFOS.telephone.replace(/\s/g, "")}`}>
              {INFOS.telephone}
            </a>
          </div>
          <div className="footer-contact-item">
            <span>E-MAIL</span>
            <a href={`mailto:${INFOS.email}`}>{INFOS.email}</a>
          </div>
          <div className="footer-contact-item">
            <span>HORAIRES</span>
            <p>{INFOS.horaires}</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} FINEXCO — Cabinet d'expertise comptable
        </p>
        <span>{INFOS.slogan}</span>
      </div>
    </footer>
  );
}
