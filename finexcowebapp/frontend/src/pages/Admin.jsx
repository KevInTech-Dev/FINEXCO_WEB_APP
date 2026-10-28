import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { analyserErreur } from "../api/auth";
import {
  chargerCategoriesApi,
  chargerFormationsAdminApi,
  chargerFormateursApi,
  chargerInscriptionsAdminApi,
  chargerPaiementsAverifierApi,
  chargerSessionsAdminApi,
  chargerTousPaiementsApi,
  creerFormationAdminApi,
  creerSessionAdminApi,
  modifierFormationAdminApi,
  refuserPaiementApi,
  validerPaiementApi,
} from "../api/admin";
import { useAuth } from "../context/AuthContext";
import useTitre from "../hooks/useTitre";

const FORMULAIRE_FORMATION_VIDE = {
  nom: "",
  description: "",
  categorie: "",
  etat_publication: "PUBLIE",
};

const FORMULAIRE_SESSION_VIDE = {
  formation: "",
  formateur: "",
  date_debut: "",
  date_fin: "",
  lieu: "",
  prix: "",
  place_total: "",
};

function messageErreur(erreur) {
  const resultat = analyserErreur(erreur);
  return (
    resultat.general ||
    Object.values(resultat.champs).filter(Boolean).join(" ") ||
    "La demande n’a pas abouti. Réessayez."
  );
}

function montant(value) {
  const nombre = Number(value);
  return Number.isFinite(nombre)
    ? `${nombre.toLocaleString("fr-FR")} FCFA`
    : "—";
}

function dateFr(value) {
  if (!value) return "—";
  const texte = String(value);
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(texte) ? `${texte}T00:00:00` : texte
  );
  return Number.isNaN(date.getTime())
    ? texte
    : date.toLocaleDateString("fr-FR");
}

function nomApprenant(paiement) {
  const apprenant = paiement.inscription?.apprenant;
  return apprenant
    ? `${apprenant.prenoms || ""} ${apprenant.nom || ""}`.trim()
    : "Apprenant";
}

function nomFormation(paiement) {
  return paiement.inscription?.session?.formation?.nom || "Formation";
}

function EtatBadge({ valeur }) {
  const textes = {
    PUBLIE: "Publié",
    ARCHIVE: "Archivé",
    OUVERTE: "Ouverte",
    FERMEE: "Fermée",
    TERMINEE: "Terminée",
    EN_ATTENTE_PAIEMENT: "En attente de paiement",
    CONFIRMEE: "Confirmée",
    PAIEMENT_REFUSE: "Paiement refusé",
    ANNULEE: "Annulée",
    EXPIREE: "Expirée",
    A_VERIFIER: "À vérifier",
    VALIDE: "Validé",
    REFUSE: "Refusé",
  };
  return (
    <span className={`admin-badge admin-badge-${valeur?.toLowerCase() || "neutre"}`}>
      {textes[valeur] || valeur || "—"}
    </span>
  );
}

export default function Admin() {
  useTitre("Administration");
  const { utilisateur, chargement: chargementAuth, appelAuthentifie } = useAuth();
  const [section, setSection] = useState("accueil");
  const [formations, setFormations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paiementsEnAttente, setPaiementsEnAttente] = useState([]);
  const [tousLesPaiements, setTousLesPaiements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [filtreFormation, setFiltreFormation] = useState("");
  const [filtreInscription, setFiltreInscription] = useState("TOUTES");
  const [formationEdition, setFormationEdition] = useState(null);
  const [formulaireFormation, setFormulaireFormation] = useState(
    FORMULAIRE_FORMATION_VIDE
  );
  const [formulaireSession, setFormulaireSession] = useState(
    FORMULAIRE_SESSION_VIDE
  );
  const [paiementsOnglet, setPaiementsOnglet] = useState("attente");
  const [paiementRefus, setPaiementRefus] = useState("");
  const [motifRefus, setMotifRefus] = useState("");
  const [operation, setOperation] = useState("");

  const chargerDonnees = useCallback(async () => {
    if (!utilisateur || utilisateur.role !== "ADMIN") return;
    try {
      const [
        listeFormations,
        listeSessions,
        listeInscriptions,
        listeCategories,
        listeFormateurs,
        paiementsAttente,
        paiements,
      ] =
        await Promise.all([
          appelAuthentifie(chargerFormationsAdminApi),
          appelAuthentifie(chargerSessionsAdminApi),
          appelAuthentifie(chargerInscriptionsAdminApi),
          chargerCategoriesApi(),
          appelAuthentifie(chargerFormateursApi),
          appelAuthentifie(chargerPaiementsAverifierApi),
          appelAuthentifie(chargerTousPaiementsApi),
        ]);
      setFormations(listeFormations);
      setSessions(listeSessions);
      setInscriptions(listeInscriptions);
      setCategories(listeCategories);
      setFormateurs(listeFormateurs);
      setPaiementsEnAttente(paiementsAttente);
      setTousLesPaiements(paiements);
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setChargement(false);
    }
  }, [appelAuthentifie, utilisateur]);

  useEffect(() => {
    if (!chargementAuth && utilisateur?.role === "ADMIN") {
      Promise.resolve().then(chargerDonnees);
    }
  }, [chargementAuth, utilisateur?.role, chargerDonnees]);

  const formationsFiltrees = useMemo(() => {
    const recherche = filtreFormation.trim().toLocaleLowerCase("fr");
    if (!recherche) return formations;
    return formations.filter((formation) =>
      `${formation.nom} ${formation.categorie_nom || ""}`
        .toLocaleLowerCase("fr")
        .includes(recherche)
    );
  }, [filtreFormation, formations]);

  async function enregistrerFormation(event) {
    event.preventDefault();
    setErreur("");
    setMessage("");
    setOperation("formation");
    try {
      const donnees = {
        ...formulaireFormation,
        nom: formulaireFormation.nom.trim(),
        description: formulaireFormation.description.trim(),
      };
      await appelAuthentifie((jeton) =>
        formationEdition
          ? modifierFormationAdminApi(jeton, formationEdition.id, donnees)
          : creerFormationAdminApi(jeton, donnees)
      );
      setMessage(formationEdition ? "Formation mise à jour." : "Formation créée.");
      setFormationEdition(null);
      setFormulaireFormation(FORMULAIRE_FORMATION_VIDE);
      setChargement(true);
      await chargerDonnees();
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setOperation("");
    }
  }

  function modifierFormation(formation) {
    setFormationEdition(formation);
    setFormulaireFormation({
      nom: formation.nom || "",
      description: formation.description || "",
      categorie: formation.categorie || "",
      etat_publication: formation.etat_publication || "PUBLIE",
    });
    setMessage("");
    setErreur("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function annulerEditionFormation() {
    setFormationEdition(null);
    setFormulaireFormation(FORMULAIRE_FORMATION_VIDE);
  }

  async function enregistrerSession(event) {
    event.preventDefault();
    setErreur("");
    setMessage("");
    setOperation("session");
    try {
      await appelAuthentifie((jeton) =>
        creerSessionAdminApi(jeton, {
          ...formulaireSession,
          prix: Number(formulaireSession.prix),
          place_total: Number(formulaireSession.place_total),
        })
      );
      setMessage("La session a été créée.");
      setFormulaireSession(FORMULAIRE_SESSION_VIDE);
      setChargement(true);
      await chargerDonnees();
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setOperation("");
    }
  }

  async function traiterPaiement(paiementId, decision) {
    setErreur("");
    setMessage("");
    setOperation(paiementId);
    try {
      await appelAuthentifie((jeton) =>
        decision === "valider"
          ? validerPaiementApi(jeton, paiementId)
          : refuserPaiementApi(jeton, paiementId, motifRefus.trim())
      );
      setPaiementRefus("");
      setMotifRefus("");
      setMessage(
        decision === "valider"
          ? "Paiement validé; l’inscription est confirmée."
          : "Paiement refusé."
      );
      setChargement(true);
      await chargerDonnees();
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setOperation("");
    }
  }

  if (chargementAuth) {
    return (
      <section className="admin-page">
        <div className="empty-state" role="status">Vérification de la connexion…</div>
      </section>
    );
  }

  if (!utilisateur) {
    return (
      <Navigate
        to="/connexion"
        replace
        state={{ from: "/admin", message: "Connectez-vous avec un compte administrateur." }}
      />
    );
  }

  if (utilisateur.role !== "ADMIN") {
    return (
      <section className="admin-page">
        <div className="empty-state">
          <h3>Accès réservé à l’administration</h3>
          <p>Ce compte n’a pas les droits nécessaires pour consulter cet espace.</p>
          <Link className="primary-button" to="/">Retour à l’accueil</Link>
        </div>
      </section>
    );
  }

  const paiementsAffiches =
    paiementsOnglet === "attente" ? paiementsEnAttente : tousLesPaiements;
  const paiementsValides = tousLesPaiements.filter(
    (paiement) => paiement.statut === "VALIDE"
  ).length;
  const inscriptionsFiltrees =
    filtreInscription === "TOUTES"
      ? inscriptions
      : inscriptions.filter((inscription) => inscription.statut === filtreInscription);

  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-entete">
          <span className="eyebrow">FINEXCO</span>
          <h1>Administration</h1>
          <p>Gestion de vos formations</p>
        </div>
        <nav className="admin-nav" aria-label="Navigation administration">
          <button
            className={section === "accueil" ? "actif" : ""}
            onClick={() => setSection("accueil")}
          >
            <span aria-hidden="true">⌂</span> Vue d’ensemble
          </button>
          <button
            className={section === "formations" ? "actif" : ""}
            onClick={() => setSection("formations")}
          >
            <span aria-hidden="true">▤</span> Formations
            <span className="admin-nav-compteur">{formations.length}</span>
          </button>
          <button
            className={section === "sessions" ? "actif" : ""}
            onClick={() => setSection("sessions")}
          >
            <span aria-hidden="true">▦</span> Sessions
            <span className="admin-nav-compteur">{sessions.length}</span>
          </button>
          <button
            className={section === "creer-session" ? "actif" : ""}
            onClick={() => setSection("creer-session")}
          >
            <span aria-hidden="true">＋</span> Créer une session
          </button>
          <button
            className={section === "inscriptions" ? "actif" : ""}
            onClick={() => setSection("inscriptions")}
          >
            <span aria-hidden="true">▧</span> Inscriptions
            <span className="admin-nav-compteur">{inscriptions.length}</span>
          </button>
          <button
            className={section === "paiements" ? "actif" : ""}
            onClick={() => setSection("paiements")}
          >
            <span aria-hidden="true">▣</span> Paiements
            {paiementsEnAttente.length > 0 && (
              <span className="admin-nav-compteur admin-nav-alerte">
                {paiementsEnAttente.length}
              </span>
            )}
          </button>
        </nav>
        <Link className="admin-retour-site" to="/">
          ← Retour au site
        </Link>
      </aside>

      <div className="admin-contenu">
        <header className="admin-entete">
          <div>
            <span className="eyebrow">ESPACE ADMINISTRATEUR</span>
            <h2>
              {section === "accueil" && "Vue d’ensemble"}
              {section === "formations" && "Gestion des formations"}
              {section === "sessions" && "Liste des sessions"}
              {section === "creer-session" && "Créer une session"}
              {section === "inscriptions" && "Liste des inscriptions"}
              {section === "paiements" && "Vérification des paiements"}
            </h2>
          </div>
          <div className="admin-identite">
            <span className="admin-avatar" aria-hidden="true">
              {(utilisateur.prenoms || utilisateur.nom || "A").charAt(0).toUpperCase()}
            </span>
            <span>
              {utilisateur.prenoms} {utilisateur.nom}
              <small>Administrateur</small>
            </span>
          </div>
        </header>

        {erreur && <div className="form-alerte admin-alerte" role="alert">{erreur}</div>}
        {message && <div className="form-info admin-info" role="status">{message}</div>}

        {chargement ? (
          <div className="empty-state" role="status">Chargement de l’espace administrateur…</div>
        ) : (
          <>
            {section === "accueil" && (
              <div className="admin-section">
                <div className="admin-bienvenue">
                  <div>
                    <span className="eyebrow">TABLEAU DE BORD</span>
                    <h3>Salut {utilisateur.prenoms || "Administrateur"}</h3>
                    <p>Retrouvez ici les principaux éléments à traiter.</p>
                  </div>
                  <button className="primary-button" onClick={() => setSection("formations")}>
                    Gérer les formations <span aria-hidden="true">→</span>
                  </button>
                </div>

                <div className="admin-statistiques">
                  <article>
                    <span>Formations</span>
                    <strong>{formations.length}</strong>
                    <small>publiées ou archivées</small>
                  </article>
                  <article>
                    <span>Sessions</span>
                    <strong>{sessions.length}</strong>
                    <small>toutes les sessions</small>
                  </article>
                  <article>
                    <span>Inscriptions</span>
                    <strong>{inscriptions.length}</strong>
                    <small>toutes les inscriptions</small>
                  </article>
                  <article className="admin-stat-alerte">
                    <span>Paiements à vérifier</span>
                    <strong>{paiementsEnAttente.length}</strong>
                    <small>en attente de traitement</small>
                  </article>
                  <article>
                    <span>Paiements validés</span>
                    <strong>{paiementsValides}</strong>
                    <small>sur {tousLesPaiements.length} paiement(s)</small>
                  </article>
                </div>

                <section className="admin-carte">
                  <div className="admin-carte-entete">
                    <div>
                      <span className="eyebrow">ACTION REQUISE</span>
                      <h3>Paiements à vérifier</h3>
                    </div>
                    <button className="admin-lien" onClick={() => {
                      setPaiementsOnglet("attente");
                      setSection("paiements");
                    }}>
                      Tout afficher →
                    </button>
                  </div>
                  {paiementsEnAttente.length === 0 ? (
                    <div className="admin-vide">Aucun paiement en attente.</div>
                  ) : (
                    <div className="admin-table-enveloppe">
                      <table className="admin-table">
                        <thead>
                          <tr><th>Apprenant</th><th>Formation</th><th>Montant</th><th>Reçu le</th></tr>
                        </thead>
                        <tbody>
                          {paiementsEnAttente.slice(0, 5).map((paiement) => (
                            <tr key={paiement.id}>
                              <td>{nomApprenant(paiement)}</td>
                              <td>{nomFormation(paiement)}</td>
                              <td>{montant(paiement.montant)}</td>
                              <td>{dateFr(paiement.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}

            {section === "formations" && (
              <div className="admin-section admin-deux-colonnes">
                <section className="admin-carte admin-formulaire-carte">
                  <div className="admin-carte-entete">
                    <div>
                      <span className="eyebrow">{formationEdition ? "MODIFICATION" : "NOUVELLE FORMATION"}</span>
                      <h3>{formationEdition ? "Modifier la formation" : "Ajouter une formation"}</h3>
                    </div>
                  </div>
                  <form className="admin-form" onSubmit={enregistrerFormation}>
                    <label className="admin-champ">
                      Nom de la formation
                      <input
                        required
                        maxLength={150}
                        value={formulaireFormation.nom}
                        onChange={(event) => setFormulaireFormation({
                          ...formulaireFormation,
                          nom: event.target.value,
                        })}
                        placeholder="Ex. Comptabilité pratique"
                      />
                    </label>
                    <label className="admin-champ">
                      Catégorie
                      <select
                        required
                        value={formulaireFormation.categorie}
                        onChange={(event) => setFormulaireFormation({
                          ...formulaireFormation,
                          categorie: event.target.value,
                        })}
                      >
                        <option value="">Choisir une catégorie</option>
                        {categories.map((categorie) => (
                          <option key={categorie.id} value={categorie.id}>{categorie.nom}</option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-champ">
                      Description
                      <textarea
                        rows="5"
                        value={formulaireFormation.description}
                        onChange={(event) => setFormulaireFormation({
                          ...formulaireFormation,
                          description: event.target.value,
                        })}
                        placeholder="Présentez le contenu et les objectifs."
                      />
                    </label>
                    <label className="admin-champ">
                      Publication
                      <select
                        value={formulaireFormation.etat_publication}
                        onChange={(event) => setFormulaireFormation({
                          ...formulaireFormation,
                          etat_publication: event.target.value,
                        })}
                      >
                        <option value="PUBLIE">Publié</option>
                        <option value="ARCHIVE">Archivé</option>
                      </select>
                    </label>
                    <div className="admin-actions-form">
                      <button className="primary-button" type="submit" disabled={operation === "formation" || categories.length === 0}>
                        {operation === "formation" ? "Enregistrement…" : formationEdition ? "Enregistrer" : "Créer la formation"}
                      </button>
                      {formationEdition && (
                        <button className="admin-bouton-secondaire" type="button" onClick={annulerEditionFormation}>
                          Annuler
                        </button>
                      )}
                    </div>
                    {categories.length === 0 && (
                      <p className="admin-note">Aucune catégorie n’est disponible dans le backend.</p>
                    )}
                  </form>
                </section>

                <section className="admin-carte">
                  <div className="admin-carte-entete admin-formations-entete">
                    <div>
                      <span className="eyebrow">CATALOGUE</span>
                      <h3>Formations <span className="admin-compteur">{formations.length}</span></h3>
                    </div>
                    <input
                      className="admin-recherche"
                      type="search"
                      aria-label="Rechercher une formation"
                      placeholder="Rechercher…"
                      value={filtreFormation}
                      onChange={(event) => setFiltreFormation(event.target.value)}
                    />
                  </div>
                  {formationsFiltrees.length === 0 ? (
                    <div className="admin-vide">Aucune formation ne correspond à la recherche.</div>
                  ) : (
                    <div className="admin-table-enveloppe">
                      <table className="admin-table">
                        <thead>
                          <tr><th>Formation</th><th>Catégorie</th><th>État</th><th></th></tr>
                        </thead>
                        <tbody>
                          {formationsFiltrees.map((formation) => {
                            const categorie = categories.find((item) => item.id === formation.categorie);
                            return (
                              <tr key={formation.id}>
                                <td><strong>{formation.nom}</strong></td>
                                <td>{categorie?.nom || formation.categorie_nom || "—"}</td>
                                <td><EtatBadge valeur={formation.etat_publication} /></td>
                                <td>
                                  <button className="admin-action-texte" onClick={() => modifierFormation(formation)}>
                                    Modifier
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}

            {section === "sessions" && (
              <div className="admin-section">
                <section className="admin-carte">
                  <div className="admin-carte-entete">
                    <div>
                      <span className="eyebrow">PROGRAMMATION</span>
                      <h3>Sessions de formation <span className="admin-compteur">{sessions.length}</span></h3>
                    </div>
                    <button className="primary-button" onClick={() => setSection("creer-session")}>
                      Créer une session
                    </button>
                  </div>
                  {sessions.length === 0 ? (
                    <div className="admin-vide">Aucune session n’a été créée.</div>
                  ) : (
                    <div className="admin-table-enveloppe">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Formation</th><th>Formateur</th><th>Période</th>
                            <th>Lieu</th><th>Places</th><th>Prix</th><th>État</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map((session) => (
                            <tr key={session.id}>
                              <td><strong>{session.formation?.nom || "Formation"}</strong></td>
                              <td>
                                {session.formateur
                                  ? `${session.formateur.nom} ${session.formateur.prenoms}`
                                  : "—"}
                              </td>
                              <td>
                                {dateFr(session.date_debut)} – {dateFr(session.date_fin)}
                              </td>
                              <td>{session.lieu || "—"}</td>
                              <td>{session.place_total ?? "—"}</td>
                              <td>{montant(session.prix)}</td>
                              <td><EtatBadge valeur={session.etat} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}

            {section === "creer-session" && (
              <div className="admin-section admin-session-section">
                <section className="admin-carte">
                  <div className="admin-carte-entete">
                    <div>
                      <span className="eyebrow">NOUVELLE SESSION</span>
                      <h3>Planifier une session de formation</h3>
                    </div>
                  </div>
                  <form className="admin-form admin-form-session" onSubmit={enregistrerSession}>
                    <label className="admin-champ">
                      Formation
                      <select
                        required
                        value={formulaireSession.formation}
                        onChange={(event) => setFormulaireSession({
                          ...formulaireSession,
                          formation: event.target.value,
                        })}
                      >
                        <option value="">Choisir une formation</option>
                        {formations.map((formation) => (
                          <option key={formation.id} value={formation.id}>{formation.nom}</option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-champ">
                      Formateur
                      <select
                        required
                        value={formulaireSession.formateur}
                        onChange={(event) => setFormulaireSession({
                          ...formulaireSession,
                          formateur: event.target.value,
                        })}
                      >
                        <option value="">Choisir un formateur</option>
                        {formateurs.map((formateur) => (
                          <option key={formateur.id} value={formateur.id}>
                            {formateur.nom} {formateur.prenoms}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-champ">
                      Date de début
                      <input
                        required
                        type="date"
                        value={formulaireSession.date_debut}
                        onChange={(event) => setFormulaireSession({
                          ...formulaireSession,
                          date_debut: event.target.value,
                        })}
                      />
                    </label>
                    <label className="admin-champ">
                      Date de fin
                      <input
                        required
                        type="date"
                        min={formulaireSession.date_debut || undefined}
                        value={formulaireSession.date_fin}
                        onChange={(event) => setFormulaireSession({
                          ...formulaireSession,
                          date_fin: event.target.value,
                        })}
                      />
                    </label>
                    <label className="admin-champ">
                      Lieu
                      <input
                        required
                        maxLength={255}
                        value={formulaireSession.lieu}
                        onChange={(event) => setFormulaireSession({
                          ...formulaireSession,
                          lieu: event.target.value,
                        })}
                        placeholder="Lomé ou en ligne"
                      />
                    </label>
                    <label className="admin-champ">
                      Prix (FCFA)
                      <input
                        required
                        type="number"
                        min="0"
                        step="1"
                        value={formulaireSession.prix}
                        onChange={(event) => setFormulaireSession({
                          ...formulaireSession,
                          prix: event.target.value,
                        })}
                      />
                    </label>
                    <label className="admin-champ">
                      Nombre de places
                      <input
                        required
                        type="number"
                        min="1"
                        step="1"
                        value={formulaireSession.place_total}
                        onChange={(event) => setFormulaireSession({
                          ...formulaireSession,
                          place_total: event.target.value,
                        })}
                      />
                    </label>
                    <div className="admin-actions-form">
                      <button className="primary-button" type="submit" disabled={operation === "session" || formations.length === 0 || formateurs.length === 0}>
                        {operation === "session" ? "Création…" : "Créer la session"}
                      </button>
                    </div>
                  </form>
                  {formateurs.length === 0 && (
                    <p className="admin-note">
                      Aucun formateur n’est disponible. Vérifiez qu’au moins un compte actif a le rôle FORMATEUR.
                    </p>
                  )}
                </section>
              </div>
            )}

            {section === "inscriptions" && (
              <div className="admin-section">
                <section className="admin-carte">
                  <div className="admin-carte-entete admin-formations-entete">
                    <div>
                      <span className="eyebrow">SUIVI DES APPRENANTS</span>
                      <h3>Inscriptions <span className="admin-compteur">{inscriptionsFiltrees.length}</span></h3>
                    </div>
                    <label className="admin-filtre-statut">
                      <span>Statut</span>
                      <select
                        value={filtreInscription}
                        onChange={(event) => setFiltreInscription(event.target.value)}
                      >
                        <option value="TOUTES">Tous les statuts</option>
                        <option value="EN_ATTENTE_PAIEMENT">En attente de paiement</option>
                        <option value="CONFIRMEE">Confirmée</option>
                        <option value="PAIEMENT_REFUSE">Paiement refusé</option>
                        <option value="ANNULEE">Annulée</option>
                        <option value="EXPIREE">Expirée</option>
                      </select>
                    </label>
                  </div>
                  {inscriptionsFiltrees.length === 0 ? (
                    <div className="admin-vide">Aucune inscription pour ce filtre.</div>
                  ) : (
                    <div className="admin-table-enveloppe">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Apprenant</th><th>Formation / session</th>
                            <th>Inscrit le</th><th>Limite de paiement</th><th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inscriptionsFiltrees.map((inscription) => (
                            <tr key={inscription.id}>
                              <td>
                                <strong>
                                  {inscription.apprenant?.prenoms || ""}{" "}
                                  {inscription.apprenant?.nom || ""}
                                </strong>
                                <small>{inscription.apprenant?.email || "—"}</small>
                                <small>{inscription.apprenant?.telephone || ""}</small>
                              </td>
                              <td>
                                <strong>{inscription.session?.formation?.nom || "Formation"}</strong>
                                <small>
                                  {dateFr(inscription.session?.date_debut)} – {dateFr(inscription.session?.date_fin)}
                                </small>
                                <small>{inscription.session?.lieu || ""}</small>
                              </td>
                              <td>{dateFr(inscription.date_inscription)}</td>
                              <td>{dateFr(inscription.date_limite_paiement)}</td>
                              <td><EtatBadge valeur={inscription.statut} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}

            {section === "paiements" && (
              <div className="admin-section">
                <section className="admin-carte">
                  <div className="admin-carte-entete admin-paiements-entete">
                    <div>
                      <span className="eyebrow">SUIVI FINANCIER</span>
                      <h3>Demandes de paiement</h3>
                    </div>
                    <div className="admin-onglets" role="tablist" aria-label="Filtrer les paiements">
                      <button
                        role="tab"
                        aria-selected={paiementsOnglet === "attente"}
                        className={paiementsOnglet === "attente" ? "actif" : ""}
                        onClick={() => setPaiementsOnglet("attente")}
                      >
                        À vérifier ({paiementsEnAttente.length})
                      </button>
                      <button
                        role="tab"
                        aria-selected={paiementsOnglet === "tous"}
                        className={paiementsOnglet === "tous" ? "actif" : ""}
                        onClick={() => setPaiementsOnglet("tous")}
                      >
                        Historique ({tousLesPaiements.length})
                      </button>
                    </div>
                  </div>

                  {paiementsAffiches.length === 0 ? (
                    <div className="admin-vide">Aucun paiement dans cette liste.</div>
                  ) : (
                    <div className="admin-table-enveloppe">
                      <table className="admin-table admin-table-paiements">
                        <thead>
                          <tr>
                            <th>Apprenant</th><th>Formation</th><th>Mode</th>
                            <th>Montant</th><th>Preuve</th><th>État</th><th>Traitement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paiementsAffiches.map((paiement) => (
                            <tr key={paiement.id}>
                              <td>
                                <strong>{nomApprenant(paiement)}</strong>
                                <small>{paiement.inscription?.apprenant?.email || ""}</small>
                              </td>
                              <td>
                                <strong>{nomFormation(paiement)}</strong>
                                <small>{dateFr(paiement.inscription?.session?.date_debut)}</small>
                              </td>
                              <td>{paiement.mode || "—"}</td>
                              <td>{montant(paiement.montant)}</td>
                              <td>
                                {paiement.preuve_paiement ? (
                                  <a
                                    className="admin-action-texte"
                                    href={paiement.preuve_paiement}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Voir le reçu ↗
                                  </a>
                                ) : "—"}
                              </td>
                              <td><EtatBadge valeur={paiement.statut} /></td>
                              <td>
                                {paiement.statut === "A_VERIFIER" ? (
                                  <div className="admin-traitement">
                                    <button
                                      className="admin-valider"
                                      disabled={operation === paiement.id}
                                      onClick={() => traiterPaiement(paiement.id, "valider")}
                                    >
                                      Valider
                                    </button>
                                    {paiementRefus === paiement.id ? (
                                      <div className="admin-refus-form">
                                        <textarea
                                          rows="2"
                                          aria-label="Motif du refus"
                                          placeholder="Motif obligatoire"
                                          value={motifRefus}
                                          onChange={(event) => setMotifRefus(event.target.value)}
                                        />
                                        <button
                                          className="admin-refuser"
                                          disabled={!motifRefus.trim() || operation === paiement.id}
                                          onClick={() => traiterPaiement(paiement.id, "refuser")}
                                        >
                                          Confirmer le refus
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        className="admin-refuser"
                                        disabled={operation === paiement.id}
                                        onClick={() => {
                                          setPaiementRefus(paiement.id);
                                          setMotifRefus("");
                                        }}
                                      >
                                        Refuser
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <span className="admin-date-traitement">
                                    {paiement.date_traitement ? dateFr(paiement.date_traitement) : "—"}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
