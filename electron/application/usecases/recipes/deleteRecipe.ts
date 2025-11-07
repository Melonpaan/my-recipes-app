import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { RecipesDeleteRequest } from '../../../../shared/ipc'
import { deleteRecipe as deleteRecipeRepo, findRecipeById } from '../../../infra/repositories/recipeRepo'
import { AppError } from '../../errors'

const Input = z.object({ id: z.string().min(1) })

export async function deleteRecipe(input: RecipesDeleteRequest): Promise<{ ok: true }> {
  const p = Input.parse(input)
  const exists = await findRecipeById(p.id)
  if (!exists) throw AppError.notFound('recipe', p.id)

  try {
    await deleteRecipeRepo(p.id)
    return { ok: true }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw AppError.foreignKeyViolation('Recipe is referenced')
      }
    }
    throw error
  }
}


