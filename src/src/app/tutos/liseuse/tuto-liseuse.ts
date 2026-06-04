import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { LangueService } from '../../shared/services/langue.service';
import { SnippetComponent } from '../../shared/snippet/snippet';
import { SlotComponent } from '../../shared/slot/slot';

// ─────────────────────────────────────────────────────────────────────────────
// TUTO LiseuseManuscritComponent — branche tuto-depart
//
// Ce composant scaffold l'intégration de LiseuseManuscritComponent.
// L'élément manquant intentionnellement : la balise HTML dans le slot.
//
// Pour intégrer :
//   1. npm install ngx-parrecrivains
//   2. Ajouter en haut du fichier :
//        import { LiseuseManuscritComponent } from 'ngx-parrecrivains';
//   3. Ajouter dans imports: [LiseuseManuscritComponent]
//   4. Dans tuto-liseuse.html, dans la zone <!-- SLOT -->, ajouter :
//        <ngx-liseuse-manuscrit [contenu]="contenu()" />
// ─────────────────────────────────────────────────────────────────────────────

const TEXTE_DEFAUT = `Il était une fois, dans une bibliothèque sans fin, une bibliothécaire nommée Élara qui passait ses journées à cataloguer des livres oubliés. Chaque matin, elle ouvrait les grandes portes de bois et laissait entrer la lumière dorée du soleil sur les rangées d'ouvrages poussiéreux.

Un jour, elle découvrit un livre sans titre, sans auteur, dont les pages se tournaient seules. Elle le prit délicatement entre ses mains et commença à lire...`;

const CONTENU_HTML = `<h2>Chapitre 1 — La bibliothèque sans fin</h2>
<p>Il était une fois, dans une <strong>bibliothèque sans fin</strong>, une bibliothécaire nommée Élara.</p>
<blockquote>
  <p>« Les livres sont des portails vers d'autres mondes. »</p>
  <cite>— Élara, bibliothécaire</cite>
</blockquote>
<p>Elle passait ses journées à cataloguer des livres <em>oubliés</em>, chacun portant une histoire endormie.</p>`;

const URL_GDOCS = 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/preview';

@Component({
  selector: 'app-tuto-liseuse',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnippetComponent, SlotComponent],
  templateUrl: './tuto-liseuse.html',
  styleUrl: './tuto-liseuse.scss',
})
export class TutoLiseuseComponent {
  readonly langue = inject(LangueService);

  // Signal pré-câblé — balise <ngx-liseuse-manuscrit> manquante intentionnellement
  readonly contenu = signal<string>(TEXTE_DEFAUT);

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

  testerContenu(type: 'texte' | 'html' | 'gdocs'): void {
    if (type === 'texte') this.contenu.set(TEXTE_DEFAUT);
    else if (type === 'html') this.contenu.set(CONTENU_HTML);
    else this.contenu.set(URL_GDOCS);
  }

  get contenuApercu(): string {
    const c = this.contenu();
    if (c.startsWith('https://')) return `URL : ${c.substring(0, 60)}...`;
    if (c.startsWith('<')) return `HTML : ${c.substring(0, 60)}...`;
    return c.substring(0, 80) + '...';
  }
}
