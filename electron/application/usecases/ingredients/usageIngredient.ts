import { z } from 'zod'
import type { IngredientUsageRequest, IngredientUsageResponse } from '../../../../shared/ipc'
import { countIngredientUsage } from '../../../infra/repositories/ingredientRepo'

const Input = z.object({ id: z.string().min(1) })

export async function usageIngredientUc(input: IngredientUsageRequest): Promise<IngredientUsageResponse> {
  const p = Input.parse(input)
  return await countIngredientUsage(p.id)
}


