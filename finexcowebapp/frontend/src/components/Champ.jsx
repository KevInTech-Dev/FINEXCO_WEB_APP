import { useState } from "react";

/* Un champ de formulaire : étiquette, saisie, aide et message d'erreur.
   Pour un mot de passe, un bouton "Afficher / Masquer" est ajouté. */
export default function Champ({
  id,
  label,
  type = "text",
  value,
  onChange,
  erreur,
  aide,
  ...reste
}) {
  const [visible, setVisible] = useState(false);
  const estMotDePasse = type === "password";
  const typeReel = estMotDePasse && visible ? "text" : type;

  return (
    <div className={`champ${erreur ? " champ-erreur" : ""}`}>
      <label htmlFor={id}>{label}</label>

      <div className="champ-saisie">
        <input
          id={id}
          type={typeReel}
          value={value}
          onChange={onChange}
          className={estMotDePasse ? "avec-bouton" : undefined}
          aria-invalid={erreur ? "true" : "false"}
          aria-describedby={erreur ? `${id}-erreur` : undefined}
          {...reste}
        />
        {estMotDePasse && (
          <button
            type="button"
            className="champ-afficher"
            onClick={() => setVisible((v) => !v)}
            aria-pressed={visible}
          >
            {visible ? "Masquer" : "Afficher"}
          </button>
        )}
      </div>

      {aide && !erreur && <small className="champ-aide">{aide}</small>}
      {erreur && (
        <small id={`${id}-erreur`} className="champ-message" role="alert">
          {erreur}
        </small>
      )}
    </div>
  );
}
