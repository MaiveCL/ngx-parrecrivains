// doc: OnDestroy => https://angular.dev/api/core/OnDestroy
import { ElementRef, inject, Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';

// @Injectable() sans providedIn — instance isolée par liseuse (même raison que ConfigLectureService)
@Injectable()
export class ChronomètreLectureService implements OnDestroy {

  // inject(ElementRef).nativeElement => référence à l'élément DOM du composant hôte
  // utilisé par IntersectionObserver pour savoir si la liseuse est visible à l'écran
  // doc: ElementRef => https://angular.dev/api/core/ElementRef
  private readonly _el: HTMLElement = inject(ElementRef).nativeElement;

  // TODO-REVIEW: tempsActif exposé en WritableSignal public — le test en a besoin
  // (svc.tempsActif.set(5)) mais idéalement ce serait readonly vers l'extérieur.
  // Option : exposer readonly tempsActifLecture = tempsActif.asReadonly() et garder
  // WritableSignal privé, mais ça casse le test actuel.
  readonly tempsActif: WritableSignal<number> = signal(0); // secondes de lecture active

  private _actif = !document.hidden; // false si l'onglet est en arrière-plan au démarrage
  // ReturnType<typeof setInterval> = type exact de l'ID retourné par setInterval (varie selon l'env)
  private _intervalle: ReturnType<typeof setInterval> | null = null;
  private _observer: IntersectionObserver | null = null;

  // Stocké comme propriété pour pouvoir le retirer dans ngOnDestroy (même référence requise)
  private readonly _onVisibilityChange = (): void => {
    // document.hidden = true quand l'utilisateur change d'onglet ou minimise la fenêtre
    // doc: document.hidden => https://developer.mozilla.org/fr/docs/Web/API/Document/hidden
    // doc: visibilitychange => https://developer.mozilla.org/fr/docs/Web/API/Document/visibilitychange_event
    this._actif = !document.hidden;
  };

  demarrer(): void {
    if (this._intervalle !== null) return; // protection contre double démarrage

    this._actif = !document.hidden;
    document.addEventListener('visibilitychange', this._onVisibilityChange);

    // IntersectionObserver — détecte si la liseuse est visible à l'écran
    // si l'utilisateur scrolle et que la liseuse disparaît, le chrono s'arrête
    // doc: IntersectionObserver => https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API
    if ('IntersectionObserver' in window) { // vérifie le support navigateur avant utilisation
      this._observer = new IntersectionObserver(
        (entries) => { this._actif = entries[0].intersectionRatio >= 0.5; }, // visible à 50%+ => actif
        { threshold: 0.5 }
      );
      this._observer.observe(this._el);
    }

    // Incrémente tempsActif de 1 chaque seconde, seulement si _actif
    // doc: setInterval => https://developer.mozilla.org/fr/docs/Web/API/setInterval
    this._intervalle = setInterval(() => {
      if (this._actif) this.tempsActif.update(v => v + 1);
    }, 1000);
  }

  // Nettoyage obligatoire — sans ça, setInterval continue de tourner après destruction du composant
  // => fuite mémoire : le compteur tourne indéfiniment même si la liseuse a disparu de la page
  // doc: clearInterval => https://developer.mozilla.org/fr/docs/Web/API/clearInterval
  ngOnDestroy(): void {
    if (this._intervalle !== null) clearInterval(this._intervalle);
    this._observer?.disconnect(); // ?. = optionnel : ne plante pas si _observer est null
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
  }
}
