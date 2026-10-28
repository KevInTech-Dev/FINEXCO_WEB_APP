/* Petites vérifications utilisées par les formulaires. */

export const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Numéro : chiffres, espaces, +, tirets ou parenthèses, avec au moins 8 chiffres
// (le backend accepte 20 caractères au maximum).
export function telephoneValide(valeur) {
  const texte = valeur.trim();
  if (texte.length > 20) return false;
  if (!/^\+?[0-9 ()-]+$/.test(texte)) return false;
  return texte.replace(/\D/g, "").length >= 8;
}
