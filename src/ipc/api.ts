import type {
  IngredientsListRequest,
  IngredientsListResponse,
  IngredientCreateRequest,
  IngredientCreateResponse,
  IngredientUpdateRequest,
  IngredientDeleteRequest,
  IngredientUsageRequest,
  IngredientUsageResponse,
  UnitsListRequest,
  UnitsListResponse,
  CategoriesListRequest,
  CategoriesListResponse,
  RecipesListRequest,
  RecipesListResponse,
  RecipesCreateRequest,
  RecipesCreateResponse,
} from '../../shared/ipc'

export const api = {
  ingredients: {
    list: (req?: IngredientsListRequest) => window.api.ingredients.list(req) as Promise<IngredientsListResponse>,
    create: (req: IngredientCreateRequest) => window.api.ingredients.create(req) as Promise<IngredientCreateResponse>,
    update: (req: IngredientUpdateRequest) => window.api.ingredients.update(req) as Promise<{ ok: true }>,
    delete: (req: IngredientDeleteRequest) => window.api.ingredients.delete(req) as Promise<{ ok: true }>,
    usage: (req: IngredientUsageRequest) => window.api.ingredients.usage(req) as Promise<IngredientUsageResponse>,
  },
  units: {
    list: (req?: UnitsListRequest) => window.api.units.list(req) as Promise<UnitsListResponse>,
  },
  categories: {
    list: (req?: CategoriesListRequest) => window.api.categories.list(req) as Promise<CategoriesListResponse>,
  },
  recipes: {
    list: (req?: RecipesListRequest) => window.api.recipes.list(req) as Promise<RecipesListResponse>,
    create: (req: RecipesCreateRequest) => window.api.recipes.create(req) as Promise<RecipesCreateResponse>,
  },
} as const
