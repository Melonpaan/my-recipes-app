# Recipe Manager

Application desktop de gestion de recettes et d'ingrédients développée avec Electron, React, TypeScript et Prisma.

## Prérequis

- Node.js 18+ (recommandé 20+)
- MySQL 5.7+ ou 8.0+
- npm 8+

## Installation

```bash
# Installer les dépendances
npm install

# Configurer la base de données
cp .env.example .env
# Éditer .env avec vos informations MySQL

# Ajouter les unités de mesure par défaut
npm run db:seed

# Générer le client Prisma
npx prisma generate

# Lancer l'application
npm run dev
```

## Scripts

- `npm run dev` - Démarre l'application en mode développement
- `npm run build` - Build pour la production
- `npm run lint` - Vérifie le code avec ESLint

## Architecture

```
my-recipes-app/
├── electron/                        # Backend (Main Process)
│   ├── application/
│   │   ├── errors/
│   │   │   ├── AppError.ts         # Gestion d'erreurs unifiée
│   │   │   └── index.ts
│   │   └── usecases/               # Logique métier
│   │       ├── recipes/
│   │       │   ├── listRecipes.ts
│   │       │   ├── getRecipe.ts
│   │       │   └── createRecipe.ts
│   │       ├── ingredients/
│   │       │   ├── listIngredients.ts
│   │       │   ├── createIngredient.ts
│   │       │   ├── updateIngredient.ts
│   │       │   ├── deleteIngredient.ts
│   │       │   └── usageIngredient.ts
│   │       ├── units/
│   │       │   └── listUnits.ts
│   │       └── categories/
│   │           └── listCategories.ts
│   ├── infra/
│   │   └── repositories/           # Accès aux données
│   │       ├── recipeRepo.ts
│   │       ├── ingredientRepo.ts
│   │       ├── unitRepo.ts
│   │       └── categoryRepo.ts
│   ├── ipc/
│   │   └── registerHandlers.ts    # Enregistrement handlers IPC
│   ├── db/
│   │   └── prisma.ts              # Client Prisma
│   ├── main/
│   │   └── index.ts               # Point d'entrée Electron
│   └── preload/
│       └── index.ts               # Preload script (window.api)
│
├── src/                            # Frontend (Renderer Process)
│   ├── features/
│   │   ├── ingredients/
│   │   │   ├── IngredientsPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useIngredients.ts
│   │   │   │   └── useIngredientsQuery.ts
│   │   │   └── components/
│   │   │       ├── index.ts
│   │   │       ├── IngredientsFilters.tsx
│   │   │       ├── IngredientsTable.tsx
│   │   │       └── IngredientForm.tsx
│   │   └── recipes/
│   │       ├── RecipesPage.tsx
│   │       ├── hooks/
│   │       │   ├── useRecipes.ts
│   │       │   └── useRecipesQuery.ts
│   │       └── components/
│   │           ├── index.ts
│   │           └── RecipeForm.tsx
│   ├── components/                 # Composants partagés
│   │   ├── AppShell.tsx
│   │   └── Toaster.tsx
│   ├── ipc/
│   │   └── api.ts                 # Wrapper window.api
│   ├── lib/
│   │   └── react-query.ts         # Config React Query
│   ├── App.tsx
│   └── main.tsx
│
├── shared/                         # Code partagé Main/Renderer
│   └── ipc.ts                     # Contrats IPC (channels + DTOs)
│
├── prisma/
│   └── schema.prisma              # Modèle de données MySQL
│
└── package.json
```

**Flux de données :** Component → Hook → React Query → IPC → Use Case → Repository → Prisma → MySQL

## Stack Technique

**Backend**
- Electron 30.0
- Prisma 6.18 (ORM)
- Zod 4.1 (Validation)
- TypeScript 5.2

**Frontend**
- React 18.2
- React Query (TanStack Query)
- Tailwind CSS 4.1
- TypeScript 5.2

**Build**
- Vite 5.1
- Electron Builder 24.13
- ESLint 8.57

## Principes d'Architecture

### Backend (Clean Architecture)

- **Use Cases** : Validation (Zod) + logique métier
- **Repositories** : Accès aux données via Prisma
- **AppError** : Gestion d'erreurs unifiée
- **Types stricts** : Pas de `any`, utilisation de `Prisma.XWhereInput`

### Frontend (Feature-Based)

- **Hooks personnalisés** : Séparation logique/présentation
- **React Query** : Cache et state management
- **Composants atomiques** : Réutilisables avec props typées
- **Feature folders** : Organisation par domaine métier

## Sécurité Electron

- Context Isolation : `true`
- Node Integration : `false`
- Sandbox : `true`
- IPC typé via `shared/ipc.ts`

