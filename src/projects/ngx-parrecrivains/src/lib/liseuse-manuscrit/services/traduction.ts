// doc: InjectionToken => https://angular.dev/api/core/InjectionToken
// doc: inject() avec optional => https://angular.dev/api/core/inject
import { inject, Injectable, InjectionToken } from '@angular/core';
import { LangueSupported, LANGUE_DEFAUT } from '../../types/liseuse.types';

// Interface minimale de ngx-translate — on ne l'importe pas directement pour ne pas forcer
// tout le monde à installer ngx-translate. L'app hôte peut fournir son propre service si elle le veut.
// doc: ngx-translate => https://github.com/ngx-translate/core
export interface TranslateServiceLike {
  instant(key: string): string;
}

// Token d'injection optionnel — identifiant unique pour retrouver le service dans le système DI
// L'app hôte le fournit dans app.config.ts si elle utilise ngx-translate, sinon on ignore
// doc: InjectionToken => https://angular.dev/api/core/InjectionToken
export const TRANSLATE_SERVICE_TOKEN = new InjectionToken<TranslateServiceLike>('TRANSLATE_SERVICE');

type TableNoeud = Record<string, unknown>;

// Table de traductions interne — 3 niveaux : langue → section → clé → valeur
// Clé d'accès : 'liseuse.controles.mode_nuit' => TRADUCTIONS['fr']['liseuse']['controles']['mode_nuit']
const TRADUCTIONS: Record<LangueSupported, TableNoeud> = {
  fr: {
    liseuse: {
      panneau: { titre: 'Informations', fermer: 'Fermer le panneau d\'informations', ouvrir: 'Ouvrir le panneau d\'informations', infos: 'Infos', aria_lateral: 'Informations sur le manuscrit' },
      controles: {
        mode_nuit: 'Mode nuit', taille_police: 'Taille de police', interligne: 'Interligne',
        largeur_colonne: 'Largeur de colonne', luminosite: 'Luminosité', contraste: 'Contraste',
        sepia: 'Sépia', superposition: 'Superposition', zoom: 'Zoom',
        plein_ecran: 'Plein écran', quitter_plein_ecran: 'Quitter le plein écran',
        pagination: 'Pagination', page: 'Page', page_sur: 'sur',
        precedent: 'Page précédente', suivant: 'Page suivante',
        couleur_superposition: 'Couleur', noir: 'Noir', blanc: 'Blanc',
      },
      info: { mots: 'mots', temps_estime: 'Temps de lecture estimé', temps_actif: 'Temps de lecture actif', progression: 'Progression' },
      erreur: { format_non_supporte: 'Format non supporté', contenu_vide: 'Aucun manuscrit', acces_prive: 'Document privé ou inaccessible' },
    },
  },
  en: {
    liseuse: {
      panneau: { titre: 'Information', fermer: 'Close information panel', ouvrir: 'Open information panel', infos: 'Info', aria_lateral: 'Manuscript information' },
      controles: {
        mode_nuit: 'Night mode', taille_police: 'Font size', interligne: 'Line spacing',
        largeur_colonne: 'Column width', luminosite: 'Brightness', contraste: 'Contrast',
        sepia: 'Sepia', superposition: 'Overlay', zoom: 'Zoom',
        plein_ecran: 'Full screen', quitter_plein_ecran: 'Exit full screen',
        pagination: 'Pagination', page: 'Page', page_sur: 'of',
        precedent: 'Previous page', suivant: 'Next page',
        couleur_superposition: 'Color', noir: 'Black', blanc: 'White',
      },
      info: { mots: 'words', temps_estime: 'Estimated reading time', temps_actif: 'Active reading time', progression: 'Progress' },
      erreur: { format_non_supporte: 'Unsupported format', contenu_vide: 'No manuscript', acces_prive: 'Private or inaccessible document' },
    },
  },
  cr: {
    liseuse: {
      panneau: { titre: 'Tipahikewin', fermer: 'Kiskapihtaw tipahikewin', ouvrir: 'Apit tipahikewin', infos: 'Tipahikewin', aria_lateral: 'Masinahikan tipahikewin' },
      controles: {
        mode_nuit: 'Tipiskawi-mode', taille_police: 'Masinahikewin-ohpikihtâwin', interligne: 'Nistam-askîwin',
        largeur_colonne: 'Akohp-tîpahikan', luminosite: 'Wâsêskwan', contraste: 'Kontrast',
        sepia: 'Sepia', superposition: 'Ohci-asiwatew', zoom: 'Zoom',
        plein_ecran: 'Misiwê-wâpahcikêwin', quitter_plein_ecran: 'Nîkân-wâpahcikêwin',
        pagination: 'Masinahikanis-tipahikewin', page: 'Masinahikanis', page_sur: 'ita',
        precedent: 'Nîkânihk masinahikanis', suivant: 'Otâkosîhk masinahikanis',
        couleur_superposition: 'Ihkwêwâpahcikewin', noir: 'Asinîwâw', blanc: 'Wâpiskisiw',
      },
      info: { mots: 'nêhiyaw-pîkiskwêwina', temps_estime: 'Kîsikohci-pîhcîwin', temps_actif: 'Nîhtâwikiwin-âpatisiwin', progression: 'Nakatohkêwin' },
      erreur: { format_non_supporte: 'Namôya nisitohtâkwan', contenu_vide: 'Namôya masinahikan', acces_prive: 'Kîhci-masinahikan' },
    },
  },
};

@Injectable({ providedIn: 'root' })
export class TraductionService {
  // optional: true => retourne null si l'app hôte ne fournit pas le token, au lieu de planter
  private readonly translateService = inject(TRANSLATE_SERVICE_TOKEN, { optional: true });

  // Priorité : 1) ngx-translate si fourni → 2) table interne langue → 3) fallback français → 4) clé brute
  traduire(cle: string, langue: LangueSupported): string {
    if (this.translateService) {
      const resultat = this.translateService.instant(cle);
      // ngx-translate retourne la clé elle-même si la traduction n'existe pas
      // => si resultat === cle, on bascule sur le fallback interne
      if (resultat && resultat !== cle) return resultat;
    }

    return this._chercher(cle, langue) ?? this._chercher(cle, LANGUE_DEFAUT) ?? cle;
  }

  // Parcourt la table en suivant les segments de la clé pointés par les '.'
  // 'liseuse.controles.mode_nuit' => ['liseuse', 'controles', 'mode_nuit'] => descend nœud par nœud
  private _chercher(cle: string, langue: LangueSupported): string | null {
    const parties = cle.split('.');
    let noeud: unknown = TRADUCTIONS[langue];

    for (const partie of parties) {
      if (noeud === null || typeof noeud !== 'object') return null;
      noeud = (noeud as TableNoeud)[partie];
    }

    return typeof noeud === 'string' ? noeud : null;
  }
}
