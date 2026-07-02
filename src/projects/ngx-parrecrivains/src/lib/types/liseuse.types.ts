export type FormatContenu =
  | 'texte-brut'
  | 'html'
  | 'pdf'
  | 'docx'
  | 'odt'
  | 'rtf'
  | 'epub'
  | 'url-google-docs'
  | 'url-onedrive'
  | 'inconnu';

export type ModeAffichage = 'optimise' | 'natif';

// ConfigLecture et CONFIG_LECTURE_DEFAUT sont volontairement séparés :
// - l'interface est un outil TypeScript (compile-time seulement, disparaît dans le JS final)
// - la constante existe au runtime et sert à la fusion avec le config partiel de l'app hôte :
//   { ...CONFIG_LECTURE_DEFAUT, ...configPasseParHote } => merge champ par champ
// => Partial<ConfigLecture> permet à l'hôte de ne passer que certains champs
// doc: Partial<T> => https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
// doc: spread operator => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax
export interface ConfigLecture {
  taillePolicePx: number;
  interligne: number;
  largeurColonneCh: number;
  modeNuit: boolean;
  brightness: number;
  contrast: number;
  sepia: number;
  superpositionOpacite: number;
  superpositionCouleur: 'noir' | 'blanc';
  niveauZoom: number;
  modePagination: boolean;
  pleinEcran: boolean;
  panneauInfoVisible: boolean;
}

// Valeurs par défaut — fusionnées avec le Partial<ConfigLecture> de l'hôte dans le composant
export const CONFIG_LECTURE_DEFAUT: ConfigLecture = {
  taillePolicePx: 18,
  interligne: 1.6,
  largeurColonneCh: 70,
  modeNuit: false,
  brightness: 100,
  contrast: 100,
  sepia: 0,
  superpositionOpacite: 0,
  superpositionCouleur: 'noir',
  niveauZoom: 1.0,
  modePagination: false,
  pleinEcran: false,
  panneauInfoVisible: false,
};

export interface EtatLecture {
  progressionPourcent: number;
  pageActuelle: number;
  totalPages: number;
  totalMots: number;
  tempsLectureActif: number;
}

export interface ErreurLiseuse {
  code: CodeErreurLiseuse;
  messageI18nKey: string;
}

export type CodeErreurLiseuse =
  | 'FORMAT_NON_SUPPORTE'
  | 'CONTENU_VIDE'
  | 'ACCES_PRIVE'
  | 'LANGUE_NON_SUPPORTEE';

export type LangueSupported = 'fr' | 'en' | 'cr';

export const LANGUES_SUPPORTEES: LangueSupported[] = ['fr', 'en', 'cr'];
export const LANGUE_DEFAUT: LangueSupported = 'fr';
