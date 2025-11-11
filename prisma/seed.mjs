import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const kitchenUnits = [
  { code: 'g', name: 'Gramme' },
  { code: 'kg', name: 'Kilogramme' },
  { code: 'mg', name: 'Milligramme' },
  { code: 'lb', name: 'Livre' },
  { code: 'oz', name: 'Once' },
  { code: 'ml', name: 'Millilitre' },
  { code: 'l', name: 'Litre' },
  { code: 'tsp', name: 'Cuillère à café' },
  { code: 'tbsp', name: 'Cuillère à soupe' },
  { code: 'cup', name: 'Tasse' },
  { code: 'piece', name: 'Pièce' },
  { code: 'pinch', name: 'Pincée' },
]

async function main() {
  for (const unit of kitchenUnits) {
    await prisma.units.upsert({
      where: { code: unit.code },
      update: unit,
      create: unit,
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    // eslint-disable-next-line no-undef
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

