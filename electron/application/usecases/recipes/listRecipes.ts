import { z } from 'zod'
import type { RecipesListResponse } from '../../../../shared/ipc'
import { findRecipes } from '../../../infra/repositories/recipeRepo'

const Input = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  categoryId: z.string().optional(),
  search: z.string().min(1).max(160).optional(),
})

export async function listRecipes(input: unknown): Promise<RecipesListResponse> {
  const p = Input.parse(input ?? {})
  const { total, rows } = await findRecipes(p)
  return { items: rows, total, page: p.page, pageSize: p.pageSize }
}

