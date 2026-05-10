const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getWalletByUserId = async (userId) => {
  return prisma.wallet.findUnique({ where: { userId } });
};

exports.createWallet = async (userId) => {
  return prisma.wallet.create({ data: { userId, balance: 0.0 } });
};

exports.getOrCreateWallet = async (userId) => {
  let wallet = await exports.getWalletByUserId(userId);
  if (!wallet) wallet = await exports.createWallet(userId);
  return wallet;
};

exports.topUp = async (userId, amount) => {
  const wallet = await exports.getOrCreateWallet(userId);
  return prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: wallet.balance + amount },
  });
};

exports.transfer = async (fromUserId, toUserId, amount, description) => {
  const fromWallet = await exports.getOrCreateWallet(fromUserId);
  if (fromWallet.balance < amount) throw new Error('Insufficient funds');
  const toWallet = await exports.getOrCreateWallet(toUserId);
  await prisma.wallet.update({ where: { id: fromWallet.id }, data: { balance: fromWallet.balance - amount } });
  await prisma.wallet.update({ where: { id: toWallet.id }, data: { balance: toWallet.balance + amount } });
  return prisma.transaction.create({
    data: { fromWalletId: fromWallet.id, toWalletId: toWallet.id, amount, description },
  });
};