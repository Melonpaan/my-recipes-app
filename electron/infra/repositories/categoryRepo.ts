import { prisma } from '../../db/prisma'

export async function findCategories(params: { page: number; pageSize: number; search?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
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


