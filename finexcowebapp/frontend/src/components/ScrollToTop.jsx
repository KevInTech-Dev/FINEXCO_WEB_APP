import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* À chaque changement de page : retour en haut, ou défilement jusqu'à
   la section demandée (par exemple /#contact). */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const minuteur = setTimeout(() => {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth" });
      }, 60);
      return () => clearTimeout(minuteur);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}
