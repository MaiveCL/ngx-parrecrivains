import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { FormatContenuService } from './format-contenu';

describe('FormatContenuService', () => {
  let service: FormatContenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatContenuService);
  });

  it('détecte un texte brut', () => {
    expect(service.detecter('Bonjour')).toBe('texte-brut');
  });

  it('détecte du HTML', () => {
    expect(service.detecter('<p>Bonjour</p>')).toBe('html');
  });

  it('détecte une URL Google Docs', () => {
    expect(service.detecter('https://docs.google.com/document/d/X/edit')).toBe('url-google-docs');
  });

  it('transforme /edit en /preview pour Google Docs', () => {
    const url = 'https://docs.google.com/document/d/X/edit';
    expect(service.urlPreview(url)).toBe('https://docs.google.com/document/d/X/preview');
  });

  it('rejette un domaine contenant docs.google.com mais non légitime (bypass par inclusion)', () => {
    expect(service.detecter('https://malveillant.docs.google.com.evil.com/doc')).not.toBe('url-google-docs');
    expect(service.detecter('https://docs.google.com.phishing.ru/doc')).not.toBe('url-google-docs');
  });

  it('détecte une URL OneDrive (onedrive.live.com)', () => {
    expect(service.detecter('https://onedrive.live.com/edit?id=ABC')).toBe('url-onedrive');
  });

  it('détecte une URL OneDrive (1drv.ms)', () => {
    expect(service.detecter('https://1drv.ms/w/s!ABC')).toBe('url-onedrive');
  });

  it('détecte un fichier PDF par MIME', () => {
    const fichier = new File([''], 'doc.pdf', { type: 'application/pdf' });
    expect(service.detecter(fichier)).toBe('pdf');
  });

  it('détecte un fichier DOCX par extension', () => {
    const fichier = new File([''], 'doc.docx');
    expect(service.detecter(fichier)).toBe('docx');
  });

  it('détecte un fichier EPUB par extension', () => {
    const fichier = new File([''], 'livre.epub');
    expect(service.detecter(fichier)).toBe('epub');
  });

  it('retourne inconnu pour un format non supporté', () => {
    const fichier = new File([''], 'data.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    expect(service.detecter(fichier)).toBe('inconnu');
  });

  // Note architecturale : null retourne 'inconnu' au niveau du service (détection de format).
  // La gestion de l'erreur CONTENU_VIDE est responsabilité du composant LiseuseManuscrit,
  // pas du service — séparation intentionnelle des responsabilités.
  it('retourne inconnu pour null', () => {
    expect(service.detecter(null)).toBe('inconnu');
  });

  it('retourne inconnu pour un fichier zip', () => {
    const fichier = new File([''], 'archive.zip', { type: 'application/zip' });
    expect(service.detecter(fichier)).toBe('inconnu');
  });

  // Note architecturale : File(size:0) retourne 'inconnu' (extension inconnue) ou le format
  // détecté. La détection de CONTENU_VIDE pour les fichiers vides est exclusive au composant
  // LiseuseManuscritComponent via erreurActive() — file.size === 0.
  it('retourne inconnu pour un fichier vide sans extension reconnue', () => {
    const fichier = new File([], 'vide.dat');
    expect(service.detecter(fichier)).toBe('inconnu');
  });

  it('détecte un fichier .txt comme texte-brut', () => {
    const fichier = new File(['contenu'], 'notes.txt', { type: 'text/plain' });
    expect(service.detecter(fichier)).toBe('texte-brut');
  });

  it('détecte un fichier .md comme texte-brut', () => {
    const fichier = new File(['# Titre'], 'readme.md');
    expect(service.detecter(fichier)).toBe('texte-brut');
  });
});