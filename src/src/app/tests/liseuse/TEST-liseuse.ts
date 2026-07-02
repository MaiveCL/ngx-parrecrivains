// FICHIER TEMPORAIRE — SUPPRIMER AVANT PUBLICATION
// Sert uniquement à tester visuellement LiseuseManuscritComponent (ngx-parrecrivains)

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { LiseuseManuscritComponent } from 'ngx-parrecrivains';
import type { ConfigLecture } from 'ngx-parrecrivains';

// ── Données de test ──────────────────────────────────────────────────────────

const TEXTE_COURT = `La forêt s'étendait à perte de vue, silencieuse et froide.
Trois corbeaux tournoyaient au-dessus des épinettes noires.
Le vent avait cessé. Le ciel avait l'épaisseur du gel.
Marguerite referma le livre.`;

const HTML_FORMATTE = `<h1>Le manuscrit perdu</h1>
<p>C'était une <strong>nuit d'octobre</strong>, froide et sans étoiles, quand <em>Marguerite</em> posa la main sur la vieille porte de chêne.</p>
<h2>Chapitre premier — L'arrivée</h2>
<p>Le village de <strong>Saint-Léon-de-Maskinongé</strong> dormait depuis longtemps lorsqu'elle entendit le premier <em>craquement</em> du parquet ciré.</p>
<ul>
  <li>Une valise de cuir brun, usée aux coins</li>
  <li>Un carnet à reliure rouge, à moitié rempli</li>
  <li>Une lettre non ouverte, à son nom</li>
</ul>
<blockquote>« Je n'ai jamais regretté d'être venue, » écrirait-elle des années plus tard.</blockquote>
<p>La lampe à huile projetait des ombres longues sur les murs. <em>Quelque chose</em> attendait dans cette maison.</p>`;

const TEXTE_LONG = `BELLE-RIVIÈRE
Roman de Joëlle Arsenault-Turcot

*

I.

La route 155 longe le Saint-Maurice sur cent kilomètres avant que la forêt s'ouvre enfin sur le village de Belle-Rivière. En hiver, les épinettes portent la neige comme des vieillards courbés sous un fardeau trop lourd. En été, le fleuve resplendit d'une lumière cuivrée que nulle photographie ne rend fidèlement.

C'est là qu'Étienne revint, après dix-sept ans d'absence, avec sa petite valise de toile et sa mauvaise conscience.

*

La maison de son père était restée presque intacte. La galerie avait pourri d'un côté — le côté nord, celui que le soleil n'atteignait jamais vraiment. La peinture s'écaillait sur les bardeaux comme une vieille peau. Mais la porte tenait encore, et les fenêtres aussi.

Étienne déposa sa valise sur le perron. Il n'avait pas de clé. Il avait perdu la clé en 2008, dans un appartement de Montréal qu'il ne se rappelait plus exactement. Il avait perdu beaucoup de choses en 2008.

Il fit le tour de la maison. La porte de la remise n'était pas verrouillée — elle ne l'avait jamais été. Son père ne croyait pas aux serrures. « Ceux qui veulent entrer entrent quand même. Et les autres, t'as pas besoin de les garder dehors. »

*

II.

Dans le village, les visages avaient vieilli, mais les prénoms étaient restés pareils. Ghislain au dépanneur. Agathe à la caisse. Le vieux Réjean sur son perron, qui fumait sa pipe comme si le temps n'avait jamais bougé.

Seule la pharmacie avait changé — une chaîne nationale avait avalé l'ancienne pharmacie Brunet. Ça, ça avait choqué tout le monde. Même Étienne, qui pourtant avait quitté ce village pour ne plus jamais y penser.

Il s'arrêta devant l'ancienne librairie. La vitrine était vide maintenant, les lettres dorées encore lisibles malgré le papier journal collé à l'intérieur : LIBRAIRIE DES DEUX-RIVES. La librairie de sa mère.

Sa mère était morte en mars. C'est pour ça qu'il était revenu.

*

III.

Il y avait des boîtes partout dans la librairie. Des boîtes de livres que personne n'avait eu le cœur de défaire, d'emporter, ou de jeter. Sa mère gardait tous les livres qu'on lui rapportait — même les romans Harlequin débrochés, même les dictionnaires des années quatre-vingt avec les pages cornées. « Un livre, c'est un livre. Tu sais pas qui en aura besoin. »

Étienne s'assit sur une caisse de bois. Il prit le premier livre qui lui tomba sous la main : un recueil de poésie d'Anne Hébert, édition de 1970, couverture cartonnée bleu pâle. Il l'ouvrit au hasard.

Les grandes fontaines pleurent doucement dans les jardins de mon âge.

Il referma le livre. Sa gorge était serrée d'une façon qu'il n'avait pas anticipée.

*

IV.

Le soir, il mangea seul à la cabane à patates frites au bord de l'eau — la même depuis quarante ans. Le Saint-Maurice coulait noir sous les dernières lueurs du couchant. Deux hérons immobiles regardaient l'eau.

Une femme s'assit à la table voisine sans lui demander la permission. Elle avait peut-être cinquante ans, des cheveux gris coupés court, et l'air de quelqu'un qui n'a pas besoin qu'on lui explique les choses.

— T'es le fils de Colette, dit-elle. C'était pas une question.

— Oui.

— Je suis Mariette Deschamps. J'ai travaillé avec ta mère pendant douze ans.

Étienne posa sa fourchette.

— Elle m'a parlé de vous.

— Je sais. Elle m'a parlé de toi aussi.

Il y eut un silence qui n'était pas désagréable. Le fleuve coulait. Les hérons ne bougeaient pas.

— Tu restes combien de temps ? demanda Mariette.

— Je sais pas encore.

Elle hocha la tête, comme si c'était la bonne réponse.`;

// File avec extension inconnue → FormatContenuService retourne 'inconnu' → FORMAT_NON_SUPPORTE
const FICHIER_FORMAT_INCONNU = new File(
  ['données binaires non reconnues'],
  'archive.xyz',
  { type: 'application/octet-stream' }
);

// ── Définition des cas de test ───────────────────────────────────────────────

interface CasTest {
  id: number;
  label: string;
  description: string;
}

// ── Composant ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-test-liseuse',
  imports: [LiseuseManuscritComponent],
  templateUrl: './TEST-liseuse.html',
  styleUrl: './TEST-liseuse.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TESTLiseuseComponent {
  readonly casList: CasTest[] = [
    { id: 0, label: 'Texte brut court',      description: 'texte-brut · court' },
    { id: 1, label: 'HTML formaté',           description: 'html · titres, listes, citation' },
    { id: 2, label: 'Texte long fictif',      description: 'texte-brut · scroll + progression' },
    { id: 3, label: 'PDF',                    description: 'Sélectionner un fichier .pdf local' },
    { id: 4, label: 'URL Google Docs',        description: 'url-google-docs · iframe preview' },
    { id: 5, label: 'Contenu vide',           description: '→ erreur CONTENU_VIDE' },
    { id: 6, label: 'Format non supporté',    description: '→ erreur FORMAT_NON_SUPPORTE' },
    { id: 7, label: 'Mode nuit',              description: 'config: modeNuit = true' },
    { id: 8, label: 'Config personnalisée',   description: 'police 22px, colonne 55ch, interligne 1.8' },
  ];

  readonly casCourant    = signal<number>(0);
  readonly fichierPdf    = signal<File | null>(null);
  readonly urlGoogleDocs = signal<string>('');
  readonly progression   = signal<number>(0);
  readonly tempsActif    = signal<number>(0);

  readonly casCourantInfo = computed(() => this.casList[this.casCourant()]);

  readonly contenuActif = computed<string | File | null>(() => {
    switch (this.casCourant()) {
      case 0: return TEXTE_COURT;
      case 1: return HTML_FORMATTE;
      case 2: return TEXTE_LONG;
      case 3: return this.fichierPdf();
      case 4: return this.urlGoogleDocs() || null;
      case 5: return null;
      case 6: return FICHIER_FORMAT_INCONNU;
      case 7: return TEXTE_COURT;
      case 8: return TEXTE_LONG;
      default: return null;
    }
  });

  readonly titreActif = computed<string | undefined>(() => {
    switch (this.casCourant()) {
      case 1: return 'Le manuscrit perdu';
      case 2:
      case 8: return 'Belle-Rivière';
      default: return undefined;
    }
  });

  readonly auteurActif = computed<string | undefined>(() => {
    switch (this.casCourant()) {
      case 1: return 'Auteure fictive';
      case 2:
      case 8: return 'Joëlle Arsenault-Turcot';
      default: return undefined;
    }
  });

  readonly configActif = computed<Partial<ConfigLecture>>(() => {
    switch (this.casCourant()) {
      case 7: return { modeNuit: true };
      case 8: return { taillePolicePx: 22, largeurColonneCh: 55, interligne: 1.8 };
      default: return {};
    }
  });

  selectionner(id: number): void {
    this.casCourant.set(id);
    this.progression.set(0);
    this.tempsActif.set(0);
  }

  onPdfChoisi(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fichierPdf.set(input.files?.[0] ?? null);
  }

  onUrlChange(event: Event): void {
    this.urlGoogleDocs.set((event.target as HTMLInputElement).value.trim());
  }

  formaterTemps(secondes: number): string {
    const m = Math.floor(secondes / 60).toString().padStart(2, '0');
    const s = Math.floor(secondes % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}
