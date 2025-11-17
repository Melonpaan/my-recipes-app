import { ipcRenderer, contextBridge } from 'electron'
import {
  Channels,
  type IngredientsListRequest,
  type IngredientsListResponse,
  type IngredientCreateRequest,
  type IngredientCreateResponse,
  type IngredientUpdateRequest,
  type IngredientDeleteRequest,
  type UnitsListRequest,
  type UnitsListResponse,
  type CategoriesListRequest,
  type CategoriesListResponse,
  type CategoryCreateRequest,
  type CategoryCreateResponse,
  type CategoryUpdateRequest,
  type CategoryDeleteRequest,
  type RecipesListRequest,
  type RecipesListResponse,
  type RecipesGetRequest,
  type RecipesGetResponse,
  type RecipesCreateRequest,
  type RecipesCreateResponse,
  type RecipesUpdateRequest,
  type RecipesDeleteRequest,
  type RecipeIngredientsSetRequest,
  type IngredientUsageRequest,
  type IngredientUsageResponse,
} from '../../shared/ipc'

// --------- Expose a minimal, typed API to the Renderer process ---------
const api = {
  ingredients: {
    list: (req?: IngredientsListRequest) =>
      ipcRenderer.invoke(Channels.Ingredients_List, req) as Promise<IngredientsListResponse>,
    create: (req: IngredientCreateRequest) =>
      ipcRenderer.invoke(Channels.Ingredients_Create, req) as Promise<IngredientCreateResponse>,
    update: (req: IngredientUpdateRequest) =>
      ipcRenderer.invoke(Channels.Ingredients_Update, req) as Promise<{ ok: true }>,
    delete: (req: IngredientDeleteRequest) =>
      ipcRenderer.invoke(Channels.Ingredients_Delete, req) as Promise<{ ok: true }>,
    usage: (req: IngredientUsageRequest) =>
      ipcRenderer.invoke(Channels.Ingredients_Usage, req) as Promise<IngredientUsageResponse>,
  },
  units: {
    list: (req?: UnitsListRequest) =>
      ipcRenderer.invoke(Channels.Units_List, req) as Promise<UnitsListResponse>,
  },
  categories: {
    list: (req?: CategoriesListRequest) =>
      ipcRenderer.invoke(Channels.Categories_List, req) as Promise<CategoriesListResponse>,
    create: (req: CategoryCreateRequest) =>
      ipcRenderer.invoke(Channels.Categories_Create, req) as Promise<CategoryCreateResponse>,
    update: (req: CategoryUpdateRequest) =>
      ipcRenderer.invoke(Channels.Categories_Update, req) as Promise<{ ok: true }>,
    delete: (req: CategoryDeleteRequest) =>
      ipcRenderer.invoke(Channels.Categories_Delete, req) as Promise<{ ok: true }>,
  },
  recipes: {
    list: (req?: RecipesListRequest) =>
      ipcRenderer.invoke(Channels.Recipes_List, req) as Promise<RecipesListResponse>,
    get: (req: RecipesGetRequest) =>
      ipcRenderer.invoke(Channels.Recipes_Get, req) as Promise<RecipesGetResponse>,
    create: (req: RecipesCreateRequest) =>
      ipcRenderer.invoke(Channels.Recipes_Create, req) as Promise<RecipesCreateResponse>,
    update: (req: RecipesUpdateRequest) =>
      ipcRenderer.invoke(Channels.Recipes_Update, req) as Promise<{ ok: true }>,
    delete: (req: RecipesDeleteRequest) =>
      ipcRenderer.invoke(Channels.Recipes_Delete, req) as Promise<{ ok: true }>,
    setIngredients: (req: RecipeIngredientsSetRequest) =>
      ipcRenderer.invoke(Channels.RecipeIngredients_Set, req) as Promise<{ ok: true }>,
  },
} as const

contextBridge.exposeInMainWorld('api', api)


