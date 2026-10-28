import { useRef, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { analyserErreur } from "../api/auth";
import { formatPrix } from "../api/formations";
import {
  marquerPreuveEnvoyee,
  trouverInscription,
} from "../api/inscriptionsLocales";
import {
  MODES_PAIEMENT,
  TAILLE_MAX_PREUVE,
  TYPES_PREUVE,
  soumettrePaiementApi,
} from "../api/paiements";
import { LIEN_WHATSAPP, PAIEMENT } from "../config/infos";
import { useAuth } from "../context/AuthContext";
import { useFormations } from "../context/FormationsContext";
import useTitre from "../hooks/useTitre";
import { formaterDateHeure } from "../utils/dates";

function formaterTaille(octets) {
  return octets < 1024 * 1024
    ? `${Math.max(1, Math.round(octets / 1024))} Ko`
    : `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
}

/* Page /paiement/:inscriptionId
   L'apprenant envoie l'argent par Flooz ou TMoney, puis dépose la preuve
   (capture d'écran ou PDF). Un administrateur la vérifie ensuite. */
export default function Paiement() {
  useTitre("Paiement");
  const { inscriptionId } = useParams();
  const location = useLocation();
  const { formations, chargement } = useFormations();
  const { utilisateur, chargement: verification, appelAuthentifie } = useAuth();

  const champFichier = useRef(null);
  const [mode, setMode] = useState("FLOOZ");
  const [fichier, setFichier] = useState(null);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);

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

  if (!utilisateur) {
    return (
      <Navigate
        to="/connexion"
        replace
        state={{
          from: location.pathname,
          message: "Connectez-vous pour accéder au paiement de votre inscription.",
        }}
      />
    );
  }

  const inscription = trouverInscription(utilisateur.id, inscriptionId);
  const formation = inscription
    ? formations.find((item) => String(item.id) === inscription.formationId)
    : null;
  const session = formation?.sessions.find(
    (item) => String(item.id) === inscription.sessionId
  );

  if (!inscription || !formation || !session) {
    return (
      <section className="detail-page">
        <div className="empty-state">
          <h3>Inscription introuvable</h3>
          <p>
            Nous ne retrouvons pas cette inscription sur cet appareil. Si vous
            vous êtes déjà inscrit(e), contactez-nous pour finaliser votre
            paiement.
          </p>
          <div className="inscription-actions" style={{ justifyContent: "center" }}>
            <a
              className="primary-button"
              href={LIEN_WHATSAPP}
              target="_blank"
              rel="noreferrer"
            >
              Nous écrire sur WhatsApp
            </a>
            <Link className="header-button" to="/formations">
              Voir les formations
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const montant = session.prix;
  const delaiDepasse = new Date(inscription.dateLimite).getTime() < Date.now();
  const dejaEnvoye = inscription.preuveEnvoyee || envoye;
  const numero = PAIEMENT.numeros[mode];
  const nomMode = MODES_PAIEMENT.find((item) => item.code === mode)?.nom;

  function choisirFichier(event) {
    const choisi = event.target.files?.[0];
    setErreur("");
    if (!choisi) {
      setFichier(null);
      return;
    }
    if (!TYPES_PREUVE.includes(choisi.type)) {
      setFichier(null);
      event.target.value = "";
      setErreur("Format non accepté : choisissez une image (JPG, PNG, WEBP) ou un PDF.");
      return;
    }
    if (choisi.size > TAILLE_MAX_PREUVE) {
      setFichier(null);
      event.target.value = "";
      setErreur("Ce fichier est trop lourd (5 Mo maximum).");
      return;
    }
    setFichier(choisi);
  }

  async function envoyer(event) {
    event.preventDefault();
    if (!fichier) {
      setErreur("Ajoutez la capture ou le PDF de votre reçu de paiement.");
      return;
    }

    setErreur("");
    setEnvoi(true);
    try {
      // Données de démonstration : pas de vrai serveur, on simule l'envoi.
      if (!inscription.demo) {
        await appelAuthentifie((jeton) =>
          soumettrePaiementApi(jeton, {
            inscriptionId: inscription.id,
            mode,
            fichier,
          })
        );
      }
      marquerPreuveEnvoyee(utilisateur.id, inscription.id);
      setEnvoye(true);
    } catch (e) {
      const { champs, general } = analyserErreur(e);
      setErreur(general || Object.values(champs).join(" "));
    } finally {
      setEnvoi(false);
    }
  }

  /* ---------- Preuve envoyée ---------- */
  if (dejaEnvoye) {
    return (
      <section className="detail-page inscription-page">
        <div className="inscription-succes">
          <span className="eyebrow">PREUVE ENVOYÉE</span>
          <h1>Merci, nous vérifions votre paiement</h1>
          <p>
            Votre reçu pour <strong>{formation.titre}</strong> ({session.titre})
            a bien été transmis. Notre équipe le vérifie : votre inscription
            sera confirmée dès qu'il sera validé.
          </p>

          <div className="recap-liste">
            <div>
              <span>Statut du paiement</span>
              <strong>À vérifier</strong>
            </div>
            <div>
              <span>Montant</span>
              <strong>{montant !== null ? formatPrix(montant) : "—"}</strong>
            </div>
          </div>

          {inscription.demo && (
            <div className="demo-message">
              Mode démonstration : le serveur n'est pas connecté, ce paiement
              n'a pas été enregistré.
            </div>
          )}

          <div className="inscription-actions">
            <Link className="primary-button" to="/formations">
              Voir d'autres formations
            </Link>
            <Link className="header-button" to="/">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- Délai dépassé ---------- */
  if (delaiDepasse) {
    return (
      <section className="detail-page">
        <div className="empty-state">
          <h3>Le délai de paiement est dépassé</h3>
          <p>
            Cette inscription devait être payée avant le{" "}
            {formaterDateHeure(inscription.dateLimite)}. Vous pouvez vous
            inscrire de nouveau si des places sont encore disponibles, ou nous
            contacter.
          </p>
          <Link className="primary-button" to={`/formations/${formation.id}`}>
            Retour à la formation
          </Link>
        </div>
      </section>
    );
  }

  /* ---------- Formulaire de paiement ---------- */
  return (
    <section className="detail-page inscription-page">
      <Link className="back-button" to={`/formations/${formation.id}`}>
        ← Retour à la formation
      </Link>

      <span className="eyebrow">PAIEMENT</span>
      <h1 className="inscription-titre">Réglez votre inscription</h1>

      <form className="inscription-layout" onSubmit={envoyer} noValidate>
        <div className="inscription-colonne">
          <div className="recap-carte">
            <h2>Votre inscription</h2>
            <div className="recap-liste">
              <div>
                <span>Formation</span>
                <strong>{formation.titre}</strong>
              </div>
              <div>
                <span>Session</span>
                <strong>{session.dates}</strong>
              </div>
              <div>
                <span>Montant à payer</span>
                <strong>{montant !== null ? formatPrix(montant) : "Sur demande"}</strong>
              </div>
              <div>
                <span>À payer avant le</span>
                <strong>{formaterDateHeure(inscription.dateLimite)}</strong>
              </div>
            </div>
          </div>

          <div className="recap-carte">
            <h2>Comment payer avec {nomMode} ?</h2>

            {numero ? (
              <div className="numero-paiement">
                <span>Envoyez {montant !== null ? formatPrix(montant) : "le montant"} au</span>
                <strong>{numero}</strong>
                <small>Titulaire : {PAIEMENT.titulaire}</small>
              </div>
            ) : (
              <div className="demo-message">
                Le numéro {nomMode} n'est pas encore disponible. Choisissez
                Flooz ou{" "}
                <a href={LIEN_WHATSAPP} target="_blank" rel="noreferrer">
                  écrivez-nous sur WhatsApp
                </a>{" "}
                pour l'obtenir.
              </div>
            )}

            <ol className="etapes-liste etapes-claires">
              <li>Ouvrez {nomMode} sur votre téléphone.</li>
              <li>Envoyez exactement le montant indiqué au numéro ci-dessus.</li>
              <li>Faites une capture d'écran du message de confirmation.</li>
              <li>Ajoutez-la dans le formulaire à droite, puis envoyez.</li>
            </ol>
          </div>
        </div>

        <aside className="inscription-confirmation">
          <h2>Envoyer ma preuve de paiement</h2>

          {inscription.demo && (
            <div className="demo-message">
              Mode démonstration : les données affichées sont des exemples.
            </div>
          )}

          <fieldset className="mode-choix">
            <legend>Mode de paiement</legend>
            {MODES_PAIEMENT.map((item) => (
              <label
                key={item.code}
                className={mode === item.code ? "mode-option active" : "mode-option"}
              >
                <input
                  type="radio"
                  name="mode"
                  value={item.code}
                  checked={mode === item.code}
                  onChange={() => setMode(item.code)}
                />
                <span>{item.nom}</span>
              </label>
            ))}
          </fieldset>

          <div className="fichier-zone">
            <label htmlFor="preuve">Capture d'écran ou PDF du reçu</label>
            <input
              ref={champFichier}
              id="preuve"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={choisirFichier}
            />
            <small>
              {fichier
                ? `${fichier.name} · ${formaterTaille(fichier.size)}`
                : "Image (JPG, PNG, WEBP) ou PDF · 5 Mo maximum"}
            </small>
          </div>

          {erreur && (
            <div className="form-alerte" role="alert">
              {erreur}
            </div>
          )}

          <button className="primary-button" type="submit" disabled={envoi}>
            {envoi ? "Envoi en cours…" : "Envoyer ma preuve"}
          </button>
        </aside>
      </form>
    </section>
  );
}
