/* Mise en page commune aux pages Connexion et Inscription :
   un panneau noir à gauche, la carte du formulaire à droite. */
export default function AuthLayout({
  children,
  eyebrow = "ESPACE APPRENANT",
  titre = "Apprendre aujourd'hui,",
  accent = "progresser demain.",
  description = "Créez votre compte pour réserver votre place dans nos sessions de formation.",
  points = [
    "Consultez toutes nos formations et leurs sessions",
    "Réservez votre place en quelques clics",
  ],
}) {
  return (
    <section className="auth-page">
      <aside className="auth-aside">
        <span className="eyebrow">{eyebrow}</span>
        <h2>
          {titre} <span>{accent}</span>
        </h2>
        <p>{description}</p>
        <ul className="auth-points">
          {points.map((point) => <li key={point}>{point}</li>)}
        </ul>
        <span className="auth-mark" aria-hidden="true">
          F.
        </span>
      </aside>

      <div className="auth-main">
        <div className="auth-card">{children}</div>
      </div>
    </section>
  );
}
