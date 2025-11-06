import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'

export async function findUnits(params: { page: number; pageSize: number; search?: string }) {
  const where: Prisma.unitsWhereInput = {}
  if (params.search) {
    // search in code or name
    where.OR = [
      { code: { contains: params.search } },
      { name: { contains: params.search } },
    ]
  }

  const [total, rows] = await Promise.all([
    prisma.units.count({ where }),
    prisma.units.findMany({
      where,
      orderBy: { code: 'asc' },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ])

  return {
    total,
    rows: rows.map((u) => ({ id: u.id_unit.toString(), code: u.code, name: u.name })),
  }
}
