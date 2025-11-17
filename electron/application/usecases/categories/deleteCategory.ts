import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { CategoryDeleteRequest } from '../../../../shared/ipc'
import { deleteCategory as deleteCategoryRepo } from '../../../infra/repositories/categoryRepo'
import { AppError } from '../../errors'

const Input = z.object({ id: z.string().min(1) })

export async function deleteCategory(input: CategoryDeleteRequest): Promise<{ ok: true }> {
  const p = Input.parse(input)
  try {
    await deleteCategoryRepo(p.id)
    return { ok: true }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw AppError.foreignKeyViolation('Impossible de supprimer cette catégorie : elle est utilisée par des recettes')
    }
    throw error
  }
}

