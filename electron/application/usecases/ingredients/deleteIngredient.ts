import { z } from 'zod'
import type { IngredientDeleteRequest } from '../../../../shared/ipc'
import { deleteIngredient } from '../../../infra/repositories/ingredientRepo'
import { Prisma } from '@prisma/client'

const Input = z.object({ id: z.string().min(1) })

export async function deleteIngredientUc(input: IngredientDeleteRequest): Promise<{ ok: true }> {
  const p = Input.parse(input)
  try {
    await deleteIngredient(p.id)
    return { ok: true }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new Error('Cannot delete: ingredient is used by recipes')
    }
    throw error
  }
}


