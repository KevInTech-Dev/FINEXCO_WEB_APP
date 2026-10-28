import { LIEN_WHATSAPP } from "../config/infos";

/* Bouton rond WhatsApp, en bas à droite de toutes les pages. */
export default function BoutonWhatsApp() {
  return (
    <a
      className="floating-chat"
      href={LIEN_WHATSAPP}
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
  );
}
