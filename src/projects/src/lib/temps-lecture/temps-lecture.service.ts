// doc: Services Angular + @Injectable => https://angular.dev/guide/di/creating-injectable-service
import { Injectable } from '@angular/core';

// source: approximation adulte anglophone (Rayner et al., 2016) — non validée pour le français
// doc: étude source => specs/003-service-temps-lecture/research.md
export const VITESSE_LECTURE_DEFAUT = 200; // mots par minute

// providedIn: 'root' => Angular crée une seule instance partagée dans toute l'app (singleton)
// pas besoin de déclarer le service dans providers[] d'un composant ou module
// doc: providedIn root => https://angular.dev/guide/di/creating-injectable-service#providing-a-service
@Injectable({ providedIn: 'root' })
export class TempsLectureService {

  // Retourne le temps estimé en secondes
  // vitesseMots optionnel — si absent ou invalide, utilise VITESSE_LECTURE_DEFAUT
  estimer(nombreMots: number | null | undefined, vitesseMots?: number): number {
    const mots = normaliserMots(nombreMots);
    const vitesse = (vitesseMots != null && vitesseMots > 0) ? vitesseMots : VITESSE_LECTURE_DEFAUT;
    // (mots / vitesse) = minutes => * 60 = secondes
    // doc: Math.round => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/round
    return Math.round((mots / vitesse) * 60);
  }

  // TODO-REVIEW: V2 — ajouter un paramètre `langue?: string` pour supporter des abréviations
  // localisées (ex. cri ou autres langues des Premières Nations).
  // Actuellement "h" et "min" sont universels pour fr/en/cr — décision actée dans research.md §4.

  // Convertit des secondes en chaîne lisible : "5 min", "1 h 05 min"
  formater(secondes: number): string {
    if (secondes <= 0) return '0 min';
    // Math.ceil arrondit au plafond — on n'affiche jamais moins de temps qu'il en faut réellement
    const totalMinutes = Math.ceil(secondes / 60);
    if (totalMinutes < 60) return `${totalMinutes} min`;
    const heures = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    // padStart(2, '0') force deux chiffres : "5" => "05" pour "1 h 05 min" au lieu de "1 h 5 min"
    // doc: padStart => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    return `${heures} h ${String(minutes).padStart(2, '0')} min`;
  }
}

// s'assurer que le nombre retourné va pas tout faire péter
// Plus stricte que le normaliser() du pipe : vérifie aussi isFinite (rejette Infinity)
// doc: isFinite => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/isFinite
function normaliserMots(valeur: number | null | undefined): number {
  if (valeur == null || typeof valeur !== 'number' || isNaN(valeur) || !isFinite(valeur) || valeur < 0) {
    return 0;
  }
  return Math.floor(valeur);
}
//Infinity = valeur mathématique spéciale en JavaScript, un nombre trop grand pour exister, ou le résultat d'une division par zéro
