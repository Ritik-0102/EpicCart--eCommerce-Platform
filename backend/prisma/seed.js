const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedData = [
  {
    category: { name: 'Electronics', description: 'Gadgets, devices, and accessories.' },
    products: [
      { name: 'Pro Wireless Headphones', description: 'Noise-cancelling over-ear headphones with 40-hour battery life.', price: 199.99, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
      { name: 'Minimalist Smartwatch', description: 'Fitness tracker and smartwatch with heart rate monitoring.', price: 149.00, stock: 120, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
      { name: '4K Ultra HD Action Camera', description: 'Waterproof action camera with 4K recording and Wi-Fi.', price: 299.99, stock: 35, imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80' },
      { name: 'Mechanical Gaming Keyboard', description: 'RGB backlit mechanical keyboard with tactile switches.', price: 89.50, stock: 75, imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
      { name: 'Ergonomic Wireless Mouse', description: 'Vertical ergonomic mouse designed for comfort and precision.', price: 45.00, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' },
      { name: '10000mAh Power Bank', description: 'Fast-charging portable power bank with dual USB ports.', price: 29.99, stock: 200, imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80' },
      { name: 'Portable Bluetooth Speaker', description: 'Water-resistant speaker with 360-degree sound and 24h playtime.', price: 59.99, stock: 85, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80' },
      { name: '27-inch 144Hz Gaming Monitor', description: 'IPS panel gaming monitor with 1ms response time.', price: 349.99, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' }
    ]
  },
  {
    category: { name: 'Clothing', description: 'Apparel for men and women.' },
    products: [
      { name: 'Classic Cotton T-Shirt', description: 'Premium 100% cotton crewneck t-shirt.', price: 19.99, stock: 300, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
      { name: 'Slim Fit Denim Jeans', description: 'Comfortable stretch denim with a modern slim fit.', price: 49.99, stock: 150, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80' },
      { name: 'Lightweight Running Jacket', description: 'Windproof and water-resistant jacket for outdoor running.', price: 65.00, stock: 60, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80' },
      { name: 'Casual Sneakers', description: 'Everyday lifestyle sneakers with breathable mesh.', price: 79.99, stock: 110, imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80' },
      { name: 'Wool Blend Winter Coat', description: 'Elegant and warm coat for cold weather.', price: 129.50, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&q=80' },
      { name: 'Athletic Performance Shorts', description: 'Moisture-wicking shorts suitable for workouts and sports.', price: 24.99, stock: 200, imageUrl: 'https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?w=500&q=80' },
      { name: 'Cozy Fleece Hoodie', description: 'Soft and comfortable pullover hoodie with kangaroo pocket.', price: 39.99, stock: 180, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80' }
    ]
  },
  {
    category: { name: 'Home & Kitchen', description: 'Everything you need for your home.' },
    products: [
      { name: 'Ceramic Coffee Mug Set', description: 'Set of 4 minimalist matte finish ceramic mugs.', price: 34.99, stock: 90, imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' },
      { name: 'Stainless Steel Chef\'s Knife', description: 'Professional 8-inch chef knife with ergonomic handle.', price: 89.99, stock: 45, imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&q=80' },
      { name: 'Non-Stick Frying Pan', description: '10-inch skillet with scratch-resistant coating.', price: 45.50, stock: 80, imageUrl: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=500&q=80' },
      { name: 'Smart LED Light Bulb', description: 'Wi-Fi enabled color changing bulb works with Alexa and Google.', price: 15.99, stock: 250, imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&q=80' },
      { name: 'Essential Oil Diffuser', description: 'Ultrasonic aromatherapy diffuser with ambient lighting.', price: 28.00, stock: 110, imageUrl: 'https://images.unsplash.com/photo-1608528577891-eb05facdbada?w=500&q=80' },
      { name: 'Vacuum Insulated Water Bottle', description: 'Keeps drinks cold for 24 hours or hot for 12 hours.', price: 22.99, stock: 160, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80' },
      { name: 'Bamboo Cutting Board', description: 'Eco-friendly, durable, and knife-friendly prep board.', price: 18.50, stock: 130, imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&q=80' }
    ]
  },
  {
    category: { name: 'Sports & Outdoors', description: 'Gear up for your next adventure.' },
    products: [
      { name: 'Yoga Mat with Alignment Lines', description: 'Non-slip eco-friendly TPE yoga mat with carrying strap.', price: 29.99, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b06b3848?w=500&q=80' },
      { name: 'Adjustable Dumbbells Set', description: 'Space-saving weights that adjust from 5 to 52 lbs.', price: 199.00, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80' },
      { name: 'Resistance Bands Set', description: 'Set of 5 exercise bands with varying resistance levels.', price: 14.99, stock: 300, imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80' },
      { name: 'Camping Hammock', description: 'Lightweight parachute nylon hammock with tree straps.', price: 35.00, stock: 75, imageUrl: 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?w=500&q=80' },
      { name: 'High-Performance Tennis Racket', description: 'Carbon fiber racket designed for power and spin.', price: 110.00, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1622279457486-69d73ce58b09?w=500&q=80' },
      { name: 'Hydration Pack Backpack', description: '2L water bladder backpack for hiking and cycling.', price: 42.50, stock: 65, imageUrl: 'https://images.unsplash.com/photo-1591550275822-1d5334706915?w=500&q=80' },
      { name: 'Microfiber Travel Towel', description: 'Fast-drying and super absorbent towel for gym or travel.', price: 16.99, stock: 150, imageUrl: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=500&q=80' },
      { name: 'Foam Roller for Muscle Massage', description: 'High-density foam roller for physical therapy and exercise.', price: 19.50, stock: 120, imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80' }
    ]
  }
];

async function main() {
  console.log('Starting the database seed process (Idempotent 30 Products)...');

  for (const catData of seedData) {
    // 1. Idempotent Category creation (name is unique)
    const category = await prisma.category.upsert({
      where: { name: catData.category.name },
      update: { description: catData.category.description },
      create: {
        name: catData.category.name,
        description: catData.category.description,
      },
    });
    console.log(`\nProcessed category: ${category.name}`);

    // 2. Idempotent Product creation (checking by name)
    let added = 0;
    let updated = 0;
    
    for (const prodData of catData.products) {
      const existingProduct = await prisma.product.findFirst({
        where: { name: prodData.name }
      });

      if (existingProduct) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            description: prodData.description,
            price: prodData.price,
            stock: prodData.stock,
            imageUrl: prodData.imageUrl,
            categoryId: category.id
          }
        });
        updated++;
      } else {
        await prisma.product.create({
          data: {
            name: prodData.name,
            description: prodData.description,
            price: prodData.price,
            stock: prodData.stock,
            imageUrl: prodData.imageUrl,
            categoryId: category.id
          }
        });
        added++;
      }
    }
    console.log(` -> Products added: ${added}, updated: ${updated}`);
  }

  console.log('\nDatabase seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
