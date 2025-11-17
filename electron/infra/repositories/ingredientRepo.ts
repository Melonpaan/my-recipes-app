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

export async function createIngredient(data: { name: string; unitId: string; stockQty: number }) {
  const row = await prisma.ingredients.create({
    data: {
      name: data.name,
      id_unit: BigInt(data.unitId),
      stock_qty: data.stockQty.toString(),
    },
  })
  return { id: row.id_ingredient.toString() }
}

export async function updateIngredient(data: { id: string; name?: string; unitId?: string; stockQty?: number }) {
  // Récupérer l'ingrédient actuel pour vérifier les changements
  const current = await prisma.ingredients.findUnique({
    where: { id_ingredient: BigInt(data.id) },
  })

  if (!current) return

  // Vérifier si name et unitId ont changé (contrainte unique sur [name, unitId])
  const nameChanged = data.name !== undefined && data.name !== current.name
  const unitChanged = data.unitId !== undefined && data.unitId !== current.id_unit.toString()
  const stockChanged = data.stockQty !== undefined && data.stockQty.toString() !== current.stock_qty.toString()

  // Si rien n'a changé, ne rien faire
  if (!nameChanged && !unitChanged && !stockChanged) {
    return
  }

  // Construire l'objet data avec seulement les champs qui ont changé
  const updateData: {
    name?: string
    id_unit?: bigint
    stock_qty?: string
  } = {}

  if (nameChanged) updateData.name = data.name
  if (unitChanged) updateData.id_unit = BigInt(data.unitId!)
  if (stockChanged) updateData.stock_qty = data.stockQty!.toString()

  // Mettre à jour
  await prisma.ingredients.update({
    where: { id_ingredient: BigInt(data.id) },
    data: updateData,
  })
}

export async function deleteIngredient(id: string) {
  await prisma.ingredients.delete({ where: { id_ingredient: BigInt(id) } })
}

export async function countIngredientUsage(id: string) {
  const count = await prisma.recipe_ingredients.count({ where: { id_ingredient: BigInt(id) } })
  return { count }
}
