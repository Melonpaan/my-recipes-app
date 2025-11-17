/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
type IngredientsListRequest = import('../shared/ipc').IngredientsListRequest
type IngredientsListResponse = import('../shared/ipc').IngredientsListResponse
type IngredientCreateRequest = import('../shared/ipc').IngredientCreateRequest
type IngredientCreateResponse = import('../shared/ipc').IngredientCreateResponse
type IngredientUpdateRequest = import('../shared/ipc').IngredientUpdateRequest
type IngredientDeleteRequest = import('../shared/ipc').IngredientDeleteRequest
type UnitsListRequest = import('../shared/ipc').UnitsListRequest
type UnitsListResponse = import('../shared/ipc').UnitsListResponse
type CategoriesListRequest = import('../shared/ipc').CategoriesListRequest
type CategoriesListResponse = import('../shared/ipc').CategoriesListResponse
type CategoryCreateRequest = import('../shared/ipc').CategoryCreateRequest
type CategoryCreateResponse = import('../shared/ipc').CategoryCreateResponse
type CategoryUpdateRequest = import('../shared/ipc').CategoryUpdateRequest
type CategoryDeleteRequest = import('../shared/ipc').CategoryDeleteRequest
type RecipesListRequest = import('../shared/ipc').RecipesListRequest
type RecipesListResponse = import('../shared/ipc').RecipesListResponse
type RecipesGetRequest = import('../shared/ipc').RecipesGetRequest
type RecipesGetResponse = import('../shared/ipc').RecipesGetResponse
type RecipesCreateRequest = import('../shared/ipc').RecipesCreateRequest
type RecipesCreateResponse = import('../shared/ipc').RecipesCreateResponse
type RecipesUpdateRequest = import('../shared/ipc').RecipesUpdateRequest
type RecipesDeleteRequest = import('../shared/ipc').RecipesDeleteRequest
type RecipeIngredientsSetRequest = import('../shared/ipc').RecipeIngredientsSetRequest
type IngredientUsageRequest = import('../shared/ipc').IngredientUsageRequest
type IngredientUsageResponse = import('../shared/ipc').IngredientUsageResponse

interface Window {
  api: {
    ingredients: {
      list(req?: IngredientsListRequest): Promise<IngredientsListResponse>
      create(req: IngredientCreateRequest): Promise<IngredientCreateResponse>
      update(req: IngredientUpdateRequest): Promise<{ ok: true }>
      delete(req: IngredientDeleteRequest): Promise<{ ok: true }>
      usage(req: IngredientUsageRequest): Promise<IngredientUsageResponse>
    }
    units: {
      list(req?: UnitsListRequest): Promise<UnitsListResponse>
    }
    categories: {
      list(req?: CategoriesListRequest): Promise<CategoriesListResponse>
      create(req: CategoryCreateRequest): Promise<CategoryCreateResponse>
      update(req: CategoryUpdateRequest): Promise<{ ok: true }>
      delete(req: CategoryDeleteRequest): Promise<{ ok: true }>
    }
    recipes: {
      list(req?: RecipesListRequest): Promise<RecipesListResponse>
      get(req: RecipesGetRequest): Promise<RecipesGetResponse>
      create(req: RecipesCreateRequest): Promise<RecipesCreateResponse>
      update(req: RecipesUpdateRequest): Promise<{ ok: true }>
      delete(req: RecipesDeleteRequest): Promise<{ ok: true }>
      setIngredients(req: RecipeIngredientsSetRequest): Promise<{ ok: true }>
    }
  }
}
