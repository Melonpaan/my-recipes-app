import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'
import type { RecipeDTO, RecipeDetailDTO, RecipeIngredientDTO } from '../../../shared/ipc'

function toId(value: bigint): string {
  return value.toString()
}

function toDateString(value: Date): string {
  return value.toISOString()
}

type RecipeRow = {
  id_recipe: bigint
  title: string
  description: string | null
  prep_time: number | null
  difficulty: 'Easy' | 'Medium' | 'Hard' | null
  id_category: bigint
  id_user: bigint | null
  created_at: Date
  updated_at: Date
}

function toRecipeDTO(r: RecipeRow): RecipeDTO {
  return {
    id: toId(r.id_recipe),
    title: r.title,
    description: r.description ?? null,
    prepTime: r.prep_time ?? null,
    difficulty: r.difficulty ?? null,
    categoryId: toId(r.id_category),
    userId: r.id_user != null ? toId(r.id_user) : null,
    createdAt: toDateString(r.created_at),
    updatedAt: toDateString(r.updated_at),
  }
}

export async function findRecipes(params: {
  page: number
  pageSize: number
  categoryId?: string
  search?: string
}) {
  const where: Prisma.recipesWhereInput = {}
  if (params.categoryId) where.id_category = BigInt(params.categoryId)
  if (params.search) where.title = { contains: params.search }

  const [total, rows] = await Promise.all([
    prisma.recipes.count({ where }),
    prisma.recipes.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ])

  return {
    total,
    rows: rows.map(toRecipeDTO),
  }
}

export async function findRecipeById(id: string): Promise<RecipeDetailDTO | null> {
  const row = await prisma.recipes.findUnique({
    where: { id_recipe: BigInt(id) },
    include: {
      recipe_ingredients: {
        include: {
          ingredients: {
            include: {
              units: true,
            },
          },
        },
      },
    },
  })

  if (!row) return null

  // Map recipe_ingredients to RecipeIngredientDTO
  const ingredients: RecipeIngredientDTO[] = row.recipe_ingredients.map((ri) => ({
    ingredientId: toId(ri.ingredients.id_ingredient),
    ingredientName: ri.ingredients.name,
    quantity: ri.quantity_needed.toString(),
    unitCode: ri.ingredients.units.code,
    unitName: ri.ingredients.units.name,
  }))

  return {
    ...toRecipeDTO(row),
    ingredients,
  }
}

export async function createRecipe(data: {
  title: string
  description?: string | null
  prepTime?: number | null
  difficulty?: 'Easy' | 'Medium' | 'Hard' | null
  categoryId: string
  userId?: string | null
}) {
  const created = await prisma.recipes.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      prep_time: data.prepTime ?? null,
      difficulty: data.difficulty ?? null,
      id_category: BigInt(data.categoryId),
      id_user: data.userId != null ? BigInt(data.userId) : null,
    },
  })
  return { id: toId(created.id_recipe) }
}

export async function updateRecipe(data: {
  id: string
  title?: string
  description?: string | null
  prepTime?: number | null
  difficulty?: 'Easy' | 'Medium' | 'Hard' | null
  categoryId?: string
  userId?: string | null
}) {
  await prisma.recipes.update({
    where: { id_recipe: BigInt(data.id) },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.prepTime !== undefined ? { prep_time: data.prepTime } : {}),
      ...(data.difficulty !== undefined ? { difficulty: data.difficulty } : {}),
      ...(data.categoryId !== undefined ? { id_category: BigInt(data.categoryId) } : {}),
      ...(data.userId !== undefined ? { id_user: data.userId != null ? BigInt(data.userId) : null } : {}),
    },
  })
}

export async function deleteRecipe(id: string) {
  await prisma.recipes.delete({ where: { id_recipe: BigInt(id) } })
}

export async function setRecipeIngredients(data: {
  recipeId: string
  ingredients: Array<{ ingredientId: string; quantity: string }>
}) {
  const recipeId = BigInt(data.recipeId)

  // Transaction atomique : delete all + insert new
  await prisma.$transaction(async (tx) => {
    // 1. Supprimer tous les ingrédients existants
    await tx.recipe_ingredients.deleteMany({
      where: { id_recipe: recipeId },
    })

    // 2. Insérer les nouveaux (si non vide)
    if (data.ingredients.length > 0) {
      await tx.recipe_ingredients.createMany({
        data: data.ingredients.map((ing) => ({
          id_recipe: recipeId,
          id_ingredient: BigInt(ing.ingredientId),
          quantity_needed: ing.quantity,
        })),
      })
    }
  })
}

