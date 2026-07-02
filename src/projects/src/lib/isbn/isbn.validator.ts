// doc: Créer un validator Angular personnalisé https://angular.dev/guide/forms/form-validation#adding-custom-validators-to-reactive-forms
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

// ─── Constantes et types publics ─────────────────────────────────────────────

// `as const` fige les valeurs
// doc: TypeScript `as const` https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types
export const ISBN_ERREURS = {
  FORMAT: 'isbnFormat',
  PREFIXE: 'isbnPrefixe',
  CHECKSUM: 'isbnChecksum',
  COHERENCE: 'isbnCoherence',
} as const;

export interface IsbnOptions {
  annee?: number; // optionnel : si absent, la vérification de cohérence est ignorée
}

// Type union : le résultat est soit valide, soit invalide avec une clé d'erreur précise — jamais les deux
// doc: Types union TypeScript https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types
export type IsbnResultat =
  | { valide: true }
  | { valide: false; erreur: typeof ISBN_ERREURS[keyof typeof ISBN_ERREURS] };

// ─── Fonction pure (zéro dépendance Angular) ─────────────────────────────────
// Peut être appelée n'importe où : composant, service, test Vitest — sans TestBed
// doc: algorithmes checksum ISBN-10 et ISBN-13 avec exemples specs/004-validator-isbn/research.md

// prend en entrée une chaîne de caractères et une année optionnelle
export function validerIsbn(isbn: string | null | undefined, annee?: number): IsbnResultat {
  if (!isbn) return { valide: true };
  // le but est de repérer un mauvais ISBN, c'est pas à nous de dire si le champ est obligatoire dans le formulaire
  // doc: séparation des responsabilités (required vs format) https://angular.dev/guide/forms/form-validation#built-in-validators

  // Ordre fail-fast : on retourne la première erreur trouvée
  // 1. Format — longueur et caractères
  const n = isbn.length;
  if (n === 10) {
    // 9 chiffres + 1 chiffre ou X (X = 10 dans l'algorithme ISBN-10)
    // doc: expressions régulières https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Regular_expressions
    if (!/^\d{9}[\dXx]$/.test(isbn)) return { valide: false, erreur: ISBN_ERREURS.FORMAT };
    if (!_checksumIsbn10(isbn)) return { valide: false, erreur: ISBN_ERREURS.CHECKSUM };
  } else if (n === 13) {
    if (!/^\d{13}$/.test(isbn)) return { valide: false, erreur: ISBN_ERREURS.FORMAT };
    // 2. Préfixe ISBN-13 — seuls 978 et 979 sont valides (standard GS1)
    if (!isbn.startsWith('978') && !isbn.startsWith('979'))
      return { valide: false, erreur: ISBN_ERREURS.PREFIXE };
    if (!_checksumIsbn13(isbn)) return { valide: false, erreur: ISBN_ERREURS.CHECKSUM };
  } else {
    return { valide: false, erreur: ISBN_ERREURS.FORMAT };
  }

  // 3. Cohérence format / année (zone grise 2005-2006 = les deux formats coexistaient)
  if (annee !== undefined) {
    if (n === 10 && annee > 2006) return { valide: false, erreur: ISBN_ERREURS.COHERENCE };
    if (n === 13 && annee < 2005) return { valide: false, erreur: ISBN_ERREURS.COHERENCE };
  }

  return { valide: true };
}

// ─── Factory Angular ValidatorFn ─────────────────────────────────────────────
// doc: AbstractControl https://angular.dev/api/forms/AbstractControl
// doc: ValidatorFn https://angular.dev/api/forms/ValidatorFn
// doc: ValidationErrors https://angular.dev/api/forms/ValidationErrors

export function isbnValidator(options?: IsbnOptions): ValidatorFn {
  // Retourne une fonction — pattern "factory" : on configure une fois, on réutilise
  return (control: AbstractControl): ValidationErrors | null => {
    // options?.annee — opérateur optionnel : si options n'est pas passé, retourne undefined sans planter
    // doc: optional chaining https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Optional_chaining
    const resultat = validerIsbn(control.value, options?.annee);
    if (resultat.valide) return null; // null = pas d'erreur (convention Angular Forms)
    // { [clé]: true } — clé dynamique : ex. erreur = 'isbnChecksum' { isbnChecksum: true }
    // doc: propriétés calculées https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Object_initializer#noms_de_propri%C3%A9t%C3%A9s_calcul%C3%A9s
    return { [resultat.erreur]: true };
  };
}

// ─── Helpers privés — algorithmes checksum ───────────────────────────────────
// doc: détail des algorithmes avec exemples chiffrés specs/004-validator-isbn/research.md

// ISBN-10 : somme pondérée (chiffre × position décroissante), résultat divisible par 11
// source: norme ISO 2108 — https://fr.wikipedia.org/wiki/International_Standard_Book_Number#ISBN-10
function _checksumIsbn10(isbn: string): boolean {
  let somme = 0;
  for (let i = 0; i < 9; i++) {
    somme += parseInt(isbn[i], 10) * (10 - i);
  }
  const dernier = isbn[9].toUpperCase() === 'X' ? 10 : parseInt(isbn[9], 10); // X vaut 10
  somme += dernier;
  return somme % 11 === 0;
}

// ISBN-13 : poids alternés 1 et 3, résultat divisible par 10
// source: standard GS1 / EAN-13 — https://fr.wikipedia.org/wiki/International_Standard_Book_Number#ISBN-13
function _checksumIsbn13(isbn: string): boolean {
  let somme = 0;
  for (let i = 0; i < 13; i++) {
    somme += parseInt(isbn[i], 10) * (i % 2 === 0 ? 1 : 3); // pair × 1, impair × 3
  }
  return somme % 10 === 0;
}
