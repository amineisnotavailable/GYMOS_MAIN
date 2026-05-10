const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.mockCard.createMany({
    data: [
      { cardNumber: '4111111111111111', holderName: 'John Doe', expiry: '12/25', cvv: '123', balance: 1000.0 },
      { cardNumber: '5500000000000004', holderName: 'Jane Smith', expiry: '11/26', cvv: '456', balance: 500.0 },
      { cardNumber: '340000000000009',  holderName: 'Bob Johnson', expiry: '10/24', cvv: '789', balance: 250.0 },
      { cardNumber: '6011000000000004', holderName: 'Alice Brown', expiry: '09/27', cvv: '321', balance: 750.0 },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());