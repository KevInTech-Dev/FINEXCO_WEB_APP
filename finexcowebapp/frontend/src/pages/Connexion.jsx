import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { analyserErreur } from "../api/auth";
import AuthLayout from "../components/AuthLayout";
import Champ from "../components/Champ";
import { useAuth } from "../context/AuthContext";
import useTitre from "../hooks/useTitre";
import { EMAIL_VALIDE } from "../utils/validation";

/* Page /connexion */
export default function Connexion() {
  useTitre("Connexion");
  const { utilisateur, connexion } = useAuth();
  const location = useLocation();

  // Page à retrouver après la connexion (ex. la fiche d'une formation)
  const destination = location.state?.from || "/";
  const information = location.state?.message || "";

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreurs, setErreurs] = useState({});
  const [erreurGenerale, setErreurGenerale] = useState("");
  const [envoi, setEnvoi] = useState(false);

  // Déjà connecté : inutile de rester ici.
  if (utilisateur) return <Navigate to={destination} replace />;

  function valider() {
    const problemes = {};
    if (!email.trim()) {
      problemes.email = "Saisissez votre adresse e-mail.";
    } else if (!EMAIL_VALIDE.test(email.trim())) {
      problemes.email = "Saisissez une adresse e-mail valide.";
    }
    if (!motDePasse) problemes.motDePasse = "Saisissez votre mot de passe.";
    return problemes;
  }

  async function envoyer(event) {
    event.preventDefault();
    setErreurGenerale("");

    const problemes = valider();
    setErreurs(problemes);
    if (Object.keys(problemes).length > 0) return;

    setEnvoi(true);
    try {
      // Si ça réussit, la page se redirige toute seule (voir plus haut).
      await connexion(email.trim().toLowerCase(), motDePasse);
    } catch (erreur) {
      const { champs, general } = analyserErreur(erreur);
      setErreurGenerale(general || Object.values(champs).join(" "));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <AuthLayout>
      <span className="eyebrow">CONNEXION</span>
      <h1>Content de vous revoir</h1>
      <p className="auth-intro">
        Connectez-vous pour vous inscrire aux sessions de formation.
      </p>

      {information && <div className="form-info">{information}</div>}

      <form className="auth-form" onSubmit={envoyer} noValidate>
        {erreurGenerale && (
          <div className="form-alerte" role="alert">
            {erreurGenerale}
          </div>
        )}

        <Champ
          id="email"
          label="Adresse e-mail"
          type="email"
          autoComplete="email"
          placeholder="exemple@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          erreur={erreurs.email}
        />

        <Champ
          id="motDePasse"
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          placeholder="Votre mot de passe"
          value={motDePasse}
          onChange={(event) => setMotDePasse(event.target.value)}
          erreur={erreurs.motDePasse}
        />

        <button className="primary-button" type="submit" disabled={envoi}>
          {envoi ? "Connexion en cours…" : "Se connecter"}
        </button>
      </form>

      <p className="auth-alt">
        Pas encore de compte ?{" "}
        <Link to="/inscription" state={location.state}>
          Créer un compte
        </Link>
      </p>
    </AuthLayout>
  );
}
