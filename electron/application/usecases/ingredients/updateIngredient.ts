import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { IngredientUpdateRequest } from '../../../../shared/ipc'
import { updateIngredient } from '../../../infra/repositories/ingredientRepo'

const Input = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120).optional(),
  unitId: z.string().min(1).optional(),
  stockQty: z.string().regex(/^\d+(\.\d{1,3})?$/).optional(),
}).refine((d) => d.name !== undefined || d.unitId !== undefined || d.stockQty !== undefined, {
  message: 'Nothing to update',
})

export async function updateIngredientUc(input: IngredientUpdateRequest): Promise<{ ok: true }> {
  const p = Input.parse(input)
  try {
    await updateIngredient(p)
    return { ok: true }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('Ingredient with same name and unit already exists')
    }
    throw error
  }
}


