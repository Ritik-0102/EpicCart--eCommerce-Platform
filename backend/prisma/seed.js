const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Starting the database seed process...');

  // 1. Create a sample Category
  const electronicsCategory = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {}, // Do nothing if it already exists
    create: {
      name: 'Electronics',
      description: 'Gadgets, devices, and accessories.',
    },
  });

  console.log(`Created/Found category: ${electronicsCategory.name}`);

  // 2. Create sample Products linked to the Category
  const product1 = await prisma.product.create({
    data: {
      name: 'Pro Wireless Headphones',
      description: 'Noise-cancelling over-ear headphones with 40-hour battery life.',
      price: 199.99,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      categoryId: electronicsCategory.id, // Foreign Key connection
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Minimalist Smartwatch',
      description: 'Fitness tracker and smartwatch with heart rate monitoring.',
      price: 149.00,
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
      categoryId: electronicsCategory.id, // Foreign Key connection
    },
  });

  console.log(`Created products: ${product1.name}, ${product2.name}`);
  console.log('Database seeding completed successfully!');
}

// Execute the main function, then cleanly disconnect from the database
main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
