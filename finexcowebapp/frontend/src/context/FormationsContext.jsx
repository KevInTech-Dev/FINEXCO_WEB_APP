import { createContext, useContext, useEffect, useState } from "react";
import { chargerFormations } from "../api/formations";

const FormationsContext = createContext(null);

/* Charge les formations une seule fois, et les partage avec toutes les pages
   (accueil, catalogue, fiche). */
export function FormationsProvider({ children }) {
  const [etat, setEtat] = useState({
    formations: [],
    chargement: true,
    source: "api",
    erreur: null,
  });

  useEffect(() => {
    let annule = false;
    const controleur = new AbortController();
    const delai = setTimeout(() => controleur.abort(), 6000);

    chargerFormations(controleur.signal).then((resultat) => {
      clearTimeout(delai);
      if (annule) return;

      setEtat({
        formations: resultat.formations,
        source: resultat.source,
        erreur: resultat.erreur,
        chargement: false,
      });

      if (resultat.source === "api") {
        console.info(
          `[FINEXCO] ${resultat.formations.length} formation(s) chargée(s) depuis le backend.`
        );
      } else {
        console.error(
          "[FINEXCO] Impossible de charger les formations depuis le backend.",
          resultat.erreur
        );
      }
    });

    return () => {
      annule = true;
      clearTimeout(delai);
      controleur.abort();
    };
  }, []);

  return (
    <FormationsContext.Provider value={etat}>
      {children}
    </FormationsContext.Provider>
  );
}

export function useFormations() {
  return useContext(FormationsContext);
}
