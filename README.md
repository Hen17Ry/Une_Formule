# Une Formule — uneformule.com

Plateforme du livre **Une Formule… 7 leviers pour construire la vie que vous désirez** de Dieudonné Sossa Gossou.

- Site vitrine animé (modèle 3D du livre piloté au scroll, GSAP + Lenis), thème clair aux couleurs de la couverture.
- **Retours des lecteurs** : un formulaire par levier (7) + un retour général, selon le document de contenu.
- **Espace admin** (`/admin`) : modération des avis (visible / masqué, extrait public, mise en avant), liens « Où trouver le livre », contact et ISBN.
- **Où trouver le livre** : un bouton par plateforme de vente (les commandes se font sur ces plateformes).

## Stack

Nuxt 4 · Vue 3 · Tailwind CSS · GSAP (ScrollTrigger, SplitText) · Lenis · three.js · Drizzle ORM + PostgreSQL · Zod.

## Démarrer en local

```bash
pnpm install
cp .env.example .env   # puis compléter
pnpm dev               # http://localhost:3000
```

Sans `DATABASE_URL`, les données sont écrites dans `.data/une-formule.json` (développement uniquement).
`docker compose up -d postgres` lance une base PostgreSQL locale (port 5437).

## Variables d’environnement

Voir `.env.example`. En production : `DATABASE_URL` (type *Secret* sur Vercel).

## Comptes administrateurs

Les comptes sont **dans la base** (table `admin_users`, mots de passe hachés en scrypt). La connexion vérifie l’email et le mot de passe en base ; aucun identifiant n’est lu dans le `.env`.

Créer le premier compte, ou réinitialiser un mot de passe :

```bash
DATABASE_URL="postgres://…" pnpm admin:create vous@exemple.com "un-mot-de-passe-solide"
```

Sans accès direct à la base : ajouter la variable `ADMIN_SETUP_TOKEN` (16 caractères min.) sur Vercel, redéployer, ouvrir `/admin/setup`, puis supprimer la variable.

Ensuite, depuis `/admin/acces` : changer son mot de passe, ajouter ou retirer des administrateurs.

> L’ancien mot de passe par défaut (publié dans le dépôt) est refusé. Les autres mots de passe de l’ancien site
> restent valables et sont re-chiffrés en scrypt à la première connexion.


## Données

Tables créées automatiquement au démarrage : `reviews`, `settings`, `events`, `admin_users`.
Les avis de l’ancienne table `testimonials` sont repris une fois dans `reviews` (retour général).
Un lecteur qui a répondu « Non » à la question de citation ne peut jamais être publié.

## Contenu

Tout le texte éditorial (leviers, extraits, Q/R, biographie, questions des formulaires) est centralisé dans `app/data/book.ts`.
