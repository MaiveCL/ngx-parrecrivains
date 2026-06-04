import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
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
//
// Sans la balise dans le template, le slot restait vide.
// Avec la balise : la liseuse s'affiche et réagit aux boutons de test.
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
  // ✅ Tuto — étape 3 : LiseuseManuscritComponent ajouté dans imports[]
  // Dans tuto-depart, imports[] ne contenait que SnippetComponent et SlotComponent
  imports: [LiseuseManuscritComponent, SnippetComponent, SlotComponent],
  templateUrl: './tuto-liseuse.html',
  styleUrl: './tuto-liseuse.scss',
})
export class TutoLiseuseComponent {
  readonly langue = inject(LangueService);

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
