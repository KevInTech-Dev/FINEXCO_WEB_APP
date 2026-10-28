import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { analyserErreur } from "../api/auth";
import { annulerInscriptionApi, mesInscriptionsApi } from "../api/inscriptions";
import { mesPaiementsApi } from "../api/paiements";
import { useAuth } from "../context/AuthContext";
import useTitre from "../hooks/useTitre";

const STATUTS_INSCRIPTION = {
  EN_ATTENTE_PAIEMENT: "En attente de paiement",
  PAIEMENT_REFUSE: "Paiement refusé",
  CONFIRMEE: "Confirmée",
  ANNULEE: "Annulée",
  EXPIREE: "Expirée",
};
const STATUTS_PAIEMENT = {
  A_VERIFIER: "En cours de vérification",
  VALIDE: "Validé",
  REFUSE: "Refusé",
};

const listeApi = (donnees) =>
  Array.isArray(donnees) ? donnees : (donnees?.results ?? []);

function dateFrancaise(valeur) {
  if (!valeur) return "Non renseignée";
  const date = new Date(valeur);
  return Number.isNaN(date.getTime())
    ? "Non renseignée"
    : date.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
}

function Decompte({ echeance, maintenant }) {
  const fin = new Date(echeance).getTime();
  const total = Math.max(0, Math.floor((fin - maintenant) / 1000));
  if (!Number.isFinite(fin) || total === 0) {
    return <strong className="profil-decompte expire">Délai expiré</strong>;
  }
  const jours = Math.floor(total / 86400);
  const heures = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secondes = total % 60;
  const deuxChiffres = (n) => String(n).padStart(2, "0");
  return (
    <strong className="profil-decompte">
      {jours} j {deuxChiffres(heures)} h {deuxChiffres(minutes)} min {deuxChiffres(secondes)} s
    </strong>
  );
}

export default function Profil() {
  useTitre("Mon profil");
  const { utilisateur, chargement: chargementAuth, appelAuthentifie } = useAuth();
  const [inscriptions, setInscriptions] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [annulationEnCours, setAnnulationEnCours] = useState("");
  const [maintenant, setMaintenant] = useState(Date.now());

  const chargerEspace = useCallback(async () => {
    setErreur("");
    try {
      const resultat = await appelAuthentifie((jeton) =>
        Promise.all([mesInscriptionsApi(jeton), mesPaiementsApi(jeton)])
      );
      setInscriptions(listeApi(resultat[0]));
      setPaiements(listeApi(resultat[1]));
    } catch (e) {
      const { general } = analyserErreur(e);
      setErreur(general || "Impossible de charger votre espace apprenant.");
    } finally {
      setChargement(false);
    }
  }, [appelAuthentifie]);

  useEffect(() => {
    if (!chargementAuth && utilisateur) chargerEspace();
  }, [chargementAuth, utilisateur, chargerEspace]);

  // Actualise les décomptes chaque seconde sans recharger le profil.
  useEffect(() => {
    const timer = window.setInterval(() => setMaintenant(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function annuler(inscriptionId) {
    if (!window.confirm("Voulez-vous vraiment annuler cette inscription ?")) return;
    setAnnulationEnCours(inscriptionId);
    setErreur("");
    setMessage("");
    try {
      await appelAuthentifie((jeton) =>
        annulerInscriptionApi(jeton, inscriptionId)
      );
      setMessage("Votre inscription a bien été annulée.");
      await chargerEspace();
    } catch (e) {
      const { general } = analyserErreur(e);
      setErreur(general || "L’annulation de cette inscription a échoué.");
    } finally {
      setAnnulationEnCours("");
    }
  }

  if (chargementAuth) {
    return <section className="profil-page"><div className="empty-state">Chargement du profil…</div></section>;
  }
  if (!utilisateur) {
    return <Navigate to="/connexion" replace state={{ from: "/profil" }} />;
  }
  if (utilisateur.role !== "APPRENANT") {
    return (
      <section className="profil-page">
        <div className="empty-state">
          <h3>Espace réservé aux apprenants</h3>
          <Link className="primary-button" to="/formations">Voir les sessions</Link>
        </div>
      </section>
    );
  }

  const paiementsParInscription = new Map();
  paiements.forEach((paiement) => {
    const id = paiement.inscription?.id;
    if (!id) return;
    const historique = paiementsParInscription.get(id) ?? [];
    historique.push(paiement);
    paiementsParInscription.set(id, historique);
  });

  return (
    <section className="profil-page">
      <header className="profil-entete">
        <div className="profil-identite">
          <span className="profil-avatar" aria-hidden="true">
            {(utilisateur.prenoms || utilisateur.nom || "A").charAt(0).toUpperCase()}
          </span>
          <div>
            <span className="eyebrow">ESPACE APPRENANT</span>
            <h1>Salut {utilisateur.prenoms}</h1>
            <p>Gérez vos informations, vos inscriptions et vos paiements.</p>
          </div>
        </div>
        <Link className="profil-action" to="/formations">Explorer les sessions <span aria-hidden="true">→</span></Link>
      </header>

      {erreur && <div className="form-alerte" role="alert">{erreur}</div>}
      {message && <div className="form-info" role="status">{message}</div>}

      <div className="profil-statistiques">
        <div><span>Mes inscriptions</span><strong>{inscriptions.length}</strong></div>
        <div><span>Paiements envoyés</span><strong>{paiements.length}</strong></div>
        <div><span>En attente de paiement</span><strong>{inscriptions.filter((item) => item.statut === "EN_ATTENTE_PAIEMENT").length}</strong></div>
      </div>

      <section className="profil-carte">
        <div className="profil-section-titre">
          <div><span className="eyebrow">MES INFORMATIONS</span><h2>Informations personnelles</h2></div>
        </div>
        <div className="profil-infos">
          <div><span>Nom</span><strong>{utilisateur.nom}</strong></div>
          <div><span>Prénoms</span><strong>{utilisateur.prenoms}</strong></div>
          <div><span>Adresse e-mail</span><strong>{utilisateur.email}</strong></div>
          <div><span>Téléphone</span><strong>{utilisateur.telephone || "Non renseigné"}</strong></div>
        </div>
      </section>

      <section className="profil-section">
        <div className="profil-section-titre">
          <div><span className="eyebrow">MON PARCOURS</span><h2>Mes inscriptions</h2></div>
          <span className="profil-compteur">{inscriptions.length}</span>
        </div>

        {chargement ? (
          <div className="empty-state" role="status"><h3>Chargement…</h3></div>
        ) : inscriptions.length === 0 ? (
          <div className="empty-state">
            <h3>Aucune inscription pour le moment</h3>
            <p>Les sessions auxquelles vous vous inscrirez apparaîtront ici.</p>
            <Link className="primary-button" to="/formations">Découvrir les sessions</Link>
          </div>
        ) : (
          <div className="profil-liste">
            {inscriptions.map((inscription) => {
              const session = inscription.session;
              const formation = session?.formation;
              const historique = paiementsParInscription.get(inscription.id) ?? [];
              const paiementActif = historique.some((p) =>
                ["A_VERIFIER", "VALIDE"].includes(p.statut)
              );
              // Une preuve déposée signifie que l’apprenant a déjà soumis son paiement.
              const preuveDejaDeposee = historique.some(
                (paiement) => Boolean(paiement.preuve_paiement)
              );
              const peutAnnuler =
                ["EN_ATTENTE_PAIEMENT", "PAIEMENT_REFUSE"].includes(inscription.statut) &&
                !paiementActif;

              return (
                <article className="profil-inscription" key={inscription.id}>
                  <div className="profil-inscription-entete">
                    <div>
                      <span className="eyebrow">SESSION</span>
                      <h3>{formation?.nom || "Formation"}</h3>
                      <p>{session?.date_debut ? dateFrancaise(session.date_debut) : ""}{session?.date_fin ? " — " + dateFrancaise(session.date_fin) : ""}</p>
                    </div>
                    <span className={"profil-statut statut-" + inscription.statut.toLowerCase()}>
                      {STATUTS_INSCRIPTION[inscription.statut] || inscription.statut}
                    </span>
                  </div>

                  <div className="profil-infos profil-infos-session">
                    <div><span>Lieu</span><strong>{session?.lieu || "Non renseigné"}</strong></div>
                    <div><span>Prix</span><strong>{session?.prix ? Number(session.prix).toLocaleString("fr-FR") + " FCFA" : "Non renseigné"}</strong></div>
                    <div><span>Inscription créée le</span><strong>{dateFrancaise(inscription.date_inscription)}</strong></div>
                  </div>

                  {inscription.statut === "EN_ATTENTE_PAIEMENT" &&
                    !preuveDejaDeposee &&
                    inscription.date_limite_paiement && (
                    <div className="profil-echeance">
                      <span>Échéance (Veuillez payer avant) : {dateFrancaise(inscription.date_limite_paiement)}</span>
                      <Decompte echeance={inscription.date_limite_paiement} maintenant={maintenant} />
                    </div>
                  )}

                  {historique.length > 0 && (
                    <div className="profil-paiements">
                      <h4>Suivi des paiements</h4>
                      {historique.map((paiement) => (
                        <div className="profil-paiement" key={paiement.id}>
                          <div>
                            <strong>{Number(paiement.montant).toLocaleString("fr-FR")} FCFA · {paiement.mode}</strong>
                            <span>{dateFrancaise(paiement.created_at)}</span>
                          </div>
                          <span className={"profil-statut statut-" + paiement.statut.toLowerCase()}>
                            {STATUTS_PAIEMENT[paiement.statut] || paiement.statut}
                          </span>
                          {paiement.preuve_paiement && (
                            <a href={paiement.preuve_paiement} target="_blank" rel="noreferrer">
                              Voir la preuve envoyée
                            </a>
                          )}
                          {paiement.motif_refus && <p className="profil-motif">Motif : {paiement.motif_refus}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {peutAnnuler && (
                    <button
                      className="profil-annuler"
                      type="button"
                      disabled={annulationEnCours === inscription.id}
                      onClick={() => annuler(inscription.id)}
                    >
                      {annulationEnCours === inscription.id ? "Annulation…" : "Annuler cette inscription"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
