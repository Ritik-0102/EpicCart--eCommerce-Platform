const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  for (const field of ["slug", "sku"]) {
    try {
      const duplicates = await prisma.product.groupBy({
        by: [field],
        where: { [field]: { not: null } },
        _count: { [field]: true },
        having: { [field]: { _count: { gt: 1 } } }
      });

      console.log(`Duplicate ${field} values:`);
      console.dir(duplicates, { depth: null });
    } catch (error) {
      console.log(`Could not check ${field}: ${error.message}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
