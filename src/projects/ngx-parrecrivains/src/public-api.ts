/*
 * Public API Surface of ngx-parrecrivains
 */

// export * from './lib/ngx-parrecrivains'; // export par défaut, ce composant est aussi factice.
// export * from './lib/boite-texte/boite-texte'; // composant factice — référence flux lib → app

export * from './lib/liseuse-manuscrit/liseuse-manuscrit';
export * from './lib/mots/mots.pipe';
export * from './lib/temps-lecture/temps-lecture.service';
export * from './lib/isbn/isbn.validator';
export * from './lib/types/liseuse.types';
export { TRANSLATE_SERVICE_TOKEN } from './lib/liseuse-manuscrit/services/traduction';
export type { TranslateServiceLike } from './lib/liseuse-manuscrit/services/traduction';
