import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
// ✅ Tuto — étape 2 : import ajouté après npm install ngx-parrecrivains
import { LiseuseManuscritComponent } from 'ngx-parrecrivains';
import { LangueService } from '../../shared/services/langue.service';
import { SnippetComponent } from '../../shared/snippet/snippet';
import { SlotComponent } from '../../shared/slot/slot';

// ─────────────────────────────────────────────────────────────────────────────
// TUTO LiseuseManuscritComponent — version complétée (main)
//
// Diff avec tuto-depart :
//   étape 2 → import { LiseuseManuscritComponent }  (ligne ci-dessus)
//   étape 3 → LiseuseManuscritComponent dans imports[] (voir @Component)
//   étape 4 → <ngx-liseuse-manuscrit> dans le template (voir tuto-liseuse.html)
// ─────────────────────────────────────────────────────────────────────────────

const TEXTE_COURT = `Il était une fois, dans une bibliothèque sans fin, une bibliothécaire nommée Élara qui passait ses journées à cataloguer des livres oubliés. Chaque matin, elle ouvrait les grandes portes de bois et laissait entrer la lumière dorée du soleil sur les rangées d'ouvrages poussiéreux.

Un jour, elle découvrit un livre sans titre, sans auteur, dont les pages se tournaient seules. Elle le prit délicatement entre ses mains et commença à lire...`;

const TEXTE_LONG = `${TEXTE_COURT}

Chapitre I

Les premières pages étaient vierges — du moins en apparence. En les tenant sous la lumière oblique du matin, Élara distinguait des traces d'encre sympathique, comme si quelqu'un avait effacé des mots qui refusaient de disparaître tout à fait.

Elle tira sa loupe de la poche de sa veste et se pencha sur le papier. Les lettres, d'abord floues, prirent forme l'une après l'autre : « Ce livre appartient à celui qui sait lire entre les lignes. »

Chapitre II

Trois semaines s'étaient écoulées depuis la découverte du livre sans titre. Élara l'avait feuilleté chaque jour, notant méticuleusement les apparitions et disparitions de texte dans son carnet à spirale. Le phénomène ne suivait aucune logique apparente — sauf une : les mots n'apparaissaient que lorsqu'elle était seule dans la bibliothèque.

Ce mardi matin, alors que les premiers visiteurs n'arriveraient pas avant une heure, elle ouvrit le livre à la page quarante-deux et attendit.`;

const CONTENU_HTML = `<h2>Chapitre I — La bibliothèque sans fin</h2>
<p>Il était une fois, dans une <strong>bibliothèque sans fin</strong>, une bibliothécaire nommée <em>Élara</em>.</p>
<blockquote>
  <p>« Les livres sont des portails vers d'autres mondes. »</p>
  <cite>— Élara, bibliothécaire</cite>
</blockquote>
<p>Elle passait ses journées à cataloguer des livres <em>oubliés</em>, chacun portant une histoire endormie.</p>
<h3>La découverte</h3>
<ul>
  <li>Un livre sans titre</li>
  <li>Sans auteur connu</li>
  <li>Dont les pages se tournaient seules</li>
</ul>`;

// URL Google Docs réelle — lien de partage converti automatiquement en /preview par la lib
const URL_GDOCS = 'https://docs.google.com/document/d/10hqwXRGYZ_GEtnxNM0CSCg7jvsO3FmwhuaqeaibaxME/edit?usp=sharing';

@Component({
  selector: 'app-tuto-liseuse',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ✅ Tuto — étape 3 : LiseuseManuscritComponent ajouté dans imports[]
  imports: [LiseuseManuscritComponent, SnippetComponent, SlotComponent],
  templateUrl: './tuto-liseuse.html',
  styleUrl: './tuto-liseuse.scss',
})
export class TutoLiseuseComponent implements AfterViewInit {
  readonly langue = inject(LangueService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(LiseuseManuscritComponent) private liseuseRef?: LiseuseManuscritComponent;
  readonly liseuseIntegree = signal(false);

  readonly contenu = signal<string | File | null>(TEXTE_COURT);
  readonly chargementPdf = signal(false);
  readonly urlSaisie = signal('');
  readonly codeUrlActuel = computed(() => {
    const url = this.urlSaisie() || 'https://...';
    return `contenu.set('${url}')`;
  });

  ngAfterViewInit(): void {
    this.liseuseIntegree.set(!!this.liseuseRef);
    this.cdr.markForCheck();
  }

  appliquerUrl(): void {
    const url = this.urlSaisie().trim();
    if (url) this.contenu.set(url);
  }

  testerContenu(type: 'texte' | 'long' | 'html' | 'gdocs'): void {
    if (type === 'texte') this.contenu.set(TEXTE_COURT);
    else if (type === 'long') this.contenu.set(TEXTE_LONG);
    else if (type === 'html') this.contenu.set(CONTENU_HTML);
    else this.contenu.set(URL_GDOCS);
  }

  async testerPdf(): Promise<void> {
    this.chargementPdf.set(true);
    try {
      const response = await fetch('mock/manuscrit-exemple.pdf');
      if (!response.ok) throw new Error('Fichier introuvable');
      const blob = await response.blob();
      const fichier = new File([blob], 'manuscrit-exemple.pdf', { type: 'application/pdf' });
      this.contenu.set(fichier);
    } finally {
      this.chargementPdf.set(false);
      this.cdr.markForCheck();
    }
  }

  get contenuApercu(): string {
    const c = this.contenu();
    if (!c) return '(vide)';
    if (c instanceof File) return `PDF : ${c.name}`;
    if (c.startsWith('https://')) return `URL : ${c.substring(0, 55)}...`;
    if (c.startsWith('<')) return `HTML : ${c.substring(0, 55)}...`;
    return c.substring(0, 75) + '...';
  }

  readonly snippetImport = `import { LiseuseManuscritComponent } from 'ngx-parrecrivains';`;

  readonly snippetImportsArray = `@Component({
  imports: [LiseuseManuscritComponent],  // ← ajouter ici
  // ...
})`;

  readonly snippetUsage = `<!-- Dans votre template HTML, dans la zone SLOT : -->
<ngx-liseuse-manuscrit [contenu]="contenu()" />

<!-- Avec métadonnées et config initiale : -->
<ngx-liseuse-manuscrit
  [contenu]="contenu()"
  [titre]="'L\\'archipel des mots'"
  [auteur]="'Camille Tremblay'"
  [langue]="'fr'"
  [config]="{ modeNuit: true, largeurColonneCh: 65 }"
/>`;
}
