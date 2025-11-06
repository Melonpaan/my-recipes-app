import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { RecipesCreateRequest, RecipesCreateResponse } from '../../../../shared/ipc'
import { createRecipe as createRecipeRepo } from '../../../infra/repositories/recipeRepo'
import { AppError } from '../../errors'

const Input = z.object({
  title: z.string().min(1).max(160),
  description: z.string().max(5000).optional().nullable(),
  prepTime: z.number().int().min(0).max(10000).optional().nullable(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional().nullable(),
  categoryId: z.string().min(1),
  userId: z.string().optional().nullable(),
})

export async function createRecipe(input: RecipesCreateRequest): Promise<RecipesCreateResponse> {
  const p = Input.parse(input)
  try {
    return await createRecipeRepo(p)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw AppError.foreignKeyViolation('Invalid category or user reference')
      }
    }
    throw error
  }
}

