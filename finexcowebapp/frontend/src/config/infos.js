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

/* Paiement par Mobile Money.
   Les clients envoient l'argent à ce numéro, puis déposent la capture du reçu.
   ➜ Pour changer un numéro ou le nom du titulaire, modifiez-le ici seulement.
   Laissez "" si le numéro d'un mode n'est pas encore connu : la page
   proposera alors de contacter FINEXCO sur WhatsApp. */
export const PAIEMENT = {
  titulaire: "Directeur de FINEXCO", // à remplacer par le nom exact du compte
  numeros: {
    FLOOZ: "97 84 83 61",
    TMONEY: "",
  },
};
