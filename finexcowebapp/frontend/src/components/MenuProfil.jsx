import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { lireMesInscriptions, statutInscription } from "../api/mesInscriptions";
import { useAuth } from "../context/AuthContext";
import { useFormations } from "../context/FormationsContext";

/* Petit buste dans un cercle (icône de profil) */
function IconeProfil() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="currentColor" />
    </svg>
  );
}

/* « Bonjour, Prénom » + icône de profil.
   Au clic : un panneau avec les informations du compte et les formations. */
export default function MenuProfil() {
  const { utilisateur, deconnexion } = useAuth();
  const { formations } = useFormations();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [ouvert, setOuvert] = useState(false);
  const racine = useRef(null);

  // Le panneau se ferme quand on change de page
  useEffect(() => {
    setOuvert(false);
  }, [pathname]);

  // ... et quand on clique ailleurs ou qu'on appuie sur Échap
  useEffect(() => {
    if (!ouvert) return undefined;

    const clicAilleurs = (event) => {
      if (racine.current && !racine.current.contains(event.target)) setOuvert(false);
    };
    const touche = (event) => {
      if (event.key === "Escape") setOuvert(false);
    };

    document.addEventListener("mousedown", clicAilleurs);
    document.addEventListener("keydown", touche);
    return () => {
      document.removeEventListener("mousedown", clicAilleurs);
      document.removeEventListener("keydown", touche);
    };
  }, [ouvert]);

  function seDeconnecter() {
    setOuvert(false);
    deconnexion();
    navigate("/");
  }

  // Les formations de la personne (relues à chaque ouverture du panneau)
  const lignes = ouvert
    ? lireMesInscriptions(utilisateur.id)
        .map((inscription) => {
          const formation = formations.find(
            (item) => String(item.id) === inscription.formationId
          );
          const session = formation?.sessions.find(
            (item) => String(item.id) === inscription.sessionId
          );
          return formation && session ? { inscription, formation, session } : null;
        })
        .filter(Boolean)
    : [];

  return (
    <div className="profil" ref={racine}>
      <span className="header-user">
        Bonjour, <strong>{utilisateur.prenoms}</strong>
      </span>

      <button
        type="button"
        className="profil-bouton"
        onClick={() => setOuvert((valeur) => !valeur)}
        aria-expanded={ouvert}
        aria-haspopup="true"
        aria-label="Mon profil"
        title="Mon profil"
      >
        <IconeProfil />
      </button>

      {ouvert && (
        <div className="profil-panneau" role="dialog" aria-label="Mon profil">
          <div className="profil-entete">
            <span className="profil-avatar">
              <IconeProfil />
            </span>
            <div>
              <strong>
                {utilisateur.nom} {utilisateur.prenoms}
              </strong>
              <span>{utilisateur.email}</span>
              {utilisateur.telephone && <span>{utilisateur.telephone}</span>}
            </div>
          </div>

          <div className="profil-section">
            <h3>Mes formations</h3>

            {lignes.length === 0 ? (
              <div className="profil-vide">
                <p>Vous n'êtes inscrit(e) à aucune formation pour l'instant.</p>
                <Link className="primary-button" to="/formations">
                  Voir les formations
                </Link>
              </div>
            ) : (
              <ul className="profil-liste">
                {lignes.map(({ inscription, formation, session }) => {
                  const statut = statutInscription(inscription);
                  return (
                    <li key={inscription.id}>
                      <Link className="profil-formation" to={`/formations/${formation.id}`}>
                        {formation.titre}
                      </Link>
                      <span className="profil-session">{session.dates}</span>
                      <div className="profil-statut-ligne">
                        <span className={`profil-statut statut-${statut.code}`}>
                          {statut.libelle}
                        </span>
                        {statut.paiementPossible && (
                          <Link className="profil-payer" to={`/paiement/${inscription.id}`}>
                            Payer
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="profil-note">
              Seules les inscriptions faites sur cet appareil sont listées. Le
              suivi complet (paiement validé ou refusé) arrive bientôt.
            </p>
          </div>

          <button type="button" className="profil-deconnexion" onClick={seDeconnecter}>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
