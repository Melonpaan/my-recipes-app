import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { IngredientCreateRequest, IngredientCreateResponse } from '../../../../shared/ipc'
import { createIngredient } from '../../../infra/repositories/ingredientRepo'

const Input = z.object({
  name: z.string().min(1).max(120),
  unitId: z.string().min(1),
  stockQty: z.string().regex(/^\d+(\.\d{1,3})?$/).optional().default('0'),
})

export async function createIngredientUc(input: IngredientCreateRequest): Promise<IngredientCreateResponse> {
  const p = Input.parse(input)
  try {
    return await createIngredient(p)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('Ingredient with same name and unit already exists')
    }
    throw error
  }
}


