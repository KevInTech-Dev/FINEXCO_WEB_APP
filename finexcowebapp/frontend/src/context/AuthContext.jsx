import { createContext, useContext, useEffect, useState } from "react";
import {
  ErreurApi,
  connexionApi,
  effacerJetons,
  inscriptionApi,
  lireJetons,
  profilApi,
  rafraichirApi,
  sauverJetons,
} from "../api/auth";

const AuthContext = createContext(null);

/* Garde en mémoire la personne connectée, pour tout le site. */
export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  // true tant qu'on vérifie une éventuelle connexion précédente
  const [chargement, setChargement] = useState(() =>
    Boolean(lireJetons()?.access)
  );

  /* Au chargement de la page : si la personne s'était connectée avant,
     on récupère son profil (et on renouvelle le jeton s'il a expiré). */
  useEffect(() => {
    let annule = false;

    async function restaurer() {
      const jetons = lireJetons();
      if (!jetons?.access) {
        setChargement(false);
        return;
      }

      try {
        const profil = await profilApi(jetons.access);
        if (!annule) setUtilisateur(profil);
      } catch (erreur) {
        if (erreur.statut === 401 && jetons.refresh) {
          try {
            const nouveau = await rafraichirApi(jetons.refresh);
            const jetonsMisAJour = { ...jetons, ...nouveau };
            sauverJetons(jetonsMisAJour);
            const profil = await profilApi(jetonsMisAJour.access);
            if (!annule) setUtilisateur(profil);
          } catch {
            effacerJetons();
          }
        } else if (erreur.statut === 401 || erreur.statut === 403) {
          effacerJetons();
        }
        // Serveur éteint : on garde les jetons, la personne se reconnectera plus tard.
      } finally {
        if (!annule) setChargement(false);
      }
    }

    restaurer();
    return () => {
      annule = true;
    };
  }, []);

  async function connexion(email, motDePasse) {
    const jetons = await connexionApi(email, motDePasse);
    sauverJetons(jetons);
    try {
      const profil = await profilApi(jetons.access);
      setUtilisateur(profil);
      return profil;
    } catch (erreur) {
      effacerJetons();
      throw erreur;
    }
  }

  /* Crée le compte puis connecte directement la personne.
     Renvoie { connecte: false } si le compte est créé mais la connexion échoue. */
  async function inscription(donnees) {
    await inscriptionApi(donnees);
    try {
      await connexion(donnees.email, donnees.password);
      return { connecte: true };
    } catch {
      return { connecte: false };
    }
  }

  function deconnexion() {
    effacerJetons();
    setUtilisateur(null);
  }

  /* Lance un appel qui demande d'être connecté. Si le jeton a expiré (401),
     on le renouvelle une fois puis on recommence. Si ça échoue encore,
     la personne est déconnectée. */
  async function appelAuthentifie(operation) {
    const jetons = lireJetons();
    if (!jetons?.access) {
      setUtilisateur(null);
      throw new ErreurApi(401, null);
    }

    try {
      return await operation(jetons.access);
    } catch (erreur) {
      if (erreur.statut !== 401 || !jetons.refresh) throw erreur;
      try {
        const nouveau = await rafraichirApi(jetons.refresh);
        const mis = { ...jetons, ...nouveau };
        sauverJetons(mis);
        return await operation(mis.access);
      } catch (erreur2) {
        if (erreur2.statut === 401) deconnexion();
        throw erreur2;
      }
    }
  }

  // Pour les prochaines étapes (inscription à une session, paiement)
  function jetonAcces() {
    return lireJetons()?.access ?? null;
  }

  return (
    <AuthContext.Provider
      value={{
        utilisateur,
        chargement,
        connexion,
        inscription,
        deconnexion,
        jetonAcces,
        appelAuthentifie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
