import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'

export async function findIngredients(params: {
  page: number
  pageSize: number
  search?: string
  unitId?: string
}) {
  const where: Prisma.ingredientsWhereInput = {}
  if (params.search) where.name = { contains: params.search }
  if (params.unitId) where.id_unit = BigInt(params.unitId)

  const [total, rows] = await Promise.all([
    prisma.ingredients.count({ where }),
    prisma.ingredients.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ])

  return {
    total,
    rows: rows.map((r) => ({
      id: r.id_ingredient.toString(),
      name: r.name,
      unitId: r.id_unit.toString(),
      stockQty: r.stock_qty.toString(),
    })),
  }
}

export async function createIngredient(data: { name: string; unitId: string; stockQty: string }) {
  const row = await prisma.ingredients.create({
    data: {
      name: data.name,
      id_unit: BigInt(data.unitId),
      stock_qty: data.stockQty,
    },
  })
  return { id: row.id_ingredient.toString() }
}

export async function updateIngredient(data: { id: string; name?: string; unitId?: string; stockQty?: string }) {
  await prisma.ingredients.update({
    where: { id_ingredient: BigInt(data.id) },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.unitId !== undefined ? { id_unit: BigInt(data.unitId) } : {}),
      ...(data.stockQty !== undefined ? { stock_qty: data.stockQty } : {}),
    },
  })
}

export async function deleteIngredient(id: string) {
  await prisma.ingredients.delete({ where: { id_ingredient: BigInt(id) } })
}

export async function countIngredientUsage(id: string) {
  const count = await prisma.recipe_ingredients.count({ where: { id_ingredient: BigInt(id) } })
  return { count }
}
