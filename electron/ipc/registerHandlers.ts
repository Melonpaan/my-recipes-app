import { ipcMain } from 'electron'
import { Channels } from '../../shared/ipc'
import { ping } from '../application/usecases/ping'
import { listRecipes } from '../application/usecases/recipes/listRecipes'
import { getRecipe } from '../application/usecases/recipes/getRecipe'
import { createRecipe } from '../application/usecases/recipes/createRecipe'
import { updateRecipe } from '../application/usecases/recipes/updateRecipe'
import { deleteRecipe } from '../application/usecases/recipes/deleteRecipe'
import { setRecipeIngredients } from '../application/usecases/recipes/setRecipeIngredients'
import { listIngredients } from '../application/usecases/ingredients/listIngredients'
import { createIngredientUc } from '../application/usecases/ingredients/createIngredient'
import { updateIngredientUc } from '../application/usecases/ingredients/updateIngredient'
import { deleteIngredientUc } from '../application/usecases/ingredients/deleteIngredient'
import { listUnits } from '../application/usecases/units/listUnits'
import { listCategories } from '../application/usecases/categories/listCategories'
import { createCategory } from '../application/usecases/categories/createCategory'
import { updateCategory } from '../application/usecases/categories/updateCategory'
import { deleteCategory } from '../application/usecases/categories/deleteCategory'

// Helper to preserve error messages across IPC boundary
function wrapHandler<T, R>(handler: (input: T) => Promise<R>) {
  return async (_event: unknown, request: T) => {
    try {
      return await handler(request)
    } catch (error) {
      // Re-throw with preserved message for IPC serialization
      throw new Error(error instanceof Error ? error.message : 'Unknown error')
    }
  }
}

export function registerIpcHandlers(): void {
  // Ping
  ipcMain.handle(Channels.App_Ping, wrapHandler(ping))

  // Recipes
  ipcMain.handle(Channels.Recipes_List, wrapHandler(listRecipes))
  ipcMain.handle(Channels.Recipes_Get, wrapHandler(getRecipe))
  ipcMain.handle(Channels.Recipes_Create, wrapHandler(createRecipe))
  ipcMain.handle(Channels.Recipes_Update, wrapHandler(updateRecipe))
  ipcMain.handle(Channels.Recipes_Delete, wrapHandler(deleteRecipe))
  ipcMain.handle(Channels.RecipeIngredients_Set, wrapHandler(setRecipeIngredients))

  // Ingredients
  ipcMain.handle(Channels.Ingredients_List, wrapHandler(listIngredients))
  ipcMain.handle(Channels.Ingredients_Create, wrapHandler(createIngredientUc))
  ipcMain.handle(Channels.Ingredients_Update, wrapHandler(updateIngredientUc))
  ipcMain.handle(Channels.Ingredients_Delete, wrapHandler(deleteIngredientUc))

  // Units
  ipcMain.handle(Channels.Units_List, wrapHandler(listUnits))

  // Categories
  ipcMain.handle(Channels.Categories_List, wrapHandler(listCategories))
  ipcMain.handle(Channels.Categories_Create, wrapHandler(createCategory))
  ipcMain.handle(Channels.Categories_Update, wrapHandler(updateCategory))
  ipcMain.handle(Channels.Categories_Delete, wrapHandler(deleteCategory))
}


