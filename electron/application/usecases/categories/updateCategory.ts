import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { updateCategory as updateCategoryRepo } from '../../../infra/repositories/categoryRepo'
import { AppError } from '../../errors'

const Input = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(80),
})

export async function updateCategory(input: unknown): Promise<{ ok: true }> {
  const p = Input.parse(input)
  try {
    await updateCategoryRepo(p)
    return { ok: true }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw AppError.conflict('Une catégorie avec ce nom existe déjà')
    }
    throw error
  }
}

