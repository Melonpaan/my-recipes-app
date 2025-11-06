import { z } from 'zod'
import type { CategoriesListResponse } from '../../../../shared/ipc'
import { findCategories } from '../../../infra/repositories/categoryRepo'

const Input = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(50),
  search: z.string().min(1).max(120).optional(),
})

export async function listCategories(input: unknown): Promise<CategoriesListResponse> {
  const p = Input.parse(input ?? {})
  const { total, rows } = await findCategories(p)
  return { items: rows, total, page: p.page, pageSize: p.pageSize }
}


