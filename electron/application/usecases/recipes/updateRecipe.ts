import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { RecipesUpdateRequest } from '../../../../shared/ipc'
import { updateRecipe as updateRecipeRepo, findRecipeById } from '../../../infra/repositories/recipeRepo'
import { AppError } from '../../errors'

const Input = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(160).optional(),
  description: z.string().max(5000).optional().nullable(),
  prepTime: z.number().int().min(0).max(10000).optional().nullable(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional().nullable(),
  categoryId: z.string().min(1).optional(),
  userId: z.string().optional().nullable(),
}).refine((d) => d.title !== undefined || d.description !== undefined || d.prepTime !== undefined || d.difficulty !== undefined || d.categoryId !== undefined || d.userId !== undefined, {
  message: 'Nothing to update',
})

export async function updateRecipe(input: RecipesUpdateRequest): Promise<{ ok: true }> {
  const p = Input.parse(input)
  const exists = await findRecipeById(p.id)
  if (!exists) throw AppError.notFound('recipe', p.id)

  try {
    await updateRecipeRepo(p)
    return { ok: true }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw AppError.foreignKeyViolation('Invalid category or user reference')
      }
    }
    throw error
  }
}


