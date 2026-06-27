# Backlog — ngx-parrecrivains (site de démo)

Idées et tâches futures pour le site de démonstration.

---

## UX — Pied de page contact anti-spam

Ajouter un pied de page invitant les visiteurs à contacter Maive pour des commentaires ou problèmes.
Le courriel doit être protégé contre les bots (pas d'adresse en clair dans le HTML).

Options techniques :
- Encodage CSS (`content:` via `::before` / `::after`)
- Formulaire de contact (sans exposer le courriel)
- Adresse obfusquée en JS (dernier recours)
