/* =====================================================================
   INFOS À COMPLÉTER
   Remplace simplement les valeurs ci-dessous par les vraies informations
   de FINEXCO. Tout le footer et le bouton WhatsApp se mettent à jour.
   ===================================================================== */
export const INFOS = {
  slogan: "Expertise · Conseil · Formation",
  description:
    "Société d'expertise comptable proposant des formations professionnelles pratiques.",
  adresse: "Siège Lomé, Togo — Agoè la source",
  telephone: "+228 90 78 79 99",
  whatsapp: "(228) 78908999", // les espaces et parenthèses sont retirés automatiquement
  email: "finexcoc@gmail.com",
  horaires: "Lun – Ven : [ à compléter]",
  reseaux: {
    facebook: "#",
    linkedin: "#",
    instagram: "#",
    tiktok: "#",
  },
};

/* Bande noire sous l'accueil ("Des compétences pour votre parcours") */
export const DOMAINES = [
  "Audits",
  "Direction financière et comptable",
  "Conseils",
  "Formations",
];

export const LIEN_WHATSAPP = `https://wa.me/${INFOS.whatsapp.replace(/\D/g, "")}`;
