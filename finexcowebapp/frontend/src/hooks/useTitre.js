import { useEffect } from "react";

/* Change le titre de l'onglet du navigateur selon la page. */
export default function useTitre(titre) {
  useEffect(() => {
    document.title = titre ? `${titre} | FINEXCO` : "FINEXCO";
  }, [titre]);
}
