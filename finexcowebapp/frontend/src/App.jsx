import { useState } from "react";
import "./App.css";

/* =====================================================================
   INFOS À COMPLÉTER
   Remplace simplement les valeurs ci-dessous par les vraies informations
   de FINEXCO. Tout le footer et le bouton WhatsApp se mettent à jour.
   ===================================================================== */
const INFOS = {
  slogan: "Expertise · Conseil · Formation",
  description:
    "Société d'expertise comptable proposant des formations professionnelles pratiques.",
  adresse: "Siège Lomé, Togo — [Agoè la source]",
  telephone: "+228 90 78 79 99",
  whatsapp: "(228) 78908999", // chiffres uniquement, sans + ni espaces
  email: "[finexcoc@gmail.com]",
  horaires: "Lun – Ven : [ à compléter]",
  reseaux: {
    facebook: "#",
    linkedin: "#",
    instagram: "#",
    tiktok: "#",
  },
};


   
const formations = [
  {
    id: "FOR-001",
    titre: "Atelier SYCEBNL",
    categorie: "Comptabilité",
    prix: 75000,
    image: "/images/formations/atelier-sycebnl.jpg",
    modalite: "Présentiel",
    description:
      "Formation pratique pour comprendre le SYCEBNL.",
    details:
      "Découvrez les principes du SYCEBNL et familiarisez-vous avec son application pratique à travers un atelier orienté vers la compréhension des exigences comptables des organismes concernés.",
    duree: "6 jours",
    sessions: [
      {
        id: "SYCEBNL-01",
        titre: "Session de novembre",
        dates: "Du 10 au 15 novembre 2026",
        precision: "6 jours consécutifs",
        horaires: "09h00 - 16h00",
        lieu: "Salle B2, Siège Lomé",
        places: "Places limitées",
      },
    ],
  },
  {
    id: "FOR-002",
    titre: "Marketing Digital & Social Media",
    categorie: "Marketing",
    prix: 30000,
    image: "/images/formations/marketing-digital.png",
    modalite: "En ligne",
    description:
      "Développez votre marque et maîtrisez les publicités en ligne.",
    details:
      "Découvrez les bases du marketing digital, apprenez à valoriser une marque sur les réseaux sociaux et explorez les principales approches de la publicité en ligne.",
    duree: "4 sessions",
    sessions: [
      {
        id: "MARKETING-01",
        titre: "Session d'octobre",
        dates: "Tous les samedis du 5 au 26 octobre 2026",
        precision: "4 sessions",
        horaires: "14h00 - 18h00",
        lieu: "En ligne (Google Meet)",
        places: "Places limitées",
      },
    ],
  },
  {
    id: "FOR-003",
    titre: "Anglais Professionnel Intensif",
    categorie: "Langues",
    prix: 25000,
    image: "/images/formations/anglais-professionnel.png",
    modalite: "Hybride",
    description:
      "Gagnez en fluidité à l'oral pour vos réunions et entretiens professionnels.",
    details:
      "Renforcez votre communication en anglais dans un contexte professionnel, notamment pour les réunions, les échanges avec des collègues et la préparation aux entretiens.",
    duree: "1 mois",
    sessions: [
      {
        id: "ANGLAIS-01",
        titre: "Session de décembre",
        dates: "Les mardis et jeudis, du 1er au 30 décembre 2024",
        precision: "Mardis et jeudis",
        horaires: "18h30 - 20h30 (GMT)",
        lieu: "Format hybride : Lomé + replay Zoom",
        places: "Places limitées",
      },
    ],
  },
];

const formatPrix = (prix) =>
  `${prix.toLocaleString("fr-FR")} FCFA`;

const symboleCategorie = (categorie) =>
  categorie === "Comptabilité" ? "§" : categorie === "Marketing" ? "↗" : "Aa";

/* Image d'une formation : si la photo est absente ou introuvable,
   on affiche un joli bloc rose à la place (le site ne casse jamais). */
function FormationImage({ src, alt, symbole, className = "" }) {
  const [erreur, setErreur] = useState(false);

  if (!src || erreur) {
    return (
      <div className={`image-placeholder ${className}`} aria-hidden="true">
        <span>{symbole}</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErreur(true)}
    />
  );
}

/* Icônes (SVG intégrés, aucune bibliothèque à installer) */
function IconeReseau({ nom }) {
  const props = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
  };

  if (nom === "facebook") {
    return (
      <svg {...props} fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
      </svg>
    );
  }
  if (nom === "linkedin") {
    return (
      <svg {...props} fill="currentColor">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    );
  }
  if (nom === "instagram") {
    return (
      <svg
        {...props}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg {...props} fill="currentColor">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1 0-5.18c.27 0 .53.04.77.12V9.68a5.7 5.7 0 0 0-.77-.05A5.68 5.68 0 0 0 4.18 15.3a5.68 5.68 0 0 0 5.68 5.68 5.68 5.68 0 0 0 5.68-5.68V9.02a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.24-1.48z" />
    </svg>
  );
}

function App() {
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("Toutes");
  const [formationSelectionnee, setFormationSelectionnee] =
    useState(null);
  const [sessionSelectionnee, setSessionSelectionnee] =
    useState(null);
  const [message, setMessage] = useState("");
  const [emailNewsletter, setEmailNewsletter] = useState("");
  const [messageNewsletter, setMessageNewsletter] = useState("");

  const categories = [
    "Toutes",
    ...new Set(formations.map((formation) => formation.categorie)),
  ];

  const formationsFiltrees = formations.filter((formation) => {
    const correspondRecherche =
      formation.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      formation.description.toLowerCase().includes(recherche.toLowerCase());

    const correspondCategorie =
      categorie === "Toutes" || formation.categorie === categorie;

    return correspondRecherche && correspondCategorie;
  });

  const lienWhatsapp = `https://wa.me/${INFOS.whatsapp}`;

  function ouvrirFormation(formation) {
    setFormationSelectionnee(formation);
    setSessionSelectionnee(null);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retournerCatalogue() {
    setFormationSelectionnee(null);
    setSessionSelectionnee(null);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function allerAuCatalogue() {
    setFormationSelectionnee(null);
    setSessionSelectionnee(null);
    setMessage("");
    setTimeout(() => {
      document
        .getElementById("catalogue")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  function demanderInscription(session) {
    setSessionSelectionnee(session);
    setMessage(
      "Mode démonstration : cette session est sélectionnée. " +
      "L'inscription sera activée après la connexion au backend."
    );
  }

  function ouvrirConnexion() {
  setMessage(
    "La connexion sera disponible après l'intégration de l'authentification."
  );
  setFormationSelectionnee(null);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function ouvrirInscription() {
  setMessage(
    "L'inscription sera disponible après l'intégration de l'authentification."
  );
  setFormationSelectionnee(null);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

  function sabonner(event) {
    event.preventDefault();
    setMessageNewsletter(
      "Mode démonstration : l'abonnement sera activé après la connexion au backend."
    );
    setEmailNewsletter("");
  }

  return (
    <div className="site">
      <header className="site-header">
        <a
          className="logo"
          href="#accueil"
          onClick={(event) => {
            event.preventDefault();
            retournerCatalogue();
          }}
        >
          <span className="logo-name">
            <span className="logo-f">F</span>INEXCO
          </span>
        </a>

        <nav className="navigation">
          <a
            href="#accueil"
            onClick={(event) => {
              event.preventDefault();
              retournerCatalogue();
            }}
          >
            Accueil
          </a>
          <a
            href="#catalogue"
            onClick={(event) => {
              event.preventDefault();
              allerAuCatalogue();
            }}
          >
             Formations
          </a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
  <button className="header-button" onClick={ouvrirConnexion}>
    Connexion
  </button>
  <button className="primary-button" onClick={ouvrirInscription}>
    S'inscrire
  </button>
</div>
      </header>

      <main>
        {!formationSelectionnee ? (
          <>
            <section className="hero" id="accueil">
              <div className="hero-content">
                <span className="eyebrow">
                  FINEXCO · FORMATION PROFESSIONNELLE
                </span>

                <h1>
                  Développez vos compétences.
                  <span> Donnez de la valeur à votre avenir.</span>
                </h1>

                <p>
                  Découvrez nos formations et ateliers pour renforcer
                  vos compétences et accompagner votre évolution
                  professionnelle.
                </p>

                <a className="primary-button" href="#catalogue">
                  Découvrir les formations
                </a>

                <div className="hero-stats">
                  <div>
                    <strong>
                      {String(formations.length).padStart(2, "0")}
                    </strong>
                    <span>Formations présentées</span>
                  </div>
                  <div>
                    <strong>100%</strong>
                    <span>Orienté compétences</span>
                  </div>
                </div>
              </div>

              <div className="hero-panel">
                <span className="panel-label">NOTRE ENGAGEMENT</span>
                <div className="panel-line" />
                <h2>Apprendre aujourd'hui, progresser demain.</h2>
                <p>
                  Des parcours conçus pour soutenir le développement
                  des compétences professionnelles.
                </p>
                <span className="panel-mark">F.</span>
              </div>
            </section>

            <section className="domains">
              <p>DES COMPÉTENCES POUR VOTRE PARCOURS</p>
              <div className="domain-list">
                <span>audits</span>
                <span>Directionn financière et comptables</span>
                <span>conseils</span>
                <span>formations</span>
              </div>
            </section>

            <section className="catalogue section" id="catalogue">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">NOTRE CATALOGUE</span>
                  <h2> formations </h2>
                  <p>
                    Choisissez une formation pour consulter son programme
                    et ses sessions.
                  </p>
                </div>
                <span className="formation-count">
                  {formationsFiltrees.length} formation(s)
                </span>
              </div>

              <div className="catalogue-tools">
                <input
                  type="search"
                  placeholder="Rechercher une formation..."
                  value={recherche}
                  onChange={(event) => setRecherche(event.target.value)}
                  aria-label="Rechercher une formation"
                />

                <div className="category-filters">
                  {categories.map((item) => (
                    <button
                      key={item}
                      className={
                        categorie === item ? "filter active" : "filter"
                      }
                      onClick={() => setCategorie(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="formation-grid">
                {formationsFiltrees.map((formation) => (
                  <article className="formation-card" key={formation.id}>
                    <div className="card-media">
                      <FormationImage
                        src={formation.image}
                        alt={`Illustration de la formation ${formation.titre}`}
                        symbole={symboleCategorie(formation.categorie)}
                      />
                      <span className="media-badge badge-category">
                        {formation.categorie}
                      </span>
                      <span className="media-badge badge-mode">
                        {formation.modalite}
                      </span>
                      <span className="media-badge badge-duree">
                        {formation.duree}
                      </span>
                    </div>

                    <div className="card-body">
                      <span className="formation-code">{formation.id}</span>
                      <h3>{formation.titre}</h3>
                      <p className="card-description">
                        {formation.description}
                      </p>

                      <div className="card-meta">
                        <span>
                          <strong>Tarif</strong>
                          {formatPrix(formation.prix)}
                        </span>
                        <span>
                          <strong>Sessions</strong>
                          {formation.sessions.length}
                        </span>
                      </div>

                      <button
                        className="card-link"
                        onClick={() => ouvrirFormation(formation)}
                      >
                        Voir la fiche et les sessions
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {formationsFiltrees.length === 0 && (
                <div className="empty-state">
                  <h3>Aucune formation trouvée</h3>
                  <p>Essayez un autre mot-clé ou une autre catégorie.</p>
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setRecherche("");
                      setCategorie("Toutes");
                    }}
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="detail-page">
            <button
              className="back-button"
              onClick={retournerCatalogue}
            >
              ← Retour au catalogue
            </button>

            <div className="detail-hero">
              <div>
                <span className="category-tag">
                  {formationSelectionnee.categorie}
                </span>
                <p className="detail-code">
                  RÉFÉRENCE : {formationSelectionnee.id}
                </p>
                <h1>{formationSelectionnee.titre}</h1>
                <p className="detail-intro">
                  {formationSelectionnee.description}
                </p>
              </div>

              <div className="detail-media">
                <FormationImage
                  className="detail-image"
                  src={formationSelectionnee.image}
                  alt={`Illustration de la formation ${formationSelectionnee.titre}`}
                  symbole={symboleCategorie(formationSelectionnee.categorie)}
                />
                <div className="detail-price">
                  <span>Tarif de la formation</span>
                  <strong>
                    {formatPrix(formationSelectionnee.prix)}
                  </strong>
                  <span>Tarif indicatif de démonstration</span>
                </div>
              </div>
            </div>

            <div className="detail-layout">
              <div className="detail-main">
                <section className="detail-section">
                  <span className="eyebrow">À PROPOS</span>
                  <h2>Présentation de la formation</h2>
                  <p>{formationSelectionnee.details}</p>
                </section>

                <section className="detail-section sessions-section">
                  <span className="eyebrow">CALENDRIER</span>
                  <h2>Sessions de formation</h2>
                  <p className="section-description">
                    Consultez les informations de chaque session et
                    sélectionnez celle qui vous intéresse.
                  </p>

                  {formationSelectionnee.sessions.map((session) => (
                    <article className="session-card" key={session.id}>
                      <div className="session-heading">
                        <div>
                          <span className="session-label">
                            SESSION DE FORMATION
                          </span>
                          <h3>{session.titre}</h3>
                        </div>
                        <span className="session-status">
                          Places limitées
                        </span>
                      </div>

                      <div className="session-information">
                        <div className="session-info-item">
                          <span className="info-icon">◷</span>
                          <div>
                            <span>Période / Dates</span>
                            <strong>{session.dates}</strong>
                            <small>{session.precision}</small>
                          </div>
                        </div>

                        <div className="session-info-item">
                          <span className="info-icon">◴</span>
                          <div>
                            <span>Horaires</span>
                            <strong>{session.horaires}</strong>
                          </div>
                        </div>

                        <div className="session-info-item">
                          <span className="info-icon">⌖</span>
                          <div>
                            <span>Lieu</span>
                            <strong>{session.lieu}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="session-footer">
                        <span>{session.places} par session</span>
                        <button
                          className="primary-button"
                          onClick={() => demanderInscription(session)}
                        >
                          S'inscrire à cette session
                        </button>
                      </div>

                      {sessionSelectionnee?.id === session.id &&
                        message && (
                          <div className="demo-message" role="status">
                            {message}
                          </div>
                        )}
                    </article>
                  ))}
                </section>
              </div>

              <aside className="detail-sidebar">
                <h3>En résumé</h3>
                <div className="sidebar-row">
                  <span>Formation</span>
                  <strong>{formationSelectionnee.titre}</strong>
                </div>
                <div className="sidebar-row">
                  <span>Durée</span>
                  <strong>{formationSelectionnee.duree}</strong>
                </div>
                <div className="sidebar-row">
                  <span>Modalité</span>
                  <strong>{formationSelectionnee.modalite}</strong>
                </div>
                <div className="sidebar-row">
                  <span>Sessions proposées</span>
                  <strong>
                    {formationSelectionnee.sessions.length}
                  </strong>
                </div>
                <div className="sidebar-price">
                  <span>Tarif affiché</span>
                  <strong>
                    {formatPrix(formationSelectionnee.prix)}
                  </strong>
                </div>
                <p>
                  Les modalités définitives d'inscription seront
                  disponibles lorsque le service sera connecté au backend.
                </p>
              </aside>
            </div>
          </section>
        )}

        {message && !formationSelectionnee && (
          <div className="global-demo-message" role="status">
            {message}
            <button onClick={() => setMessage("")} aria-label="Fermer">
              ×
            </button>
          </div>
        )}

        <section className="contact-section" id="contact">
          <span className="eyebrow">UNE QUESTION ?</span>
          <h2>Besoin d'informations sur nos formations ?</h2>
          <p>
            Contactez FINEXCO pour obtenir des renseignements sur les
            formations et leurs modalités.
          </p>
          <a
            className="primary-button contact-button"
            href={lienWhatsapp}
            target="_blank"
            rel="noreferrer"
          >
            Nous écrire sur WhatsApp
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="newsletter">
          <div>
            <span className="newsletter-tag">RESTEZ INFORMÉ(E)</span>
            <h3>Abonnez-vous à la newsletter FINEXCO</h3>
            <p>
              Soyez averti(e) par e-mail de chaque nouvelle session de
              formation et de nos actualités.
            </p>
          </div>

          <div>
            <form className="newsletter-form" onSubmit={sabonner}>
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                value={emailNewsletter}
                onChange={(event) => setEmailNewsletter(event.target.value)}
                aria-label="Votre adresse e-mail"
                required
              />
              <button className="primary-button" type="submit">
                S'abonner →
              </button>
            </form>
            <p className="newsletter-note">
              Zéro spam. Désabonnement en 1 clic.
            </p>
            {messageNewsletter && (
              <p className="newsletter-message" role="status">
                {messageNewsletter}
              </p>
            )}
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <a
              className="footer-logo"
              href="#accueil"
              onClick={(event) => {
                event.preventDefault();
                retournerCatalogue();
              }}
            >
              <span className="logo-f">F</span>INEXCO
            </a>
            <p>{INFOS.description}</p>
            <span className="footer-slogan">{INFOS.slogan}</span>

            <a
              className="primary-button footer-whatsapp"
              href={lienWhatsapp}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp : {INFOS.telephone}
            </a>

            <p className="footer-follow">SUIVEZ-NOUS :</p>
            <div className="social-links">
              {Object.entries(INFOS.reseaux).map(([nom, lien]) => (
                <a
                  key={nom}
                  href={lien}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={nom}
                >
                  <IconeReseau nom={nom} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h4>Nos domaines</h4>
            <ul>
              {categories.slice(1).map((item) => (
                <li key={item}>
                  <a
                    href="#catalogue"
                    onClick={(event) => {
                      event.preventDefault();
                      setCategorie(item);
                      allerAuCatalogue();
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4>Navigation</h4>
            <ul>
              <li>
                <a
                  href="#accueil"
                  onClick={(event) => {
                    event.preventDefault();
                    retournerCatalogue();
                  }}
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="#catalogue"
                  onClick={(event) => {
                    event.preventDefault();
                    setCategorie("Toutes");
                    allerAuCatalogue();
                  }}
                >
                  Nos formations
                </a>
              </li>
              <li>
                <a
                  href="#espace"
                  onClick={(event) => {
                    event.preventDefault();
                    ouvrirConnexion();
                  }}
                >
                  Connexion
                </a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Siège &amp; Contacts</h4>
            <div className="footer-contact-item">
              <span>ADRESSE</span>
              <p>{INFOS.adresse}</p>
            </div>
            <div className="footer-contact-item">
              <span>TÉL / WHATSAPP</span>
              <a href={`tel:${INFOS.telephone.replace(/\s/g, "")}`}>
                {INFOS.telephone}
              </a>
            </div>
            <div className="footer-contact-item">
              <span>E-MAIL</span>
              <a href={`mailto:${INFOS.email}`}>{INFOS.email}</a>
            </div>
            <div className="footer-contact-item">
              <span>HORAIRES</span>
              <p>{INFOS.horaires}</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} FINEXCO — Cabinet d'expertise comptable
          </p>
          <span>{INFOS.slogan}</span>
        </div>
      </footer>

      <a
        className="floating-chat"
        href={lienWhatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Nous écrire sur WhatsApp"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z" />
        </svg>
      </a>
    </div>
  );
}

export default App;