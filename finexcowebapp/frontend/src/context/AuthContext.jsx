import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ErreurApi,
  changerMotDePasseInitialApi,
  connexionApi,
  effacerJetons,
  inscriptionApi,
  lireJetons,
  profilApi,
  rafraichirApi,
  sauverJetons,
} from "../api/auth";

const AuthContext = createContext(null);

function expirationJeton(jeton) {
  try {
    const charge = jeton.split(".")[1];
    const donnees = JSON.parse(
      atob(charge.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return typeof donnees.exp === "number" ? donnees.exp * 1000 : null;
  } catch {
    return null;
  }
}

/* Garde en mémoire la personne connectée, pour tout le site. */
export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [accessCourant, setJetonAcces] = useState(
    () => lireJetons()?.access ?? ""
  );
  const [erreurAuthentification, setErreurAuthentification] = useState("");
  const rafraichissementEnCours = useRef(null);
  // true tant qu'on vérifie une éventuelle connexion précédente
  const [chargement, setChargement] = useState(() =>
    Boolean(lireJetons()?.access)
  );

  const rafraichirSession = useCallback(async () => {
    if (rafraichissementEnCours.current) {
      return rafraichissementEnCours.current;
    }

    const jetons = lireJetons();
    if (!jetons?.refresh) throw new ErreurApi(401, null);

    const promesse = rafraichirApi(jetons.refresh)
      .then((nouveauxJetons) => {
        const jetonsActuels = lireJetons();
        if (!jetonsActuels?.refresh) throw new ErreurApi(401, null);
        const jetonsMisAJour = { ...jetonsActuels, ...nouveauxJetons };
        sauverJetons(jetonsMisAJour);
        setJetonAcces(jetonsMisAJour.access);
        setErreurAuthentification("");
        return jetonsMisAJour.access;
      })
      .finally(() => {
        rafraichissementEnCours.current = null;
      });

    rafraichissementEnCours.current = promesse;
    return promesse;
  }, []);

  const deconnexion = useCallback(() => {
    effacerJetons();
    setJetonAcces("");
    setUtilisateur(null);
    setErreurAuthentification("");
  }, []);

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
            const access = await rafraichirSession();
            const profil = await profilApi(access);
            if (!annule) setUtilisateur(profil);
          } catch (erreurRafraichissement) {
            if (
              erreurRafraichissement.statut === 401 ||
              erreurRafraichissement.statut === 403
            ) {
              deconnexion();
            } else if (!annule) {
              setErreurAuthentification(
                "La connexion n’a pas pu être vérifiée. Réessayez dans quelques instants."
              );
            }
          }
        } else if (erreur.statut === 401 || erreur.statut === 403) {
          deconnexion();
        } else if (!annule) {
          setErreurAuthentification(
            "Le serveur ne répond pas. Votre connexion sera vérifiée à nouveau lors du prochain accès."
          );
        }
      } finally {
        if (!annule) setChargement(false);
      }
    }

    restaurer();
    return () => {
      annule = true;
    };
  }, [deconnexion, rafraichirSession]);

  useEffect(() => {
    if (!accessCourant) return undefined;
    const expiration = expirationJeton(accessCourant);
    if (!expiration) return undefined;

    const delai = Math.max(0, expiration - Date.now() - 60_000);
    let minuterie;
    async function tenterRafraichissement() {
      try {
        await rafraichirSession();
      } catch (erreur) {
        if (erreur.statut === 401 || erreur.statut === 403) {
          deconnexion();
        } else {
          setErreurAuthentification(
            "La connexion n’a pas pu être renouvelée. Nouvelle tentative dans une minute."
          );
          minuterie = setTimeout(tenterRafraichissement, 60_000);
        }
      }
    }

    minuterie = setTimeout(tenterRafraichissement, delai);

    return () => clearTimeout(minuterie);
  }, [accessCourant, deconnexion, rafraichirSession]);

  async function connexion(email, motDePasse) {
    const jetons = await connexionApi(email, motDePasse);
    sauverJetons(jetons);
    setJetonAcces(jetons.access);
    setErreurAuthentification("");
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

  /* Lance un appel qui demande d'être connecté. Si le jeton a expiré (401),
     on le renouvelle une fois puis on recommence. Si ça échoue encore,
     la personne est déconnectée. */
  const appelAuthentifie = useCallback(async (operation) => {
    const jetons = lireJetons();
    if (!jetons?.access) {
      setUtilisateur(null);
      throw new ErreurApi(401, null);
    }

    let access = jetons.access;
    const expiration = expirationJeton(access);
    if (expiration && expiration <= Date.now() + 60_000) {
      try {
        access = await rafraichirSession();
      } catch (erreur) {
        if (erreur.statut === 401 || erreur.statut === 403) deconnexion();
        else {
          setErreurAuthentification(
            "La connexion n’a pas pu être renouvelée. Réessayez dans quelques instants."
          );
        }
        throw erreur;
      }
    }

    try {
      const resultat = await operation(access);
      setErreurAuthentification("");
      return resultat;
    } catch (erreur) {
      if (erreur.statut !== 401 || !jetons.refresh) throw erreur;
      try {
        const access = await rafraichirSession();
        const resultat = await operation(access);
        setErreurAuthentification("");
        return resultat;
      } catch (erreur2) {
        if (erreur2.statut === 401 || erreur2.statut === 403) deconnexion();
        else {
          setErreurAuthentification(
            "Le renouvellement de la connexion a échoué. Réessayez dans quelques instants."
          );
        }
        throw erreur2;
      }
    }
  }, [deconnexion, rafraichirSession]);

  async function changerMotDePasseInitial(nouveauMotDePasse) {
    const profil = await appelAuthentifie((jeton) =>
      changerMotDePasseInitialApi(jeton, nouveauMotDePasse)
    );
    setUtilisateur(profil);
    return profil;
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
        erreurAuthentification,
        connexion,
        changerMotDePasseInitial,
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
