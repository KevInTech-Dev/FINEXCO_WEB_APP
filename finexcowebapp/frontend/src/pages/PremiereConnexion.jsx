import { useState } from "react";
import { Navigate } from "react-router-dom";
import { analyserErreur } from "../api/auth";
import AuthLayout from "../components/AuthLayout";
import Champ from "../components/Champ";
import { useAuth } from "../context/AuthContext";
import useTitre from "../hooks/useTitre";

export default function PremiereConnexion() {
  useTitre("Choisir mon mot de passe");
  const {
    utilisateur,
    chargement,
    changerMotDePasseInitial,
  } = useAuth();
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreurs, setErreurs] = useState({});
  const [erreurGenerale, setErreurGenerale] = useState("");
  const [envoi, setEnvoi] = useState(false);

  if (!chargement && !utilisateur) {
    return <Navigate to="/connexion" replace />;
  }
  if (utilisateur && !utilisateur.doit_changer_mot_de_passe) {
    return <Navigate to="/" replace />;
  }

  async function envoyer(event) {
    event.preventDefault();
    setErreurGenerale("");
    const problemes = {};
    if (motDePasse.length < 8) {
      problemes.motDePasse = "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (motDePasse !== confirmation) {
      problemes.confirmation = "Les mots de passe ne correspondent pas.";
    }
    setErreurs(problemes);
    if (Object.keys(problemes).length > 0) return;

    setEnvoi(true);
    try {
      await changerMotDePasseInitial(motDePasse);
    } catch (erreur) {
      const resultat = analyserErreur(erreur);
      setErreurGenerale(
        resultat.general ||
          resultat.champs.nouveau_mot_de_passe ||
          "Le mot de passe n’a pas pu être modifié. Réessayez."
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="ESPACE FORMATEUR"
      titre="Votre compte,"
      accent="votre mot de passe."
      description="Avant d’accéder à votre espace, remplacez le mot de passe provisoire choisi par l’administration."
      points={[
        "Choisissez un mot de passe personnel et sécurisé",
        "Utilisez-le pour vos prochaines connexions",
      ]}
    >
      <span className="eyebrow">PREMIÈRE CONNEXION</span>
      <h1>Choisissez votre mot de passe</h1>
      <p className="auth-intro">
        Votre mot de passe provisoire ne sera plus valable après cette étape.
      </p>

      <form className="auth-form" onSubmit={envoyer} noValidate>
        {erreurGenerale && (
          <div className="form-alerte" role="alert">
            {erreurGenerale}
          </div>
        )}

        <Champ
          id="nouveauMotDePasse"
          label="Nouveau mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder="8 caractères minimum"
          value={motDePasse}
          onChange={(event) => setMotDePasse(event.target.value)}
          erreur={erreurs.motDePasse}
        />
        <Champ
          id="confirmationMotDePasse"
          label="Confirmer le nouveau mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder="Saisissez-le à nouveau"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          erreur={erreurs.confirmation}
        />

        <button className="primary-button" type="submit" disabled={envoi}>
          {envoi ? "Mise à jour…" : "Enregistrer mon mot de passe"}
        </button>
      </form>
    </AuthLayout>
  );
}
