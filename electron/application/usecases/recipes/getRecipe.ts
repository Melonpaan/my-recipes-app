import { z } from 'zod'
import type { RecipesGetRequest, RecipesGetResponse } from '../../../../shared/ipc'
import { findRecipeById } from '../../../infra/repositories/recipeRepo'

const Input = z.object({
  id: z.string().min(1),
})

export async function getRecipe(input: RecipesGetRequest): Promise<RecipesGetResponse> {
  const p = Input.parse(input)
  return await findRecipeById(p.id)
}

