import { Injectable } from '@angular/core';
import { FormatContenu } from '../../types/liseuse.types';

@Injectable({ providedIn: 'root' })
export class FormatContenuService {

  // Point d'entrée public — reçoit n'importe quoi et retourne un FormatContenu
  // doc: instanceof => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/instanceof
  detecter(contenu: string | File | null): FormatContenu {
    if (contenu === null) return 'inconnu';

    if (contenu instanceof File) {
      return this._detecterFichier(contenu);
    }

    return this._detecterChaine(contenu);
  }

  // Convertit un lien Google Docs /edit en /preview pour pouvoir l'embarquer en iframe
  // /edit ne peut pas être chargé dans une iframe — Google Docs l'interdit
  // doc: String.replace avec regex => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/replace
  urlPreview(url: string): string {
    return url.replace(/\/edit(\?.*)?$/, '/preview$1').replace(/\/edit(#.*)?$/, '/preview$1');
  }

  // Détection par type MIME d'abord (fiable), extension en fallback (le MIME peut être absent)
  // Le MIME est déterminé par le navigateur à partir du contenu réel du fichier — pas l'extension
  // => renommer virus.exe en virus.pdf ne trompe pas le MIME, mais trompe l'extension
  // Risque acceptable : une mauvaise classification => mauvais mode d'affichage, jamais d'exécution
  // TODO-REVIEW: V2 — supprimer le fallback extension, se fier au MIME uniquement
  // Cas où MIME est vide : drag & drop Linux, formats rares (ODT/RTF/EPUB), File créé sans type
  // Voir BACKLOG.md — FormatContenuService V2
  // doc: File.type (MIME) => https://developer.mozilla.org/fr/docs/Web/API/File/type
  // doc: types MIME => https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/MIME_types/Common_types
  private _detecterFichier(fichier: File): FormatContenu {
    const mime = fichier.type.toLowerCase();
    // .pop()? => prend la dernière partie après le dernier point ("fichier.min.pdf" => "pdf")
    // ?. protège si le nom n'a pas de point (pas d'extension)
    const ext = fichier.name.split('.').pop()?.toLowerCase() ?? '';

    if (mime === 'application/pdf' || ext === 'pdf') return 'pdf';
    if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === 'docx') return 'docx';
    if (mime === 'application/vnd.oasis.opendocument.text' || ext === 'odt') return 'odt';
    if (mime === 'application/rtf' || mime === 'text/rtf' || ext === 'rtf') return 'rtf';
    if (mime === 'application/epub+zip' || ext === 'epub') return 'epub';
    if (mime === 'text/plain' || ext === 'txt' || ext === 'md') return 'texte-brut';

    return 'inconnu';
  }

  private _detecterChaine(contenu: string): FormatContenu {
    // new URL() lance une exception si la chaîne n'est pas une URL valide
    // => try/catch = façon standard de tester si c'est une URL en JavaScript
    // doc: new URL() => https://developer.mozilla.org/fr/docs/Web/API/URL/URL
    // doc: try/catch => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/try...catch
    try {
      const url = new URL(contenu);
      const h = url.hostname;

      // Sécurité : https: obligatoire — bloque http:// et javascript:// sur un domaine légitime
      if (url.protocol !== 'https:') return 'texte-brut';

      // Sécurité : vérification par hostname exact (pas includes())
      // includes() vulnérable au bypass : "malveillant.docs.google.com.evil.com" passerait
      // doc: URL.hostname => https://developer.mozilla.org/fr/docs/Web/API/URL/hostname
      if (h === 'docs.google.com' || h.endsWith('.docs.google.com')) return 'url-google-docs';
      if (h === 'onedrive.live.com' || h === '1drv.ms' || h.endsWith('.onedrive.live.com')) return 'url-onedrive';
    } catch {
      // contenu non-URL (texte brut ou HTML) — continuer avec la détection de contenu
    }

    // Détecte une balise HTML ouvrante — si présente, c'est du HTML
    // doc: RegExp => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/RegExp
    if (/<[a-z][\s\S]*>/i.test(contenu)) return 'html';
    return 'texte-brut';
  }
}
