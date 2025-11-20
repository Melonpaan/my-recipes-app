import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { RecipeIngredientsSetRequest } from '../../../../shared/ipc'
import { setRecipeIngredients as setRecipeIngredientsRepo, findRecipeById } from '../../../infra/repositories/recipeRepo'
import { AppError } from '../../errors'

const Input = z.object({
  recipeId: z.string().min(1),
  ingredients: z.array(
    z.object({
      ingredientId: z.string().min(1),
      quantity: z.coerce.number().positive(),
    })
  ),
})

export async function setRecipeIngredients(input: RecipeIngredientsSetRequest): Promise<{ ok: true }> {
  const p = Input.parse(input)

  // Vérifier que la recette existe
  const exists = await findRecipeById(p.recipeId)
  if (!exists) throw AppError.notFound('recipe', p.recipeId)

  try {
    // Convertir les quantities de number vers string pour Prisma
    await setRecipeIngredientsRepo({
      recipeId: p.recipeId,
      ingredients: p.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        quantity: ing.quantity.toString(),
      })),
    })
    return { ok: true }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw AppError.foreignKeyViolation('Référence d\'ingrédient invalide')
      }
      if (error.code === 'P2002') {
        throw AppError.conflict('Ingrédient déjà présent dans cette recette')
      }
    }
    throw error
  }
}

