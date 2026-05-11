const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ----- Mock Cards (existing) -----
  await prisma.mockCard.createMany({
    data: [
      { cardNumber: '4111111111111111', holderName: 'John Doe', expiry: '12/25', cvv: '123', balance: 1000.0 },
      { cardNumber: '5500000000000004', holderName: 'Jane Smith', expiry: '11/26', cvv: '456', balance: 500.0 },
      { cardNumber: '340000000000009',  holderName: 'Bob Johnson', expiry: '10/24', cvv: '789', balance: 250.0 },
      { cardNumber: '6011000000000004', holderName: 'Alice Brown', expiry: '09/27', cvv: '321', balance: 750.0 },
    ],
    skipDuplicates: true,
  });

  // ----- Shop Products (new) -----
  await prisma.product.createMany({
    data: [
      { name: 'Whey Protein (1kg)', description: 'Chocolate flavor', price: 29.99, category: 'SUPPLEMENT' },
      { name: 'Energy Bar Box', description: '12 bars', price: 14.99, category: 'FOOD' },
      { name: 'Pre-Workout Powder', description: '300g', price: 24.99, category: 'SUPPLEMENT' },
      { name: 'Gym Towel', description: 'Quick-dry', price: 9.99, category: 'ACCESSORY' },
    ],
    skipDuplicates: true,
  });

  // ----- Subscription Plans (new) -----
  await prisma.subscriptionPlan.createMany({
    data: [
      { name: 'Basic', price: 49.99, sessionCount: 10, description: '10 sessions per month' },
      { name: 'Standard', price: 89.99, sessionCount: 25, description: '25 sessions per month' },
      { name: 'Premium', price: 149.99, sessionCount: 50, description: 'Unlimited access (50 sessions)' },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());