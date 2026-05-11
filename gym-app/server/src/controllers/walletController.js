const walletService = require('../services/walletService');
const revenueService = require('../services/revenueService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMyWallet = async (req, res) => {
  try {
    const wallet = await walletService.getOrCreateWallet(req.user.id);
    res.json(wallet);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Top-up using a mock card (now allowed for any role)
exports.payWithCard = async (req, res) => {
  try {
    const { cardId, amount } = req.body;
    const topUpAmount = parseFloat(amount);
    if (!cardId || !topUpAmount || topUpAmount <= 0) {
      return res.status(400).json({ error: 'Valid cardId and amount required' });
    }

    const card = await prisma.mockCard.findUnique({ where: { id: parseInt(cardId) } });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    if (card.balance < topUpAmount) return res.status(400).json({ error: 'Insufficient card balance' });

    // Deduct from card
    await prisma.mockCard.update({
      where: { id: card.id },
      data: { balance: card.balance - topUpAmount },
    });

    // Add to user wallet
    const wallet = await walletService.getOrCreateWallet(req.user.id);
    await prisma.wallet.update({
      where: { userId: req.user.id },
      data: { balance: wallet.balance + topUpAmount },
    });

    // Add to gym revenue
    await revenueService.addRevenue(topUpAmount);

    res.json({ message: 'Top-up successful', wallet: await walletService.getOrCreateWallet(req.user.id) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};