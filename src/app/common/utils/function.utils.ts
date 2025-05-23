/**
 * Récupère la valeur d'un champ d'un objet en cascade
 * @param object Objet concerné
 * @param attribut Attribut à récupérer
 */
export function getValueFromAttributeInCascade(attribut: string, object: any): any {
  return attribut.split(".").reduce((obj, key) => obj ? obj[key] : null, object);
}

/**
 * Modifie la valeur d'un champ d'un objet en cascade
 * @param object Objet concerné
 * @param attribut Attribut à modifier
 * @param value Nouvelle valeur
 */
export function setValueOfAttributeInCascade(attribut: string, object: any, value: any): void {
  let parts: string[] = attribut.split(".");

  if (parts.length === 0) {
    return;
  }

  if (parts.length === 1) {
    object[attribut] = value;
  }

  if (parts.length > 1) {
    let currentObject: any = object;

    for (let i = 0; i < (parts.length - 1); i++) {
      currentObject[parts[i]] ??= {};

      currentObject = currentObject[parts[i]];
    }

    currentObject[parts[parts.length - 1]] = value;
  }
}
