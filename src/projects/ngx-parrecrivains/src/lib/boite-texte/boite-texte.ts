import { Component } from '@angular/core';

@Component({
  selector: 'lib-boite-texte',
  standalone: true, // explicite (défaut implicite seulement depuis Angular 20) — compatibilité descendante
  imports: [],
  templateUrl: './boite-texte.html',
  styleUrl: './boite-texte.css',
})
export class BoiteTexte {

}
