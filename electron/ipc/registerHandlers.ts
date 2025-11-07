import { ipcMain } from 'electron'
import { Channels } from '../../shared/ipc'
import { ping } from '../application/usecases/ping'
import { listRecipes } from '../application/usecases/recipes/listRecipes'
import { getRecipe } from '../application/usecases/recipes/getRecipe'
import { createRecipe } from '../application/usecases/recipes/createRecipe'
import { updateRecipe } from '../application/usecases/recipes/updateRecipe'
import { deleteRecipe } from '../application/usecases/recipes/deleteRecipe'
import { listIngredients } from '../application/usecases/ingredients/listIngredients'
import { createIngredientUc } from '../application/usecases/ingredients/createIngredient'
import { updateIngredientUc } from '../application/usecases/ingredients/updateIngredient'
import { deleteIngredientUc } from '../application/usecases/ingredients/deleteIngredient'
import { listUnits } from '../application/usecases/units/listUnits'
import { listCategories } from '../application/usecases/categories/listCategories'
import { usageIngredientUc } from '../application/usecases/ingredients/usageIngredient'

export function registerIpcHandlers(): void {
  ipcMain.handle(Channels.App_Ping, async () => {
    return await ping()
  })

  ipcMain.handle(Channels.Recipes_List, async (_event, request) => {
    return await listRecipes(request)
  })

  ipcMain.handle(Channels.Recipes_Get, async (_event, request) => {
    return await getRecipe(request)
  })

  ipcMain.handle(Channels.Recipes_Create, async (_event, request) => {
    return await createRecipe(request)
  })

  ipcMain.handle(Channels.Recipes_Update, async (_event, request) => {
    return await updateRecipe(request)
  })

  ipcMain.handle(Channels.Recipes_Delete, async (_event, request) => {
    return await deleteRecipe(request)
  })

  ipcMain.handle(Channels.Ingredients_List, async (_event, request) => {
    return await listIngredients(request)
  })

  ipcMain.handle(Channels.Ingredients_Create, async (_event, request) => {
    return await createIngredientUc(request)
  })

  ipcMain.handle(Channels.Ingredients_Update, async (_event, request) => {
    return await updateIngredientUc(request)
  })

  ipcMain.handle(Channels.Ingredients_Delete, async (_event, request) => {
    return await deleteIngredientUc(request)
  })

  ipcMain.handle(Channels.Units_List, async (_event, request) => {
    return await listUnits(request)
  })

  ipcMain.handle(Channels.Categories_List, async (_event, request) => {
    return await listCategories(request)
  })

  ipcMain.handle(Channels.Ingredients_Usage, async (_event, request) => {
    return await usageIngredientUc(request)
  })
}


