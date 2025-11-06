import { prisma } from '../../db/prisma'
import type {
  RecipeDTO,
  RecipesListRequest,
  RecipesListResponse,
  RecipesGetRequest,
  RecipesGetResponse,
  RecipesCreateRequest,
  RecipesCreateResponse,
} from '../../../shared/ipc'

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

export async function listRecipes(params: RecipesListRequest = {}): Promise<RecipesListResponse> {
  const page = Math.max(params.page ?? 1, 1)
  const pageSize = Math.min(Math.max(params.pageSize ?? 20, 1), 100)
  // Prisma where typing is verbose; keep IPC-friendly code and narrow via runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  if (params.categoryId) where.id_category = BigInt(params.categoryId)
  if (params.search) where.title = { contains: params.search }

  const [total, rows] = await Promise.all([
    prisma.recipes.count({ where }),
    prisma.recipes.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return {
    items: rows.map(toRecipeDTO),
    total,
    page,
    pageSize,
  }
}

export async function getRecipe({ id }: RecipesGetRequest): Promise<RecipesGetResponse> {
  const row = await prisma.recipes.findUnique({ where: { id_recipe: BigInt(id) } })
  return row ? toRecipeDTO(row) : null
}

export async function createRecipe(req: RecipesCreateRequest): Promise<RecipesCreateResponse> {
  const created = await prisma.recipes.create({
    data: {
      title: req.title,
      description: req.description ?? null,
      prep_time: req.prepTime ?? null,
      difficulty: req.difficulty ?? null,
      id_category: BigInt(req.categoryId),
      id_user: req.userId != null ? BigInt(req.userId) : null,
    },
  })
  return { id: toId(created.id_recipe) }
}
