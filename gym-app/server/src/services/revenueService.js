const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getGymRevenue = async () => {
  let revenue = await prisma.gymRevenue.findFirst();
  if (!revenue) revenue = await prisma.gymRevenue.create({ data: { totalRevenue: 0.0 } });
  return revenue;
};

exports.addRevenue = async (amount) => {
  const revenue = await exports.getGymRevenue();
  return prisma.gymRevenue.update({
    where: { id: revenue.id },
    data: { totalRevenue: revenue.totalRevenue + amount },
  });
};