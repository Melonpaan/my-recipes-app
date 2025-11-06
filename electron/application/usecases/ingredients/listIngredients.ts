import { z } from 'zod'
import type { IngredientsListResponse } from '../../../../shared/ipc'
import { findIngredients } from '../../../infra/repositories/ingredientRepo'

const Input = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(160).optional(),
  unitId: z.string().optional(),
})

export async function listIngredients(input: unknown): Promise<IngredientsListResponse> {
  const p = Input.parse(input ?? {})
  const { total, rows } = await findIngredients(p)
  return { items: rows, total, page: p.page, pageSize: p.pageSize }
}
