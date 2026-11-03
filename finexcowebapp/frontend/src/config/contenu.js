/* =====================================================================
   TEXTES DES PAGES "QUI SOMMES-NOUS" ET "NOS SERVICES"
   Tous les textes sont ici : modifie-les librement, les pages se mettent
   à jour toutes seules. (Textes de départ à valider avec la direction.)
   ===================================================================== */

export const A_PROPOS = {
  accroche:
    "Un cabinet d'expertise comptable basé à Lomé, qui accompagne les entreprises et partage son savoir-faire à travers des formations pratiques.",

  /* Petit texte affiché sur l'accueil (teasing) */
  teasing:
    "FINEXCO est une société d'expertise comptable installée à Lomé. Nous accompagnons les entreprises dans la gestion de leurs comptes et nous formons les professionnels qui veulent progresser, avec des formations concrètes, tournées vers la pratique.",

  mission: {
    titre: "Notre mission",
    paragraphes: [
      "Mettre l'expertise comptable et financière à la portée des entreprises, des associations et des professionnels, avec rigueur et simplicité.",
      "Au-delà de l'accompagnement, nous croyons à la transmission : nos formations et ateliers permettent à chacun de monter en compétences et de gagner en autonomie dans son métier.",
    ],
  },

  valeurs: [
    {
      titre: "Rigueur",
      texte: "Un travail précis et fiable, dans le respect des normes et des règles en vigueur.",
    },
    {
      titre: "Pédagogie",
      texte: "Des explications claires et des exemples concrets pour que chacun comprenne et applique.",
    },
    {
      titre: "Proximité",
      texte: "Une équipe disponible et à l'écoute, qui connaît le terrain togolais.",
    },
    {
      titre: "Intégrité",
      texte: "Confidentialité, honnêteté et transparence dans toutes nos relations.",
    },
  ],

  points: [
    "Expertise comptable et financière",
    "Formations 100 % pratiques",
    "Accompagnement de proximité à Lomé",
  ],
};

export const SERVICES = [
  {
    numero: "01",
    titre: "Audits",
    description:
      "Nous examinons vos comptes et vos procédures pour vous donner une image fiable de votre situation.",
    points: [
      "Audit comptable et financier",
      "Contrôle des procédures internes",
      "Recommandations claires et applicables",
    ],
  },
  {
    numero: "02",
    titre: "Direction financière et comptable",
    description:
      "Nous prenons en charge ou nous appuyons votre fonction comptable et financière au quotidien.",
    points: [
      "Tenue et révision de la comptabilité",
      "Établissement des états financiers",
      "Suivi et tableaux de bord de gestion",
    ],
  },
  {
    numero: "03",
    titre: "Conseils",
    description:
      "Nous vous conseillons pour structurer votre organisation et prendre de meilleures décisions.",
    points: [
      "Organisation comptable et administrative",
      "Accompagnement sur les normes comptables",
      "Conseil en gestion pour entreprises et associations",
    ],
  },
  {
    numero: "04",
    titre: "Formations",
    description:
      "Des formations et ateliers pratiques pour développer vos compétences, avec des sessions régulières à Lomé.",
    points: [
      "Ateliers pratiques animés par des professionnels",
      "Sessions avec places limitées",
      "Inscription et paiement en ligne",
    ],
    lien: { texte: "Voir les formations", vers: "/formations" },
  },
];

export const ETAPES = [
  {
    titre: "Nous écoutons",
    texte: "Nous prenons le temps de comprendre votre activité et votre besoin.",
  },
  {
    titre: "Nous proposons",
    texte: "Nous vous présentons une solution claire, adaptée à votre situation.",
  },
  {
    titre: "Nous accompagnons",
    texte: "Nous mettons en œuvre avec vous et nous suivons les résultats.",
  },
];
