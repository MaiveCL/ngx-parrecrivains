// doc: Pipes Angular => https://angular.dev/guide/pipes/transform-data
// doc: @Pipe + PipeTransform => https://angular.dev/api/core/PipeTransform
import { Pipe, PipeTransform } from '@angular/core';

interface FormesLangue {
  singulier: string;
  pluriel: string;
  zeroPluriel?: boolean; // undefined = non documenté = false
}

// zeroPluriel absent (cr) = absence volontaire car données inconnue
const FORMES: Record<string, FormesLangue> = {
  fr: { singulier: 'mot', pluriel: 'mots', zeroPluriel: false },
  en: { singulier: 'word', pluriel: 'words', zeroPluriel: true },
  cr: { singulier: 'nêhiyaw-pîkiskwêwin', pluriel: 'nêhiyaw-pîkiskwêwina' },
};

// Locales BCP 47 pour Intl.NumberFormat — détermine le séparateur de milliers
// fr => espace fine insécable (1 234), en => virgule (1,234), cr => même formatage que fr
// doc: Intl.NumberFormat => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
const LOCALES: Record<string, string> = {
  fr: 'fr-FR',
  cr: 'fr-FR',
  en: 'en-US',
};

// @Pipe({ name: 'mots' }) — enregistre le pipe sous le sélecteur `| mots` dans les templates
@Pipe({ name: 'mots' })
export class MotsPipe implements PipeTransform {

  // transform() est la seule méthode requise par l'interface PipeTransform
  // Angular l'appelle automatiquement à chaque changement de valeur dans le template
  transform(
    value: number | null,  // nb mots
    langue?: string,
    // code langue : 'fr' (défaut), 'en', 'cr', ou toute locale BCP 47
    // doc: liste des locales BCP 47 => https://r12a.github.io/app-subtags/
    // doc: format locale dans Intl => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument
    singulier?: string,         // custom singulier — écrase valeur intégrée
    pluriel?: string,         // custom pluriel — écrase valeur intégrée
    zeroPluriel?: boolean,        // est-ce que 0 prend le pluriel ? (en: true, fr: false)
  ): string {
    const lang = langue ?? 'fr';
    const nombre = normaliser(value);
    const locale = resolveLocale(lang);
    const formes = FORMES[lang] ?? FORMES['fr']; // langue inconnue => fallback français

    // Priorité : paramètre passé > table intégrée > false
    const zeroEstPluriel = zeroPluriel ?? formes.zeroPluriel ?? false;

    const estSingulier = nombre === 1 || (nombre === 0 && !zeroEstPluriel);
    const forme = estSingulier
      ? (singulier ?? formes.singulier) // paramètre custom prioritaire
      : (pluriel ?? formes.pluriel);

    // Intl.NumberFormat formate le nombre selon la locale (1234 => "1 234" en fr, "1,234" en en)
    // U+00A0 = espace insécable — empêche le retour à la ligne entre le nombre et l'unité
    return `${new Intl.NumberFormat(locale).format(nombre)} ${forme}`.replace(' ', '\u00A0'); // U+00A0 espace insécable
  }
}

// Alias anglophone — classe vide qui hérite tout de MotsPipe, sélecteur différent (`| words`)
// doc: héritage de pipe => https://angular.dev/guide/pipes/transform-data
@Pipe({ name: 'words' })
export class WordsPipe extends MotsPipe { }

// ─── Helpers ────────────────────────────────────────────────────────────────

// juste s'assurer que le nombre va pas tout faire péter
// `== null` (égalité lâche) attrape à la fois null ET undefined en une seule condition
// doc: égalité lâche vs stricte => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Equality
function normaliser(value: number | null | undefined): number {
  if (value == null || isNaN(value) || value < 0) return 0;
  return Math.floor(value);
}

// Tente le code langue directement dans Intl ; si invalide => fallback fr-FR
// doc: Intl.NumberFormat (constructeur) => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
function resolveLocale(langue: string): string {
  if (LOCALES[langue]) return LOCALES[langue];
  try {
    new Intl.NumberFormat(langue); // lève RangeError si la locale est invalide
    return langue;
  } catch {
    return 'fr-FR';
  }
}
