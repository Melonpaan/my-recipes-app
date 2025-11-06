import { z } from 'zod'
import type { UnitsListResponse } from '../../../../shared/ipc'
import { findUnits } from '../../../infra/repositories/unitRepo'

const Input = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(50),
  search: z.string().min(1).max(64).optional(),
})

export async function listUnits(input: unknown): Promise<UnitsListResponse> {
  const p = Input.parse(input ?? {})
  const { total, rows } = await findUnits(p)
  return { items: rows, total, page: p.page, pageSize: p.pageSize }
}
