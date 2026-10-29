import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* Barre de navigation du haut, sur toutes les pages. */
export default function Header() {
  const { utilisateur, deconnexion, erreurAuthentification } = useAuth();
  const navigate = useNavigate();

  function seDeconnecter() {
    deconnexion();
    navigate("/");
  }

  return (
    <>
      <header className="site-header">
        <Link className="logo" to="/">
          <span className="logo-name">
            <span className="logo-f">F</span>INEXCO
          </span>
        </Link>

        <nav className="navigation">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/formations">Formations</NavLink>
          <Link to="/#contact">Contact</Link>
        </nav>

        <div className="header-actions">
          {utilisateur ? (
            <>
              {utilisateur.role === "ADMIN" && (
                <Link className="header-button" to="/admin">
                  Administration
                </Link>
              )}
              {utilisateur.role === "APPRENANT" && (
                <Link className="header-button" to="/profil">
                  Mon profil
                </Link>
              )}
              <button className="header-button" onClick={seDeconnecter}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link className="header-button" to="/connexion">
                Connexion
              </Link>
              <Link className="primary-button" to="/inscription">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </header>
      {erreurAuthentification && (
        <div className="auth-session-warning" role="status">
          {erreurAuthentification}
        </div>
      )}
    </>
  );
}
