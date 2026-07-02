// doc: Signals Angular => https://angular.dev/guide/signals
import { Injectable, signal, WritableSignal } from '@angular/core';
import { ConfigLecture, CONFIG_LECTURE_DEFAUT } from '../../types/liseuse.types';

// Force une valeur dans une plage min-max : clamp(150, 16, 24) => 24, clamp(10, 16, 24) => 16
// doc: Math.min / Math.max => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/min
function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

// providedIn intentionnellement absent — fourni dans LiseuseManuscritComponent.providers[]
// => deux liseuses sur la même page ont chacune leur propre config indépendante
// doc: services à portée de composant => https://angular.dev/guide/di/hierarchical-dependency-injection#providing-services-in-components
@Injectable()
export class ConfigLectureService {

  // WritableSignal = signal qu'on peut modifier (vs ReadonlySignal qu'on ne peut que lire)
  // { ...CONFIG_LECTURE_DEFAUT } = copie par spread, pas une référence — chaque instance est indépendante
  // doc: WritableSignal => https://angular.dev/api/core/WritableSignal
  readonly configCourante: WritableSignal<ConfigLecture> = signal({ ...CONFIG_LECTURE_DEFAUT });

  // Appelé une seule fois au démarrage — fusionne les défauts avec le [config] de l'app hôte
  // Partial<ConfigLecture> = l'hôte peut ne passer que certains champs
  initialiser(config: Partial<ConfigLecture>): void {
    this.configCourante.set({ ...CONFIG_LECTURE_DEFAUT, ...config });
  }

  // Appelé à chaque interaction utilisateur (slider, bouton toggle...)
  // update() reçoit la valeur courante et retourne la nouvelle — pattern Angular pour modifier un signal
  // set() écraserait tout ; update() permet de fusionner avec l'état actuel
  // doc: signal.update() => https://angular.dev/guide/signals#writable-signals
  mettre(partiel: Partial<ConfigLecture>): void {
    this.configCourante.update(courant => {
      const fusion = { ...courant, ...partiel };
      // clamp() sur tous les champs numériques — empêche les sliders de produire des valeurs absurdes
      // les booléens et strings ne sont pas clampés (TypeScript les valide déjà à la compilation)
      return {
        ...fusion,
        taillePolicePx: clamp(fusion.taillePolicePx, 16, 24),
        interligne: clamp(fusion.interligne, 1.4, 1.8),
        largeurColonneCh: clamp(fusion.largeurColonneCh, 45, 90),
        niveauZoom: clamp(fusion.niveauZoom, 0.5, 2.0),
        brightness: clamp(fusion.brightness, 0, 200),
        contrast: clamp(fusion.contrast, 0, 200),
        sepia: clamp(fusion.sepia, 0, 100),
        superpositionOpacite: clamp(fusion.superpositionOpacite, 0, 1),
      };
    });
  }
}
