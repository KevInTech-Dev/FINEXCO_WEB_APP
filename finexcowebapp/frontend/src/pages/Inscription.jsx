import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { analyserErreur } from "../api/auth";
import AuthLayout from "../components/AuthLayout";
import Champ from "../components/Champ";
import { useAuth } from "../context/AuthContext";
import useTitre from "../hooks/useTitre";
import { EMAIL_VALIDE, telephoneValide } from "../utils/validation";

const VALEURS_VIDES = {
  nom: "",
  prenoms: "",
  email: "",
  telephone: "",
  motDePasse: "",
  confirmation: "",
};

// Le backend nomme le mot de passe "password" : on le rattache à notre champ.
const CHAMPS_BACKEND = {
  nom: "nom",
  prenoms: "prenoms",
  email: "email",
  telephone: "telephone",
  password: "motDePasse",
};

/* Page /inscription : création d'un compte apprenant. */
export default function Inscription() {
  useTitre("Créer un compte");
  const { utilisateur, inscription } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const destination = location.state?.from || "/";

  const [valeurs, setValeurs] = useState(VALEURS_VIDES);
  const [erreurs, setErreurs] = useState({});
  const [erreurGenerale, setErreurGenerale] = useState("");
  const [envoi, setEnvoi] = useState(false);

  if (utilisateur) return <Navigate to={destination} replace />;

  // Met à jour un champ et efface son message d'erreur.
  const changer = (champ) => (event) => {
    setValeurs((anciennes) => ({ ...anciennes, [champ]: event.target.value }));
    setErreurs((anciennes) => ({ ...anciennes, [champ]: undefined }));
  };

  function valider() {
    const problemes = {};
    const nom = valeurs.nom.trim();
    const prenoms = valeurs.prenoms.trim();

    if (!nom) problemes.nom = "Saisissez votre nom.";
    else if (nom.length > 150) problemes.nom = "Ce nom est trop long.";

    if (!prenoms) problemes.prenoms = "Saisissez vos prénoms.";
    else if (prenoms.length > 150) problemes.prenoms = "Ce texte est trop long.";

    if (!valeurs.email.trim()) {
      problemes.email = "Saisissez votre adresse e-mail.";
    } else if (!EMAIL_VALIDE.test(valeurs.email.trim())) {
      problemes.email = "Saisissez une adresse e-mail valide.";
    }

    if (!valeurs.telephone.trim()) {
      problemes.telephone = "Saisissez votre numéro de téléphone.";
    } else if (!telephoneValide(valeurs.telephone)) {
      problemes.telephone =
        "Numéro invalide (8 chiffres minimum, 20 caractères maximum).";
    }

    if (valeurs.motDePasse.length < 8) {
      problemes.motDePasse = "Le mot de passe doit contenir au moins 8 caractères.";
    } else if (/^\d+$/.test(valeurs.motDePasse)) {
      problemes.motDePasse = "Le mot de passe ne peut pas contenir que des chiffres.";
    }

    if (!valeurs.confirmation) {
      problemes.confirmation = "Confirmez votre mot de passe.";
    } else if (valeurs.confirmation !== valeurs.motDePasse) {
      problemes.confirmation = "Les deux mots de passe ne sont pas identiques.";
    }

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
      const { connecte } = await inscription({
        nom: valeurs.nom.trim(),
        prenoms: valeurs.prenoms.trim(),
        email: valeurs.email.trim().toLowerCase(),
        telephone: valeurs.telephone.trim(),
        password: valeurs.motDePasse,
      });

      // Compte créé mais connexion automatique impossible : page de connexion.
      if (!connecte) {
        navigate("/connexion", {
          replace: true,
          state: {
            from: destination,
            message: "Votre compte a été créé. Connectez-vous pour continuer.",
          },
        });
      }
      // Sinon la personne est connectée et cette page se redirige toute seule.
    } catch (erreur) {
      const { champs, general } = analyserErreur(erreur);
      const erreursServeur = {};
      for (const [cleBackend, message] of Object.entries(champs)) {
        erreursServeur[CHAMPS_BACKEND[cleBackend] ?? cleBackend] = message;
      }
      setErreurs(erreursServeur);
      setErreurGenerale(general);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <AuthLayout>
      <span className="eyebrow">NOUVEAU COMPTE</span>
      <h1>Créer un compte</h1>
      <p className="auth-intro">
        Quelques informations suffisent pour vous inscrire à nos sessions.
      </p>

      <form className="auth-form" onSubmit={envoyer} noValidate>
        {erreurGenerale && (
          <div className="form-alerte" role="alert">
            {erreurGenerale}
          </div>
        )}

        <div className="champ-ligne">
          <Champ
            id="nom"
            label="Nom"
            autoComplete="family-name"
            placeholder="Votre nom"
            value={valeurs.nom}
            onChange={changer("nom")}
            erreur={erreurs.nom}
          />
          <Champ
            id="prenoms"
            label="Prénoms"
            autoComplete="given-name"
            placeholder="Vos prénoms"
            value={valeurs.prenoms}
            onChange={changer("prenoms")}
            erreur={erreurs.prenoms}
          />
        </div>

        <Champ
          id="email"
          label="Adresse e-mail"
          type="email"
          autoComplete="email"
          placeholder="exemple@email.com"
          value={valeurs.email}
          onChange={changer("email")}
          erreur={erreurs.email}
        />

        <Champ
          id="telephone"
          label="Numéro de téléphone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+228 90 00 00 00"
          value={valeurs.telephone}
          onChange={changer("telephone")}
          erreur={erreurs.telephone}
        />

        <Champ
          id="motDePasse"
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder="8 caractères minimum"
          aide="8 caractères minimum, pas uniquement des chiffres."
          value={valeurs.motDePasse}
          onChange={changer("motDePasse")}
          erreur={erreurs.motDePasse}
        />

        <Champ
          id="confirmation"
          label="Confirmer le mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder="Saisissez-le à nouveau"
          value={valeurs.confirmation}
          onChange={changer("confirmation")}
          erreur={erreurs.confirmation}
        />

        <button className="primary-button" type="submit" disabled={envoi}>
          {envoi ? "Création du compte…" : "Créer mon compte"}
        </button>
      </form>

      <p className="auth-alt">
        Vous avez déjà un compte ?{" "}
        <Link to="/connexion" state={location.state}>
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
