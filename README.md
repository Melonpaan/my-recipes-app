# Recipe Manager (Electron + React + TypeScript + Prisma + Tailwind)

Application desktop pour gérer recettes et ingrédients. Sécurité Electron (contextIsolation, sandbox), Prisma côté Main uniquement, IPC typé, Tailwind côté Renderer.

## Prérequis
- Node.js 18+ (recommandé 20+)
- MySQL accessible
- npm

## Installation
```bash
npm install
cp .env.example .env   # puis édite DATABASE_URL
npm run dev
```

## Scripts
- `npm run dev`        → démarre Vite + Electron en dev
- `npm run build`      → type-check + build Vite + package Electron (electron-builder)
- `npm run lint`       → ESLint
- `postinstall`        → `prisma generate`

## Architecture
- `electron/` → Main (orchestration, IPC, Prisma), Preload (window.api)
- `shared/`   → contrats IPC (canaux + DTO)
- `src/`      → Renderer (React + Tailwind)
- `prisma/`   → schema.prisma
- `dist-electron/` et `dist/` → artefacts de build (ignorés)

## Sécurité (Renderer)
- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
- IPC typé via `shared/ipc.ts`
- Prisma utilisé uniquement dans le Main

## Build (packaging)
```bash
npm run build
# artefacts dans release/ (electron-builder)
```

## Tests rapides via DevTools (Renderer)
```js
await window.api.ingredients.list({ page:1, pageSize:20 })
```
