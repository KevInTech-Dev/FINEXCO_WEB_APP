import { LIEN_WHATSAPP } from "../config/infos";

/* Bloc "Une question ?" (page d'accueil, ancre #contact). */
export default function SectionContact() {
  return (
    <section className="contact-section" id="contact">
      <span className="eyebrow">UNE QUESTION ?</span>
      <h2>Besoin d'informations sur nos formations ?</h2>
      <p>
        Contactez FINEXCO pour obtenir des renseignements sur les formations
        et leurs modalités.
      </p>
      <a
        className="primary-button contact-button"
        href={LIEN_WHATSAPP}
        target="_blank"
        rel="noreferrer"
      >
        Nous écrire sur WhatsApp
      </a>
    </section>
  );
}
