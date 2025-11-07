// Central IPC contracts (channels + DTOs) shared between Main and Renderer

export const Channels = {
  App_Ping: 'app:ping',
  Recipes_List: 'recipes:list',
  Recipes_Get: 'recipes:get',
  Recipes_Create: 'recipes:create',
  Recipes_Update: 'recipes:update',
  Recipes_Delete: 'recipes:delete',
  Ingredients_List: 'ingredients:list',
  Ingredients_Create: 'ingredients:create',
  Ingredients_Update: 'ingredients:update',
  Ingredients_Delete: 'ingredients:delete',
  Units_List: 'units:list',
  Categories_List: 'categories:list',
  Ingredients_Usage: 'ingredients:usage',
} as const

export type ChannelName = typeof Channels[keyof typeof Channels]

export interface RecipeDTO {
  id: string
  title: string
  description?: string | null
  prepTime?: number | null
  difficulty?: 'Easy' | 'Medium' | 'Hard' | null
  categoryId: string
  userId?: string | null
  createdAt: string
  updatedAt: string
}

export interface RecipesListRequest {
  page?: number
  pageSize?: number
  categoryId?: string
  search?: string
}
export interface RecipesListResponse {
  items: RecipeDTO[]
  total: number
  page: number
  pageSize: number
}
export interface RecipesGetRequest { id: string }
export type RecipesGetResponse = RecipeDTO | null
export interface RecipesCreateRequest {
  title: string
  description?: string | null
  prepTime?: number | null
  difficulty?: 'Easy' | 'Medium' | 'Hard' | null
  categoryId: string
  userId?: string | null
}
export interface RecipesCreateResponse { id: string }

export interface RecipesUpdateRequest {
  id: string
  title?: string
  description?: string | null
  prepTime?: number | null
  difficulty?: 'Easy' | 'Medium' | 'Hard' | null
  categoryId?: string
  userId?: string | null
}

export interface RecipesDeleteRequest { id: string }

// Ingredients
export interface IngredientDTO {
  id: string
  name: string
  unitId: string
  stockQty: number
}
export interface IngredientsListRequest {
  page?: number
  pageSize?: number
  search?: string
  unitId?: string
}
export interface IngredientsListResponse {
  items: IngredientDTO[]
  total: number
  page: number
  pageSize: number
}
export interface IngredientCreateRequest {
  name: string
  unitId: string
  stockQty: number
}
export interface IngredientCreateResponse { id: string }
export interface IngredientUpdateRequest {
  id: string
  name?: string
  unitId?: string
  stockQty?: number
}
export interface IngredientDeleteRequest { id: string }

// Units
export interface UnitDTO {
  id: string
  code: string
  name: string
}
export interface UnitsListRequest {
  page?: number
  pageSize?: number
  search?: string
}
export interface UnitsListResponse {
  items: UnitDTO[]
  total: number
  page: number
  pageSize: number
}

// Ingredient usage
export interface IngredientUsageRequest { id: string }
export interface IngredientUsageResponse { count: number }

// Categories
export interface CategoryDTO {
  id: string
  name: string
}
export interface CategoriesListRequest {
  page?: number
  pageSize?: number
  search?: string
}
export interface CategoriesListResponse {
  items: CategoryDTO[]
  total: number
  page: number
  pageSize: number
}

// Optional typed mapping for invoke patterns
export interface InvokeContracts {
  [Channels.App_Ping]: { request: void; response: { ok: true; timestamp: number } }
  [Channels.Recipes_List]: { request: RecipesListRequest; response: RecipesListResponse }
  [Channels.Recipes_Get]: { request: RecipesGetRequest; response: RecipesGetResponse }
  [Channels.Recipes_Create]: { request: RecipesCreateRequest; response: RecipesCreateResponse }
  [Channels.Recipes_Update]: { request: RecipesUpdateRequest; response: { ok: true } }
  [Channels.Recipes_Delete]: { request: RecipesDeleteRequest; response: { ok: true } }

  [Channels.Ingredients_List]: { request: IngredientsListRequest; response: IngredientsListResponse }
  [Channels.Ingredients_Create]: { request: IngredientCreateRequest; response: IngredientCreateResponse }
  [Channels.Ingredients_Update]: { request: IngredientUpdateRequest; response: { ok: true } }
  [Channels.Ingredients_Delete]: { request: IngredientDeleteRequest; response: { ok: true } }

  [Channels.Units_List]: { request: UnitsListRequest; response: UnitsListResponse }
  [Channels.Ingredients_Usage]: { request: IngredientUsageRequest; response: IngredientUsageResponse }
  [Channels.Categories_List]: { request: CategoriesListRequest; response: CategoriesListResponse }
}


