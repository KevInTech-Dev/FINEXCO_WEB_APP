/* Mise en page commune aux pages Connexion et Inscription :
   un panneau noir à gauche, la carte du formulaire à droite. */
export default function AuthLayout({ children }) {
  return (
    <section className="auth-page">
      <aside className="auth-aside">
        <span className="eyebrow">ESPACE APPRENANT</span>
        <h2>
          Apprendre aujourd'hui, <span>progresser demain.</span>
        </h2>
        <p>
          Créez votre compte pour réserver votre place dans nos sessions de
          formation.
        </p>
        <ul className="auth-points">
          <li>Consultez toutes nos formations et leurs sessions</li>
          <li>Réservez votre place en quelques clics</li>
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
