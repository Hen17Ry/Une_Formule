# Une Formule — uneformule.com

Plateforme du livre **Une Formule… 7 leviers pour construire la vie que vous désirez** de Dieudonné Sossa Gossou.

- Site vitrine animé (modèle 3D du livre piloté au scroll, GSAP + Lenis), thème clair aux couleurs de la couverture.
- **Retours des lecteurs** : un formulaire par levier (7) + un retour général, selon le document de contenu.
- **Espace admin** (`/admin`) : modération des avis (visible / masqué, extrait public, mise en avant), commandes, réglages de vente.
- **Commande en ligne** avec **KkiaPay** (Mobile Money MTN / Moov / Celtiis, carte bancaire), prix et mode *précommande / disponible* réglables dans l’admin.

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

Voir `.env.example`. En production, **obligatoires** : `DATABASE_URL`, `NUXT_SESSION_PASSWORD`, `NUXT_ADMIN_EMAIL`, `NUXT_ADMIN_PASSWORD`, et les clés KkiaPay.

> Sécurité : l’ancien compte admin par défaut (mot de passe publié dans le dépôt) n’est plus accepté.
> Seuls les mots de passe définis via `NUXT_ADMIN_PASSWORD` (hachés en scrypt) permettent la connexion.

## Paiement KkiaPay

1. Le client remplit le formulaire → `POST /api/orders` crée la commande (statut `PENDING`).
2. Le widget KkiaPay s’ouvre avec le montant en FCFA et la référence `UF-…`.
3. Au succès, `POST /api/orders/:ref/confirm` **vérifie la transaction côté serveur** auprès de KkiaPay (statut, montant) puis passe la commande en `PAID`.
4. Filet de sécurité : le webhook `POST /api/payments/kkiapay/webhook` (en-tête `x-kkiapay-secret`) fait la même vérification si le navigateur s’est fermé.

Tester d’abord avec `NUXT_PUBLIC_KKIAPAY_SANDBOX=true` et les clés *sandbox*.

## Données

Tables créées automatiquement au démarrage : `reviews`, `orders`, `settings`, `events`, `admin_users`.
Les avis de l’ancienne table `testimonials` sont repris une fois dans `reviews` (retour général).
Un lecteur qui a répondu « Non » à la question de citation ne peut jamais être publié.

## Contenu

Tout le texte éditorial (leviers, extraits, Q/R, biographie, questions des formulaires) est centralisé dans `app/data/book.ts`.
