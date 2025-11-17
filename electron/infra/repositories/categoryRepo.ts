import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'

export async function findCategories(params: { page: number; pageSize: number; search?: string }) {
  const where: Prisma.categoriesWhereInput = {}
  if (params.search) where.name = { contains: params.search }

  const [total, rows] = await Promise.all([
    prisma.categories.count({ where }),
    prisma.categories.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ])

  return {
    total,
    rows: rows.map((c) => ({ id: c.id_category.toString(), name: c.name })),
  }
}

export async function createCategory(data: { name: string }) {
  const category = await prisma.categories.create({
    data: { name: data.name },
  })
  return { id: category.id_category.toString() }
}

export async function updateCategory(data: { id: string; name: string }) {
  // Récupérer la catégorie actuelle pour vérifier si le nom a changé
  const current = await prisma.categories.findUnique({
    where: { id_category: BigInt(data.id) },
  })

  // Si le nom n'a pas changé, ne rien faire (évite l'erreur de contrainte unique)
  if (current && current.name === data.name) {
    return
  }

  // Sinon, mettre à jour
  await prisma.categories.update({
    where: { id_category: BigInt(data.id) },
    data: { name: data.name },
  })
}

export async function deleteCategory(id: string) {
  await prisma.categories.delete({
    where: { id_category: BigInt(id) },
  })
}


