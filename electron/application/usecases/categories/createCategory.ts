import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { CategoryCreateResponse } from '../../../../shared/ipc'
import { createCategory as createCategoryRepo } from '../../../infra/repositories/categoryRepo'
import { AppError } from '../../errors'

const Input = z.object({
  name: z.string().min(1).max(80),
})

export async function createCategory(input: unknown): Promise<CategoryCreateResponse> {
  const p = Input.parse(input)
  try {
    return await createCategoryRepo(p)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw AppError.conflict('Une catégorie avec ce nom existe déjà')
    }
    throw error
  }
}

