import { useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { analyserErreur } from "../api/auth";
import { formatPrix } from "../api/formations";
import { creerInscriptionApi } from "../api/inscriptions";
import { soumettrePaiementApi } from "../api/paiements";
import { useAuth } from "../context/AuthContext";
import { useFormations } from "../context/FormationsContext";
import useTitre from "../hooks/useTitre";

function formaterDateHeure(valeur) {
  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* Page /formations/:id/sessions/:sessionId/inscription
   Inscription d'une personne connectée à une session : elle vérifie le
   récapitulatif, puis confirme. Le backend réserve la place jusqu’à l’échéance calculée (72 h maximum, sans dépasser la clôture de la session),
   le temps de payer. */
export default function InscriptionSession() {
  useTitre("Inscription à une session");
  const { id, sessionId } = useParams();
  const location = useLocation();
  const { formations, chargement, source } = useFormations();
  const { utilisateur, chargement: verification, appelAuthentifie } = useAuth();

  const [accepte, setAccepte] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [inscription, setInscription] = useState(null);
  // Ces états décrivent le formulaire manuel et la réponse du backend.
  const [modePaiement, setModePaiement] = useState("FLOOZ");
  const [preuvePaiement, setPreuvePaiement] = useState(null);
  const [paiement, setPaiement] = useState(null);
  const [erreurPaiement, setErreurPaiement] = useState("");
  const [envoiPaiement, setEnvoiPaiement] = useState(false);

  if (chargement || verification) {
    return (
      <section className="detail-page">
        <div className="empty-state page-state" role="status">
          <h3>Chargement…</h3>
          <p>Merci de patienter quelques instants.</p>
        </div>
      </section>
    );
  }

  // Il faut un compte : on envoie vers la connexion, puis on revient ici.
  if (!utilisateur) {
    return (
      <Navigate
        to="/connexion"
        replace
        state={{
          from: location.pathname,
          message:
            "Connectez-vous ou créez un compte pour vous inscrire à une session.",
        }}
      />
    );
  }

  const formation = formations.find((item) => String(item.id) === id);
  const session = formation?.sessions.find(
    (item) => String(item.id) === sessionId
  );

  if (!formation || !session) {
    return (
      <section className="detail-page">
        <div className="empty-state">
          <h3>Session introuvable</h3>
          <p>Cette session n'existe pas ou n'est plus ouverte.</p>
          <Link className="primary-button" to="/formations">
            Voir les formations
          </Link>
        </div>
      </section>
    );
  }

  if (utilisateur.role && utilisateur.role !== "APPRENANT") {
    return (
      <section className="detail-page">
        <div className="empty-state">
          <h3>Inscription réservée aux apprenants</h3>
          <p>Seul un compte apprenant peut s'inscrire à une session.</p>
          <Link className="primary-button" to={`/formations/${id}`}>
            Retour à la formation
          </Link>
        </div>
      </section>
    );
  }

  async function confirmer(event) {
    event.preventDefault();
    if (!accepte) {
      setErreur("Cochez la case pour confirmer votre inscription.");
      return;
    }

    setErreur("");
    setEnvoi(true);
    try {
      // Données de démonstration : pas de vrai serveur, on simule la réponse.
      if (source !== "api") {
        const limite = new Date(Date.now() + 72 * 3600 * 1000).toISOString();
        setInscription({
          id: "demo",
          statut: "EN_ATTENTE_PAIEMENT",
          date_limite_paiement: limite,
          demo: true,
        });
        return;
      }

      const reponse = await appelAuthentifie((jeton) =>
        creerInscriptionApi(jeton, session.id)
      );
      setInscription(reponse);
    } catch (e) {
      const { champs, general } = analyserErreur(e);
      setErreur(general || Object.values(champs).join(" "));
    } finally {
      setEnvoi(false);
    }
  }

  // Cette fonction envoie le mode et la capture au service de paiement.
  async function envoyerPreuve(event) {
    event.preventDefault();
    if (!preuvePaiement) {
      setErreurPaiement("Sélectionnez la capture de votre paiement.");
      return;
    }

    setErreurPaiement("");
    setEnvoiPaiement(true);
    try {
      const reponse = await appelAuthentifie((jeton) =>
        soumettrePaiementApi(jeton, {
          inscriptionId: inscription.id,
          mode: modePaiement,
          preuvePaiement,
        })
      );
      setPaiement(reponse);
    } catch (e) {
      const { champs, general } = analyserErreur(e);
      setErreurPaiement(general || Object.values(champs).join(" "));
    } finally {
      setEnvoiPaiement(false);
    }
  }

  /* ---------- Étape 2 : inscription enregistrée ---------- */
  if (inscription) {
    return (
      <section className="detail-page inscription-page">
        <div className="inscription-succes">
          <span className="eyebrow">INSCRIPTION ENREGISTRÉE</span>
          <h1>Votre place est réservée</h1>
          <p>
            Vous êtes inscrit(e) à <strong>{formation.titre}</strong> ({session.titre}).
            Pour la confirmer, il reste à effectuer le paiement.
          </p>

          <div className="recap-liste">
            <div>
              <span>Statut</span>
              <strong>En attente de paiement</strong>
            </div>
            <div>
              <span>Paiement à effectuer avant le</span>
              <strong>{formaterDateHeure(inscription.date_limite_paiement)}</strong>
            </div>
            <div>
              <span>Montant</span>
              <strong>
                {session.prix !== null ? formatPrix(session.prix) : "Sur demande"}
              </strong>
            </div>
          </div>

          {inscription.demo && (
            <div className="demo-message">
              Mode démonstration : le serveur n'est pas connecté, cette
              inscription n'a pas été enregistrée.
            </div>
          )}

          {inscription.demo ? (
            <div className="demo-message">
              Le dépôt de preuve sera disponible lorsque le backend sera connecté.
            </div>
          ) : paiement ? (
            <div className="form-info" role="status">
              Votre preuve a bien été envoyée. Le paiement est en attente de
              vérification par l’équipe FINEXCO.
            </div>
          ) : (
            <form className="auth-form paiement-form" onSubmit={envoyerPreuve} noValidate>
              <h2>Envoyer la preuve de paiement</h2>
              <p>
                Effectuez le dépôt sur le numéro Flooz ou Tmoney communiqué par
                l’agence, puis joignez la capture du reçu. Le montant est celui
                indiqué ci-dessus.<br/> N° FLOOZ = 96 01 00 02 <br/> N° TMoney = 70 01 00 02
              </p>

              <div className="champ">
                <label htmlFor="mode-paiement">Mode de paiement</label>
                <select
                  id="mode-paiement"
                  value={modePaiement}
                  onChange={(event) => setModePaiement(event.target.value)}
                >
                  <option value="FLOOZ">Flooz</option>
                  <option value="TMONEY">TMoney</option>
                </select>
              </div>

              <div className="champ">
                <label htmlFor="preuve-paiement">Capture du reçu</label>
                <input
                  id="preuve-paiement"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setPreuvePaiement(event.target.files?.[0] ?? null);
                    setErreurPaiement("");
                  }}
                />
              </div>

              {erreurPaiement && (
                <div className="form-alerte" role="alert">
                  {erreurPaiement}
                </div>
              )}

              <button className="primary-button" type="submit" disabled={envoiPaiement}>
                {envoiPaiement ? "Envoi en cours…" : "Envoyer la preuve"}
              </button>
            </form>
          )}

          <div className="inscription-actions">
            <Link className="header-button" to="/formations">
              Voir d'autres formations
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- Étape 1 : récapitulatif et confirmation ---------- */
  return (
    <section className="detail-page inscription-page">
      <Link className="back-button" to={`/formations/${id}`}>
        ← Retour à la formation
      </Link>

      <span className="eyebrow">INSCRIPTION À UNE SESSION</span>
      <h1 className="inscription-titre">Confirmez votre inscription</h1>

      <form className="inscription-layout" onSubmit={confirmer} noValidate>
        <div className="inscription-colonne">
          <div className="recap-carte">
            <h2>La session</h2>
            <div className="recap-liste">
              <div>
                <span>Formation</span>
                <strong>{formation.titre}</strong>
              </div>
              <div>
                <span>Période</span>
                <strong>{session.dates}</strong>
              </div>
              <div>
                <span>Lieu</span>
                <strong>{session.lieu}</strong>
              </div>
              {session.formateur && (
                <div>
                  <span>Formateur</span>
                  <strong>{session.formateur}</strong>
                </div>
              )}
              <div>
                <span>Tarif</span>
                <strong>
                  {session.prix !== null ? formatPrix(session.prix) : "Sur demande"}
                </strong>
              </div>
            </div>
          </div>

          <div className="recap-carte">
            <h2>Vos informations</h2>
            <div className="recap-liste">
              <div>
                <span>Nom et prénoms</span>
                <strong>
                  {utilisateur.nom} {utilisateur.prenoms}
                </strong>
              </div>
              <div>
                <span>Adresse e-mail</span>
                <strong>{utilisateur.email}</strong>
              </div>
              {utilisateur.telephone && (
                <div>
                  <span>Téléphone</span>
                  <strong>{utilisateur.telephone}</strong>
                </div>
              )}
            </div>
            <p className="recap-note">
              Ces informations viennent de votre compte.
            </p>
          </div>
        </div>

        <aside className="inscription-confirmation">
          <h2>Comment ça se passe ?</h2>
          <ol className="etapes-liste">
            <li>Vous confirmez votre inscription : la place est réservée.</li>
            <li>Vous avez jusqu’à 72 h pour payer. L’échéance exacte s’affichera après l’inscription.</li>
            <li>
              Après vérification du paiement par notre équipe, votre
              inscription est confirmée.
            </li>
          </ol>

          {source !== "api" && (
            <div className="demo-message">
              Mode démonstration : les données affichées sont des exemples.
            </div>
          )}

          {erreur && (
            <div className="form-alerte" role="alert">
              {erreur}
            </div>
          )}

          <label className="case-accord">
            <input
              type="checkbox"
              checked={accepte}
              onChange={(event) => {
                setAccepte(event.target.checked);
                setErreur("");
              }}
            />
            <span>
              Je confirme mon inscription à cette session et je comprends que
              l’échéance affichée après l’inscription est le délai à respecter (72 h maximum).
            </span>
          </label>

          <button className="primary-button" type="submit" disabled={envoi}>
            {envoi ? "Enregistrement…" : "Confirmer mon inscription"}
          </button>
        </aside>
      </form>
    </section>
  );
}
