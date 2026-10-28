/* Date + heure en français : "29 octobre 2026 à 14:41" */
export function formaterDateHeure(valeur) {
  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
