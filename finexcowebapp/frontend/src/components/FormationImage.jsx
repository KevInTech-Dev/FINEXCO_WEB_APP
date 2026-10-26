import { useState } from "react";

/* Image d'une formation : si la photo est absente ou introuvable,
   on affiche un joli bloc rose à la place (le site ne casse jamais). */
export default function FormationImage({ src, alt, symbole, className = "" }) {
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
